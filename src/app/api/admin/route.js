import { connectToDB } from '@/db';
import User from '@/models/adminUser';
import { NextResponse } from 'next/server';

export async function GET(){
    try{
        const userAdmins = await User.find();
        return NextResponse.json({
            users:userAdmins
        });
    }
    catch(err){
        return NextResponse.json({"Error":err})
    }
}