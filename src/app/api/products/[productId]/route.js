import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connectToDB } from '@/db';  // Assuming you have a separate DB connection file

// GET request to fetch a product by ID
export async function GET(req, { params }) {
    const { productId } = await params;

    try {
        await connectToDB();  // Connect to the database

        const product = await Product.findById(productId);  // Fetch product from database
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// PUT request to update a product by ID
export async function PUT(req, { params }) {
    const { productId } =await params;
    const updatedData = await req.json();

    try {
        await connectToDB(); 

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });  
        console.log(updatedProduct);
        if (!updatedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// DELETE request to delete a product by ID
export async function DELETE(req, { params }) {
    const { productId } = params;

    try {
        await connectToDB();  // Connect to the database

        const deletedProduct = await Product.findByIdAndDelete(productId);  // Delete product from database
        if (!deletedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
