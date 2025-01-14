import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
   
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const sortBy = url.searchParams.get("sortBy") || "createdAt"; 
    const order = url.searchParams.get("order") === "desc" ? -1 : 1;

  
    const orders = await Order.find()
      .populate("userId", "name")
      .populate("orders.items.productId", "name")
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

   
    const totalCount = await Order.countDocuments();

    return NextResponse.json({
      orders,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
