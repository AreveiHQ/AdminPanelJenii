"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

const EditProductForm = ({ productId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryType,setCategoryType]=useState();
  const [categoryName,setCategoryName]=useState();
  const calculateDiscountPercent = (price, discountPrice) =>
    price > 0 ? ((price - discountPrice) / price) * 100 : 0;

  const formik = useFormik({
    initialValues: {
      name: "",
      sku: "",
      slug: "",
      price: "",
      discountPrice: "",
      discountPercent: 0,
      stock: "",
      category: {},
      subCategory: "",
      collectionName: "",
      metal: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      sku: Yup.string().required("SKU is required"),
      slug: Yup.string().required("Slug is required"),
      price: Yup.number()
        .positive("Price must be a positive number")
        .required("Price is required"),
      discountPrice: Yup.number()
        .positive("Discount price must be positive")
        .required("Discount price is required"),
      stock: Yup.number()
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .required("Stock is required"),
      category: Yup.object().required("Category is required"),
      metal: Yup.string()
        .oneOf(["silver", "gold", "platinum", "rose gold"])
        .required("Metal is required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      setLoading(true);
      try {
        const response = await axios.put(`/api/products/${productId}`, values);
        alert("Product updated successfully!");
        onClose();
      } catch (error) {
        alert("Failed to update product.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        formik.setValues({
          name: data.name,
          sku: data.sku,
          slug: data.slug,
          price: data.price,
          discountPrice: data.discountPrice,
          discountPercent: calculateDiscountPercent(
            data.price,
            data.discountPrice
          ).toFixed(2),
          stock: data.stock,
          category:data.category.name,
          subCategories:data.category.type,
          collectionName: data.collectionName.join(", "),
          metal: data.metal,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories/options");
        console.log(data)
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProductDetails();
    fetchCategories();
  }, [productId]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    //formik.setFieldValue("category", selectedCategory);
    const regex = new RegExp(`\\b${selectedCategory}\\b`, "i")
    setCategoryType(selectedCategory);
    const filteredSubCategories = categories.filter(
      (category) => regex.test(category.name)
    );
    setSubCategories(filteredSubCategories);
    console.log(filteredSubCategories)
  };

  const handleCategoryNameChange=(e)=>{
      console.log(e.target.value);
     const categoryNamex=e.target.value;
     setCategoryName(categoryNamex);
     console.log(categoryNamex);
     formik.setFieldValue("category",{
      "name":categoryNamex,
      "type":categoryType
     })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 overflow-scroll">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-pink-600 text-center mb-6">
          Edit Product
        </h2>
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Name", id: "name", type: "text" },
            { label: "SKU", id: "sku", type: "text" },
            { label: "Slug", id: "slug", type: "text" },
            { label: "Price", id: "price", type: "number" },
            { label: "Discount Price", id: "discountPrice", type: "number" },
            { label: "Stock", id: "stock", type: "number" },
          ].map(({ label, id, type }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formik.values[id]}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (id === "price" || id === "discountPrice") {
                    const discountPercent = calculateDiscountPercent(
                      formik.values.price,
                      formik.values.discountPrice
                    );
                    formik.setFieldValue("discountPercent", discountPercent.toFixed(2));
                  }
                }}
                onBlur={formik.handleBlur}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
              />
              {formik.touched[id] && formik.errors[id] && (
                <p className="text-sm text-red-600">{formik.errors[id]}</p>
              )}
            </div>
          ))}

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={handleCategoryChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.parentCategory}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Dropdown */}
          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
              Sub-Category
            </label>
            
            <select
              id="subCategory"
              name="subCategory"
              value={formik.values.subCategory}
              onChange={(e)=>handleCategoryNameChange(e)}
              onBlur={formik.handleBlur}
              disabled={loading || !subCategories.length}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            >
              <option value="" disabled>
                Select a sub-category
              </option>
              {subCategories.map((subCat, index) => (
                <option key={index} value={subCat.name}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Metal Dropdown */}
          <div>
            <label htmlFor="metal" className="block text-sm font-medium text-gray-700">
              Metal
            </label>
            <select
              id="metal"
              name="metal"
              value={formik.values.metal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-pink-300"
            >
              <option value="" disabled>
                Select metal
              </option>
              {["silver", "gold", "platinum", "rose gold"].map((metal) => (
                <option key={metal} value={metal}>
                  {metal}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
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
