"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { MenuItem, TextField } from "@mui/material";

const validationSchema = Yup.object().shape({
  links: Yup.string().required("Links are required"),
  section: Yup.string().required("Section is required"),
  desktopbanner: Yup.mixed(),
  mobilebanner: Yup.mixed(),
});

export default function SlideManager() {
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await axios.get("/api/slides");
      setSlides(response.data);
    } catch (error) {
      console.error("Failed to fetch slides:", error);
    }
  };

  const handleEdit = (slide) => {
    setSelectedSlide(slide);
    setValue("links", slide.links);
    setValue("section", slide.section);
    setDesktopPreview(slide.desktopBannerImage);
    setMobilePreview(slide.mobileBannerImage);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/slides/${id}`);
      fetchSlides();
    } catch (error) {
      console.error("Failed to delete slide:", error);
    }
  };

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
    setLoading(true);
    const formData = new FormData();
    formData.append("links", data.links);
    formData.append("section", data.section);
    if (data.desktopbanner) formData.append("desktopbanner", data.desktopbanner[0]);
    if (data.mobilebanner) formData.append("mobilebanner", data.mobilebanner[0]);

    try {
      if (selectedSlide) {
        await axios.put(`/api/slides/${selectedSlide._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/slides", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchSlides();
      reset();
      setDesktopPreview(null);
      setMobilePreview(null);
      setSelectedSlide(null);
    } catch (error) {
      console.error("Failed to save slide:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 rounded-md shadow-md">
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">{selectedSlide ? "Edit Slide" : "Add Slide"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="links" className="block text-sm font-medium">Links</label>
            <input
              id="links"
              type="text"
              {...register("links")}
              className={`mt-2 p-2 w-full border rounded-md ${errors.links ? "border-red-500" : ""}`}
              placeholder="Enter URL"
            />
            {errors.links && <p className="text-red-500 text-sm mt-1">{errors.links.message}</p>}
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#C41E56] text-white px-4 py-2 rounded hover:bg-[#da648b] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Publishing..." : "Publish Slide"}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Slides</h2>
        <ul className="space-y-4">
          {slides.map((slide) => (
            <li key={slide._id} className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{slide.section}</p>
                <p className="text-sm text-gray-500">{slide.links}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}