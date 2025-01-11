"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FileVideoIcon, ImagePlus, Save, Send } from "lucide-react";
import { productSchema } from "@/lib/validations/product";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { FaArrowDown } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { collectionsList } from "@/utils/data";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const Select = dynamic(() => import('react-select'), { ssr: false });
export default function AddProduct() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset, // Added reset here
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      selectedCollections: [],
      stock: 0,
      metal: "silver",
      mode: "online",
      description: `<table border="1" style=" color:#434343;border-collapse: collapse; width: 100%; text-align: left;">
  <tbody>
    <tr>
      <td>Measurements</td>
      <td>Earrings - 25 mm x 30 mm</td>
    </tr>
    <tr>
      <td>Precious Metal</td>
      <td>Silver with Platinum Plating</td>
    </tr>
    <tr>
      <td>Alloy</td>
      <td>925 Sterling Silver</td>
    </tr>
    <tr>
      <td>Metal Weight</td>
      <td>1,85 g</td>
    </tr>
    <tr>
      <td>Colour</td>
      <td>blue</td>
    </tr>
  </tbody>
</table>`
    },
  });

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [categoriesData, setCategoriesData] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const categories = ['men', 'women'];
  const price = watch('price');
  const discountPrice = watch('discountPrice');
  const [videoPreview, setVideoPreview] = useState(null);
  const [preview, setPreview] = useState([]);
  const fileInput = useRef(null);
  const vedioInput = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previewsURL = files.map((file) => URL.createObjectURL(file));
      const updatedFiles = [...images, ...files];
      setPreview((prevPreviews) => [...prevPreviews, ...previewsURL]);
      setImages(updatedFiles);
      setValue('images', updatedFiles);
      trigger("images")
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setValue("video",file)
    }
    trigger("video")
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, idx) => idx !== index);
    const filteredpreview = preview.filter((_,ind) => ind !== index);
    setImages(updatedImages);
    setValue('images', updatedImages);
    setPreview(filteredpreview);
    trigger("images")
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
    const regex = new RegExp(`\\b${selectedCategory}\\b`, "i")
    const filteredSubCategories = categoriesData.filter(
      (category) => regex.test(category.parentCategory)
    );
    setSubCategories(filteredSubCategories);
  };

  const onSubmit = async (data) => {
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
      formData.append("video", data.video);

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
      setVideoPreview(null)
      setPreview([])
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
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <JoditEditor value={field.value} onChange={field.onChange}  config={{
                        
                        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
                                          style:{
                                                  backgroundColor:'#F6F6F6',
                                                  color:'#f0f0f0'
                                          },
                                          toolbar:{
                                                  style:{
                                                          backgroundColor:'#F6F6F6',
                                                  }
                                          },
                        placeholder: 'Write Description....'
                      }}/>
                    )}
                  />
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
                                            onChange={(e)=>{ field.onChange(e)
                                              handleImageChange(e)}}
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
                
                            {preview.length > 0 && (
                                <div className="flex gap-4 overflow-x-auto py-4">
                                    {preview.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative min-w-[8rem] h-32"
                                            onClick={() => removeImage(index)}
                                        >
                                            <Image
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                <div className="space-y-4">
                            <div
                                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
                                onClick={() => vedioInput.current?.click()}
                            >
                               <Controller
                                    name="video"
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                      type="file"
                                      id="video"
                                      ref={vedioInput}
                                      accept="video/*"
                                      hidden
                                      onChange={handleVideoChange}
                                    />
                                    )}
                                />
                              
                                <FileVideoIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    click to upload Vedio
                                </p>
                            </div>
                            {errors.video && (
                                <p className="text-red-500 text-sm">{errors.video.message}</p>
                            )}
                            {videoPreview && (
        <div>
          <h3>Video Preview:</h3>
          <video
            controls
            src={videoPreview}
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
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
                    {errors.category && (
                                <p className="text-red-500 text-sm">{errors.category.message}</p>
                            )}
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
                    {errors.subCategory && (
                                <p className="text-red-500 text-sm">{errors.subCategory.message}</p>
                            )}
                  </div>





                  {/* Price Input */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium">Price</label>
                    <input
                      id="price"
                      type="number"
                      className="mt-1 w-full p-2 border rounded text-sm"
                      step="0.01" // Allows decimal input
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
                      step="0.01" // Allows decimal input
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
                      {errors.stock && (
                                <p className="text-red-500 text-sm">{errors.stock.message}</p>
                            )}
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
  {errors.selectedCollections && (
                                <p className="text-red-500 text-sm">{errors.selectedCollections.message}</p>
                            )}

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
                    {errors.mode && (
                                <p className="text-red-500 text-sm">{errors.mode.message}</p>
                            )}
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
                    {errors.metal && (
                                <p className="text-red-500 text-sm">{errors.metal.message}</p>
                            )}
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
