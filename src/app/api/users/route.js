import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from '@/db';
import User from "@/models/userModel";

export async function GET(request){
    connectToDB();
    try{
        const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
    }
    catch(err){
        console.log(err);
        return NextResponse.json({message:"Somewent gone wrong..!"});
    }
}