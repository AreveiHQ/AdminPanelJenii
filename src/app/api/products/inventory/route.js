import { NextResponse } from 'next/server';
import Product, { OfflineProduct } from '@/models/productModel';
import { connectToDB } from '@/db';


export async function GET(){
    await connectToDB();
    try{
        const products = await Product.find({stock: { $lte: 5 }});
        return NextResponse.json({
            products
        });
    }
    catch(err){
        return NextResponse.json({"Error":err});
    }
}