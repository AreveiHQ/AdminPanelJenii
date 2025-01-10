import { NextResponse } from 'next/server';
import Product, { OfflineProduct } from '@/models/productModel';
import Category from '@/models/category';
import { connectToDB } from '@/db';
import { uploadToS3 } from '@/utils/awsS3Bucket';
import fs from 'fs';
function calculatedDiscount(price, discountedPrice) {
  const discount = ((price - discountedPrice) / price) * 100;
  return Math.ceil(discount);
}

// Get all products
export async function GET() {
  await connectToDB();
  try {
    const products = await Product.find();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Add a new product
export async function POST(request) {
  await connectToDB();
  try {
    const formData = await request.formData();
    
    const imageFiles = formData.getAll('images'); // Assumes the key for images is 'images'
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const discountPrice = formData.get('discountPrice');
    const category = formData.get('category');
    const subCategory = formData.get('subCategory');
    const collection = formData.getAll('collections');
    const metal = formData.get('metal');
    const stock = formData.get('stock');
    const mode = formData.get('mode');
    const sku = formData.get('sku');
    const vedio = formData.get('video');
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    console.log(vedio,imageFiles)

    if (!imageFiles.length || !name || !price || !category || !subCategory) {
      return NextResponse.json({ message: 'Please fill required fields' }, { status: 400 });
    }

    const isExist = await Category.findOne({ name: subCategory, parentCategory: category });
    if (!isExist) {
      return NextResponse.json({ message: 'Invalid Category' }, { status: 403 });
    }
    if (price <= 0 || discountPrice < 0) {
      return NextResponse.json({ message: 'Invalid price or discounted price values' }, { status: 403 });
    }

    const uploadPromises = imageFiles.map(async (file) => {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const mimeType = file.type;

      return uploadToS3(fileBuffer,"products/image/", fileName, mimeType);
    });

    const images = await Promise.all(uploadPromises);
    let vedioUrl;
    if(vedio && vedio.type){ 
    const vedioBuffer = Buffer.from(await vedio.arrayBuffer())
    vedioUrl = await uploadToS3(vedioBuffer,"products/vedio/",`${Date.now()}-${vedio.name}`, vedio.type);
    } 

    // Now create and save the product in the database
    const discountPercent = calculatedDiscount(price, discountPrice);

    if (mode && mode === "offline") {
      const product = new OfflineProduct({
        sku,
        images,
        name,
        description,
        price,
        discountPrice,
        discountPercent,
        category: { name: subCategory, id: isExist._id },
        collectionName:collection,
        metal,
        video:vedioUrl,
        stock,
        slug
      });

      const newProduct = await product.save();
      return NextResponse.json(newProduct, { status: 201 });
    } else {
      const product = new Product({
        sku,
        images,
        name,
        description,
        price,
        discountPrice,
        discountPercent,
        category: { name: subCategory, id: isExist._id },
        collectionName:collection,
        metal,
        stock,
        slug,
        video:vedioUrl,
      });

      const newProduct = await product.save();
      return NextResponse.json(newProduct, { status: 201 });
    }
  } catch (error) {
    console.error('Error uploading product:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}


