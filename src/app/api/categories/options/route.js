import { NextResponse } from 'next/server';

import Category from '@/models/category';
import { connectToDB } from '@/db';
// Get all products
export async function GET() {
  await connectToDB();
  try {
    const products = await Category.find({},{name:1,parentCategory:1,_id:0});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}