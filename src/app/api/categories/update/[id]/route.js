import Category from "@/models/category";
import { NextResponse } from "next/server";

const { connectToDB } = require("@/db");


export async function PUT(request, { params }) {
    await connectToDB(); 
    
    try {
        const { id: categoryId } = await params;

        // Validate categoryId
        // if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        //     return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
        // }

        const formData = await request.json();
        console.log(formData);

        

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, formData, {
            new: true,
        });

        if (!updatedCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
