import { connectToDB } from "@/db"
import User from "@/models/adminUser"
import { NextResponse } from "next/server";

export async function GET(req) {
        await connectToDB();
        try {
                const {searchParams} = new URL(req.url)
                const queryParam = {
                        username:searchParams.get('username'),
                }
                const existingUser = await User.findOne(queryParam);
                if(existingUser){
                        return NextResponse.json({
                                message:" username not available"
                        },{status:400})
                }
                return NextResponse.json({
                        message:" available to use"
                },{status:200})
        } catch (error) {
                return NextResponse.json({
                        message:"Error checking username"
                },{status:500})
        }
}