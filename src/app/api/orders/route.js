import Order from "@/models/orderModel";
import User from "@/models/userModel";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
   
    const orders = await Order.find()
      .populate("userId", "name") 
      .populate("orders.items.productId", "name"); 

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}


