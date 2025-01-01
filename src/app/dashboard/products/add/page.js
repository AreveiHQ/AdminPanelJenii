"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ImagePlus, Save, Send } from "lucide-react";
import { productSchema } from "@/lib/validations/product";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { FaArrowDown } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { collectionsList } from "@/utils/data";
import Select from 'react-select';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';


export default function AddProduct() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset, // Added reset here
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      selectedCollections: [],
      stock: 0,
      metal: "silver",
      mode: "online",
    },
  });

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [categoriesData, setCategoriesData] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const categories = ['men', 'women'];
  const price = watch('price');
  const discountPrice = watch('discountPrice');

  const fileInput = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const updatedFiles = [...images, ...files];
      setImages(updatedFiles);
      setValue('images', updatedFiles);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/options');
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategoriesData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const filteredSubCategories = categoriesData.filter(
      (category) => category.parentCategory === selectedCategory
    );
    setSubCategories(filteredSubCategories);
  };

  const onSubmit = async (data) => {
    console.log(data)
    try {
      setLoading(true);
      console.log('Form Submitted:', data);
      const formData = new FormData();

      // Append individual fields to formData
      formData.append("sku", data.sku);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discountPrice", data.discountPrice);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("stock", data.stock);
      formData.append("metal", data.metal);
      formData.append("mode", data.mode);

      data.selectedCollections.forEach((coll) => {
        formData.append("collections", coll.value); // Access the value directly
      });

      // Handle images
      Array.from(data.images).forEach((image) =>
        formData.append("images", image)
      );

      // Make the API call
      await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset states and UI feedback
      setImages([]);
      toast.success("Product added successfully!");

      reset(); // Reset the form after submission
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to add product"
      );
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-xl font-semibold">Add Product</h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded text-sm bg-gray-100 hover:bg-gray-200"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
                    disabled={loading}
                  >
                    <Send className="w-4 h-4 mr-2 inline" />
                    {loading ? "Publishing..." : "Publish Now"}
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium">
                    SKU Code
                  </label>
                  <input
                    id="sku"
                    {...register("sku")}
                    className="mt-1 w-full p-2 border rounded text-sm"
                  />
                  {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Product Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="mt-1 w-full p-2 border rounded text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    className="mt-1 w-full p-2 border rounded text-sm"
                    rows={5}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                            <div
                                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
                                onClick={() => fileInput.current?.click()}
                            >
                                <Controller
                                    name="images"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            ref={fileInput}
                                            accept="image/jpg,image/jpeg,image/png"
                                            multiple
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                    )}
                                />
                                <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Drag and drop images here or click to upload
                                </p>
                            </div>
                
                            {errors.images && (
                                <p className="text-red-500 text-sm">{errors.images.message}</p>
                            )}
                
                            {images.length > 0 && (
                                <div className="flex gap-4 overflow-x-auto py-4">
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative min-w-[8rem] h-32"
                                            onClick={() => removeImage(index)}
                                        >
                                            <Image
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Category Dropdown */}

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      {...register("category")}
                      onChange={handleCategoryChange}
                      className={`mt-1 w-full p-2 border rounded text-sm ${errors.category ? "is-invalid" : ""}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, ind) => (
                        <option key={ind} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <p className="error text-red-500 text-sm">{errors.category?.message}</p>
                  </div>

                  {/* Sub-Category */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Sub-Category</label>
                    <select
                      {...register("subCategory")}
                      disabled={!subCategories.length}
                      className={`mt-1 w-full p-2 border rounded text-sm ${errors.subCategory ? "is-invalid" : ""}`}
                    >
                      <option value="">Select Sub-Category</option>
                      {subCategories.map((sub, ind) => (
                        <option key={ind} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    <p className="error text-red-500 text-sm">{errors.subCategory?.message}</p>
                  </div>





                  {/* Price Input */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium">Price</label>
                    <input
                      id="price"
                      type="number"
                      className="mt-1 w-full p-2 border rounded text-sm"
                      {...register('price')}
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                  </div>

                  {/* Discount Price Input */}
                  <div>
                    <label htmlFor="discountPrice" className="block text-sm font-medium">Discount Price</label>
                    <input
                      id="discountPrice"
                      type="number"
                      className="mt-1 w-full p-2 border rounded text-sm"
                      {...register('discountPrice')}
                    />
                    {errors.discountPrice && (
                      <p className="text-red-500 text-sm">{errors.discountPrice.message}</p>
                    )}
                  </div>

                  {/* Discount Calculation */}
                  {price && discountPrice && (
                    <div className="bg-green-50 text-green-800 p-3 rounded-md">
                      {((price - discountPrice) / price * 100).toFixed(2)}% Discount Applied
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Accordion>
              <AccordionSummary
                expandIcon={<FaArrowDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Default Fields</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="grid grid-cols-1 gap-6">
                  {/* Stock */}
                  <div className="col-span-1">
                    <label className="block text-lg font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      {...register("stock")}
                      className="w-full h-12 px-4 border rounded"
                      placeholder="Enter stock quantity"
                      defaultValue={0}
                    />
                    <p className="text-red-500 text-sm">{errors.stock?.message}</p>
                  </div>

                  {/* Collection */}
                  <div className="col-span-1">   
                  <label className="block text-lg font-medium">Collections</label>
                  <Controller
                    name="selectedCollections"
                    control={control}
                    defaultValue={[]} // Default value should be an empty array
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        closeMenuOnSelect={false}
                        options={collectionsList.map((collection) => ({
                          label: collection.name,
                          value: collection.slug,
                        }))}
                        // value={collectionsList
                        //   .filter((collection) =>
                        //     field.value.includes(collection.slug) // Check if slug is in selected values
                        //   )
                        //   .map((collection) => ({
                        //     label: collection.name,
                        //     value: collection.slug,
                        //   }))}
                        // onChange={(selectedOptions) => {
                        //   // Ensure the selected options are passed in the format of { label, value }
                        //   const selectedSlugs = selectedOptions.map(option => option.value);
                        //   field.onChange(selectedSlugs); // Update the form state with slugs
                        //   console.log(selectedOptions)
                        // }}
                      />
                    )}
                  />
<p className="text-red-500 text-sm">{errors.selectedCollections?.message}</p>

                  </div>



                  {/* Mode */}
                  <div className="col-span-1">
                    <label className="block text-lg font-medium mb-1">Mode</label>
                    <select
                      {...register("mode")}
                      className="w-full h-12 px-4 border rounded"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                    <p className="text-red-500 text-sm">{errors.mode?.message}</p>
                  </div>

                  {/* Metal */}
                  <div className="col-span-1">
                    <label className="block text-lg font-medium mb-1">Metal</label>
                    <select
                      {...register("metal")}
                      className="w-full h-12 px-4 border rounded"
                      defaultValue="silver"
                    >
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                    </select>
                    <p className="text-red-500 text-sm">{errors.metal?.message}</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

          </div>
        </div>
      </form>
    </div>
  );
}
