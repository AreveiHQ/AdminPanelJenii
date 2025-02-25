"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .max(50, "Name can't exceed 50 characters"),
  parentCategory: Yup.string()
    .oneOf(["men", "women","men women"], "Invalid parent category")
    .required("Parent category is required"),
  bannerImages: Yup.mixed().required("At least one banner image is required"),
  image: Yup.mixed().required("Image is required"),
  discountOffer: Yup.number().min(0, "Discount can't be negative"),
});

export default function UploadCategory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [ImageFile, setImageFile] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(CategorySchema),
  });

  const router =useRouter();

  const onSubmit = async (data) => {
    console.log(data)
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("parentCategory", data.parentCategory);
    formData.append("image", data.image[0]);
    formData.append("discountOffer", data.discountOffer);

    // Append all selected banner images to the form data
    Array.from(data.images).forEach((file) => {
      formData.append("bannerImages", file);
    });

    try {
      const response = await axios.post("/api/categories", formData);
      if (response.status === 200) {
        alert("Category added successfully!");
      } else {
        alert(response.data.message || "Error occurred");
      }
    } catch (error) {
      console.error("Error uploading category:", error);
      alert("Server error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
   
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const previewsURL = files.map((file) => URL.createObjectURL(file));
      const updatedFiles = [...ImageFile,...files];
      setImageFile(updatedFiles);
      setBannerPreviews((prevPreviews) => [...prevPreviews, ...previewsURL]);
      setValue("'images'",updatedFiles)
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Section */}
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Add Categories</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Category Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Category Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Discount Offer */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Discount Offer</label>
              <input
                type="number"
                {...register("discountOffer")}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Only percentage value"
              />
              {errors.discountOffer && (
                <p className="text-red-500 text-sm">
                  {errors.discountOffer.message}
                </p>
              )}
              </div>

            {/* Parent Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Parent Category</label>
              <select
                {...register("parentCategory")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select a category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="men women">Both Men and Women</option>
              </select>
              {errors.parentCategory && (
                <p className="text-red-500 text-sm">
                  {errors.parentCategory.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-pink-600 text-white font-bold rounded-md"
              >
                {isSubmitting ? "Publishing..." : "Publish Now"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Media</h2>

          <h3 className="text-lg font-medium mb-2">Category Image</h3>
          <div className="mb-4 border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
            {!imagePreview && (
              <img src="/icon.png" className="w-14 mx-auto mb-4" />
            )}
            <input
              type="file"
              {...register("image")}
              accept="image/*"
              className="hidden"
              id="imageInput"
              onChange={(e) => {
                handleImageChange(e);
                register("image").onChange(e);
              }}
            />
            {!imagePreview && (
              <h3 className="text-gray-400 p-2">Drag and drop icon here</h3>
            )}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
            <button
              type="button"
              className="px-4 py-2 bg-pink-500 text-white rounded-md"
              onClick={() => document.getElementById("imageInput").click()}
            >
              Add Image
            </button>
            {errors.image && (
              <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
            )}
          </div>

          <h3 className="text-lg font-medium mb-2">Banner Images</h3>
          <div className="mb-4 border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
            {!bannerPreviews && (
              <img src="/banner.png" className="w-14 mx-auto mb-4" />
            )}
            <h3 className="text-gray-400 p-2">
              {!bannerPreviews.length && "Drag and drop banner here"}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {bannerPreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Banner Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
            <input
              type="file"
              {...register("bannerImages")}
              accept="image/*"
              multiple
              className="hidden"
              id="bannerInput"
              onChange={handleBannerChange}
            />
            <button
              type="button"
              className="px-4 py-2 bg-pink-500 text-white rounded-md"
              onClick={() => document.getElementById("bannerInput").click()}
            >
              Add Banner
            </button>
            {errors.bannerImages && (
              <p className="text-red-500 text-sm mt-2">
                {errors.bannerImages.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
