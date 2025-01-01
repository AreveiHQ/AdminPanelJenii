import { connectToDB } from "@/db";
import Order from '@/models/orderModel';
import Product from '@/models/productModel';
import User from '@/models/userModel';

export async function GET(request) {
    await connectToDB();

    try {
        // Fetch Sales Data
        const salesData = await Order.aggregate([
            { $unwind: '$orders' },
            {
                $group: {
                    _id: { $month: '$orders.createdAt' },
                    totalRevenue: { $sum: '$orders.amount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fetch Best-Selling Products
        const productSales = await Order.aggregate([
            { $unwind: '$orders' },
            { $unwind: '$orders.items' },
            {
                $group: {
                    _id: '$orders.items.productId',
                    totalSales: { $sum: '$orders.items.quantity' },
                },
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 },
        ]);

        const bestSellingProducts = await Product.find({
            _id: { $in: productSales.map((item) => item._id) },
        });

        const productSalesData = productSales.map((item) => ({
            name: bestSellingProducts.find((p) => p._id.equals(item._id))?.name,
            sales: item.totalSales,
        }));

        // Fetch Customer Demographics
        const customerDemographics = await Order.aggregate([
            { $unwind: '$orders' },
            {
                $group: {
                    _id: '$orders.customer.address',
                    count: { $sum: 1 },
                },
            },
            { $limit: 5 },
        ]);

        // Fetch User Registration Stats (Users per Month)
        const userRegistrationStats = await User.aggregate([
            {
                $project: {
                    month: { $month: '$createdAt' }, // Extract month from user registration date
                },
            },
            {
                $group: {
                    _id: '$month',
                    userCount: { $sum: 1 }, // Count the number of users for each month
                },
            },
            { $sort: { _id: 1 } }, // Sort by month
        ]);

        return new Response(
            JSON.stringify({ salesData, productSalesData, customerDemographics, userRegistrationStats }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error fetching data' }), {
            status: 500,
        });
    }
}
