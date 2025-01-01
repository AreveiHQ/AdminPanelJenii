import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { orderStatus } = await request.json(); 
  const { id } = await params; 

  try {
    
    const order = await Order.findOneAndUpdate(
      { "orders.orderID": id }, 
      { $set: { "orders.$.orderStatus": orderStatus } }, 
      { new: true } 
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
