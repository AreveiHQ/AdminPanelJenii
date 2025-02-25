import { connectToDB } from "@/db"
import Home from "@/models/homePageModel";
import { uploadToS3 } from "@/utils/awsS3Bucket";
import { NextResponse } from "next/server";
export async function PUT(req, { params }) {
        await connectToDB();
        const { id } = await params;
        try {
          const formData = await req.formData();
          const links = formData.get("links");
          const section = formData.get("section");
          const desktopbanner = formData.get("desktopbanner");
          const mobilebanner = formData.get("mobilebanner");
          console.log("formData")
      
          const updateData = { links, section };
      
          if (desktopbanner) {
            const desktopBuffer = Buffer.from(await desktopbanner.arrayBuffer());
            const uploadedDesktopImage = await uploadToS3(desktopBuffer, "slide/desktop/", `${Date.now()}-${desktopbanner.name}`, desktopbanner.type);
            updateData.desktopBannerImage = uploadedDesktopImage;
          }
      
          if (mobilebanner) {
            const mobileBuffer = Buffer.from(await mobilebanner.arrayBuffer());
            const uploadedMobileImage = await uploadToS3(mobileBuffer, "slide/mobile/", `${Date.now()}-${mobilebanner.name}`, mobilebanner.type);
            updateData.mobileBannerImage = uploadedMobileImage;
          }
      
          const updatedSlide = await Home.findByIdAndUpdate(id, updateData, { new: true });
      
          if (!updatedSlide) {
              console.log("g")
            return NextResponse.json({ message: "Slide not found" }, { status: 404 });
          }
      
          return NextResponse.json({ message: "Slide updated successfully", updatedSlide }, { status: 200 });
        } catch (err) {
          console.log(err)
          return NextResponse.json({ message: err.message }, { status: 500 });
        }
      }
      
      export async function DELETE(req, { params }) {
        await connectToDB();
        const { id } = await params;
        try {
          const deletedSlide = await Home.findByIdAndDelete(id);
      
          if (!deletedSlide) {
            return NextResponse.json({ message: "Slide not found" }, { status: 404 });
          }
      
          return NextResponse.json({ message: "Slide deleted successfully" }, { status: 200 });
        } catch (err) {
          return NextResponse.json({ message: err.message }, { status: 500 });
        }
      }