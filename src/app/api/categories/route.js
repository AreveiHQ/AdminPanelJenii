import { NextResponse } from 'next/server';
import Category from '@/models/category';
import { uploadToCloudinary } from '@/utils/cloudinary'; // Assuming this is your utility for Cloudinary
import { connectToDB } from '@/db';
import slugify from 'slugify';
import { uploadToS3 } from '@/utils/awsS3Bucket';



export async function POST(request) {
  await connectToDB()
  try {
    const formData = await request.formData();
    const name = formData.get('name').toLowerCase();
    const banners = formData.getAll('bannerImages');
    const imageFile = formData.get('image');
    const parentCategory = formData.get('parentCategory').toLowerCase();
    // Check if category already exists

    console.log( banners , imageFile)
    const isExist = await Category.findOne({ name });
    if (isExist && isExist.parentCategory === parentCategory) {
      return NextResponse.json({ message: 'Category Already Exists' }, { status: 403 });
    }
    

    // Handle banner images upload
      const uploadPromises = banners.map(async (file) => {
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          const fileName = `bn-${Date.now()}-${file.name}`;
          const mimeType = file.type;
              return  uploadToS3(fileBuffer,"category/banner/", fileName, mimeType);
        });
    
        const bannerImages = await Promise.all(uploadPromises);
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer()); // Convert file to Buffer
        const image =await uploadToS3(imageBuffer,"category/card/", `card-${Date.now()}-${imageFile.name}`, imageFile.type);

    const newCategory = new Category({
      name,
      slug:slugify(name),
      bannerImages,
      image,
      parentCategory,
    });

    // Save the category to the database
    await newCategory.save();

    return NextResponse.json({ message: 'Category Added Successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ message: 'Server error',error }, { status: 500 });
  }
}

export async function GET() {
  await connectToDB()
  try {
    const products = await Category.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
