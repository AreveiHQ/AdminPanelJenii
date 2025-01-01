"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { MenuItem, TextField } from "@mui/material";

const validationSchema = Yup.object().shape({
  links: Yup.string()
  .test(
    "is-url-or-path",
    "The field must be a valid URL or path",
    (value) => {
      if (!value) return false;

      // Check if it's a valid URL
      try {
        new URL(value);
        return true;
      } catch (e) {
        // Not a valid URL, so check if it's a valid path format
        const pathRegex = /^(\/[\w\-]+)+$/;
        return pathRegex.test(value);
      }
    }
  )
  .required("This field is required"),
  section: Yup.string().required("Section is required"),
  desktopbanner: Yup.mixed().required("Desktop banner image is required"),
  mobilebanner: Yup.mixed().required("Mobile banner image is required"),
});

export default function SlideUploader() {
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    setValue(type, e.target.files);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "desktopbanner") setDesktopPreview(reader.result);
        if (type === "mobilebanner") setMobilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    console.log(data)
    setLoading(true);
    const formData = new FormData();
    formData.append("links", data.links);
    formData.append("section", data.section);
    formData.append("desktopbanner", data.desktopbanner[0]);
    formData.append("mobilebanner", data.mobilebanner[0]);

    try {
      const response = await axios.post("/api/slides", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`Slide uploaded successfully: ${response.data}`);
      reset();
      setDesktopPreview(null);
      setMobilePreview(null);
    } catch (error) {
      alert(`Failed to upload slide: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-md shadow-md">
      {/* Add Slide Section */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Add Slide</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="links" className="block text-sm font-medium">
              Links
            </label>
            <input
              id="links"
              type="text"
              {...register("links")}
              className={`mt-2 p-2 w-full border rounded-md ${
                errors.links ? "border-red-500" : ""
              }`}
              placeholder="Enter URL"
            />
            {errors.links && (
              <p className="text-red-500 text-sm mt-1">{errors.links.message}</p>
            )}
          </div>

          {/* Updated Section Field */}
          <div>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Select Section"
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.section}
                  helperText={errors.section?.message}
                >
                  <MenuItem value="hero-slider">Hero Slider</MenuItem>
                  <MenuItem value="about-slider">About Slider</MenuItem>
                </TextField>
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#C41E56] text-white px-4 py-2 rounded hover:bg-[#da648b] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Publishing..." : "Publish Slide"}
          </button>
        </form>
      </div>

     
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Media</h2>

   
        <div className="w-full text-center mb-4">
          <label
            htmlFor="desktopbanner"
            className="block text-sm font-medium bg-[#C41E56] text-white px-4 py-2 rounded hover:bg-[#da648b] mb-2 cursor-pointer"
          >
            Drag & Drop Desktop Banner
          </label>
          <input
            id="desktopbanner"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "desktopbanner")}
            className="hidden"
          />
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 border rounded-md">
            {desktopPreview ? (
              <img
                src={desktopPreview}
                alt="Desktop Preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <p className="text-gray-500">No file selected</p>
            )}
          </div>
        </div>

      
        <div className="w-full text-center">
          <label
            htmlFor="mobilebanner"
            className="block text-sm font-medium bg-[#C41E56] text-white px-4 py-2 rounded hover:bg-[#da648b] mb-2 cursor-pointer"
          >
            Drag & Drop Mobile Banner
          </label>
          <input
            id="mobilebanner"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "mobilebanner")}
            className="hidden"
          />
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 border rounded-md">
            {mobilePreview ? (
              <img
                src={mobilePreview}
                alt="Mobile Preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <p className="text-gray-500">No file selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
