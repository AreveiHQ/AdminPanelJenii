import { connectToDB } from "@/db"
import User from "@/models/adminUser"
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
export async function POST(req) {
        await connectToDB();
        try {
               const  {username,email,password} = await req.json();
               if(!username && !email && !password){
                return NextResponse.json({
                        message:"Requred fields"
                },{status:403})
               }
                const existingUser = await User.findOne({$or:[
                       { username},{email}
                ]});
                if(existingUser){
                        return NextResponse.json({
                                message:"User Already Exist"
                        },{status:400})
                }

//                 const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
        // Create the new user in the database
        let user = await User({
            username,
            email,
            password
        });
        user =  await user.save();
        console.log(user)
        if (!user) {
                return NextResponse.json({
                        message:"Error while creating a user"
                },{status:400})
        }
                return NextResponse.json({
                        message:" User Created"
                },{status:200})
        } catch (error) {
                return NextResponse.json({
                        message:"Error in creating User",error
                },{status:500})
        }
}