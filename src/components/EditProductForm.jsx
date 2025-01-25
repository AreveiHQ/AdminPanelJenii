"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const EditProductForm = ({ productId, onClose }) => {
  const [loading, setLoading] = useState(false);
  // const [categories, setCategories] = useState([]);
  // const [subCategories, setSubCategories] = useState([]);
  const [categoryType, setCategoryType] = useState();
  const [categoryName, setCategoryName] = useState();

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    sku: Yup.string().required("SKU is required"),
    slug: Yup.string().required("Slug is required"),
    price: Yup.number().positive("Price must be a positive number").required("Price is required"),
    discountPrice: Yup.number().positive("Discount price must be positive").required("Discount price is required"),
    stock: Yup.number().integer("Stock must be an integer").min(0, "Stock cannot be negative").required("Stock is required"),
    // category: Yup.string().required("Category is required"),
    // subCategory: Yup.string().required("Subcategory is required"),
    metal: Yup.string().oneOf(["silver", "gold", "platinum", "rose gold"]).required("Metal is required"),
    description: Yup.string().required("Description is required"),
  });

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setValue("name", data.name);
        setValue("sku", data.sku);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("discountPrice", data.discountPrice);
        setValue("stock", data.stock);
        // setValue("category", data.category.type);
        // setValue("subCategory", data.category.name);
        setValue("collectionName", data.collectionName.join(", "));
        setValue("metal", data.metal);
        setValue("description", data.description);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    // const fetchCategories = async () => {
    //   try {
    //     const { data } = await axios.get("/api/categories/options");
    //     setCategories(data);
    //   } catch (error) {
    //     console.error("Error fetching categories:", error);
    //   }
    // };

    fetchProductDetails();
    // fetchCategories();
  }, [productId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(`/api/products/${productId}`, data);
      alert("Product updated successfully!");
      onClose();
    } catch (error) {
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  // const handleCategoryChange = (e) => {
  //   const selectedCategory = e.target.value;
  //   const regex = new RegExp(`\\b${selectedCategory}\\b`, "i");
  //   setCategoryType(selectedCategory);
  //   const filteredSubCategories = categories.filter((category) =>
  //     regex.test(category.parentCategory)
  //   );
  //   setSubCategories(filteredSubCategories);
  // };

  // const handleCategoryNameChange = (e) => {
  //   const categoryNamex = e.target.value;
  //   setCategoryName(categoryNamex);
  //   setValue("category", categoryNamex);
  // };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 overflow-scroll">
      <div className="bg-white pt-80 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-pink-600 text-center mb-6">
          Edit Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              id="sku"
              {...register("sku")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            />
            {errors.sku && <p className="text-sm text-red-600">{errors.sku.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              id="slug"
              {...register("slug")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            />
            {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              {...register("price")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            />
            {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">Discount Price</label>
            <input
              type="number"
              id="discountPrice"
              {...register("discountPrice")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            />
            {errors.discountPrice && <p className="text-sm text-red-600">{errors.discountPrice.message}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              {...register("stock")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            />
            {errors.stock && <p className="text-sm text-red-600">{errors.stock.message}</p>}
          </div>
{/* 
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              {...register("category")}
              onChange={handleCategoryChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            >
              <option value="" disabled>Select a category</option>
              {['men', 'women'].map((cat) => (
                <option key={cat} className=" capitalize" value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">Sub-Category</label>
            <select
              id="subCategory"
              {...register("subCategory")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            >
              <option value="" disabled>Select a sub-category</option>
              {subCategories.map((subCat, index) => (
                <option key={index} value={subCat.name}>{subCat.name}</option>
              ))}
            </select>
          </div> */}

          <div>
            <label htmlFor="metal" className="block text-sm font-medium text-gray-700">Metal</label>
            <select
              id="metal"
              {...register("metal")}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            >
              <option value="" disabled>Select metal</option>
              {["silver", "gold", "platinum", "rose gold"].map((metal) => (
                <option key={metal} value={metal}>{metal}</option>
              ))}
            </select>
            {errors.metal && <p className="text-sm text-red-600">{errors.metal.message}</p>}
          </div>

          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <JoditEditor
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
                  onBlur={field.onBlur} 
                  className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
                />
              )}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 focus:ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 focus:ring"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;