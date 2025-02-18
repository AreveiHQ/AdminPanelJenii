import { connectToDB } from "@/db";
import Coupon from "@/models/couponModel";
import { NextResponse } from "next/server";

export async function PUT(req, { params }){
    await connectToDB();
    const { id } =await params;
    const updatedData = await req.json();
    
    try{
        const updatedCoupon=await Coupon.findByIdAndUpdate(id,updatedData, { new: true });
        if(!updatedCoupon){
            return NextResponse.json({message: 'Coupon not found' })
        }
        return NextResponse.json(updatedCoupon, { status: 200 });
    }catch(err){
        return NextResponse.json({"error":err});
    }

}

export async function DELETE(req, { params }){
    await connectToDB();
    const { id } =await params;
    try{
        const deletedCoupon=await Coupon.findByIdAndDelete(id);
        if(!deletedCoupon){
            return NextResponse.json({message: 'Coupon not found' })
        }

        return NextResponse.json({message: 'Coupon deleted successfully' }, { status: 200 });
    }
    catch(err){
        return NextResponse.json({"error":err});
    }
} 