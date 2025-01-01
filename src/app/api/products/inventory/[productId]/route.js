import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connectToDB } from '@/db';

export async function PUT(req, { params }) {
    try {
      
        await connectToDB();

        
        const { productId } = params;


        const body = await req.json();
        const { stock } = body;

       
        if (typeof stock !== 'number' || stock <= 0) {
            return NextResponse.json(
                { message: 'Invalid Stock' },
                { status: 400 }
            );
        }

      
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { stock }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message:"Updated" });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: 'Server error', error: err.message },
            { status: 500 }
        );
    }
}
