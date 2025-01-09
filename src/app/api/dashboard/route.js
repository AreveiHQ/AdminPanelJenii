import { connectToDB } from "@/db";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();

  try {
    
    const totalOrders = await Order.aggregate([
      { $unwind: "$orders" },
      { $count: "totalOrders" },
    ]);
    
    const totalRevenue = await Order.aggregate([
        { $unwind: "$orders" },
        { $group: {_id:null, total: { $sum: "$orders.amount" } } },
      ]);

    const paymentModes = await Order.aggregate([
      { $unwind: "$orders" },
      {
        $group: {
          _id: "$orders.payment.mode", 
          count: { $sum: 1 },
        },
      },
    ]);
    
    const recentOrders = await Order.find({})
    .sort({ _id: -1 })
    .limit(5)
    .populate("orders.items.productId", "name price")
    .lean();

    const ordersByMonth = await Order.aggregate([
      { $unwind: "$orders" }, // Unwind the orders array
      {
        $project: {
          year: { $year: "$orders.createdAt" },
          month: { $month: "$orders.createdAt" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
    ]);

    console.log(ordersByMonth);

    return NextResponse.json({
      totalOrders:totalOrders[0].totalOrders,
      totalRevenue:totalRevenue[0].total,
      recentOrders,
      paymentModes,
      ordersByMonth
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
    );
  }
}
