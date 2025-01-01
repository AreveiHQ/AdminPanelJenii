import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

const EditProductForm = ({ productId, onClose }) => {
  const [loading, setLoading] = useState(false);

  // Formik initial values and validation schema
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      stock: "",
      category: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      price: Yup.number()
        .positive("Price must be a positive number")
        .required("Price is required"),
      stock: Yup.number()
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .required("Stock is required"),
      category: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.put(`/api/products/${productId}`, values);
        alert("Product updated successfully.");
        onClose(); // Close the form
      } catch (error) {
        console.error("Error updating product:", error);
        alert("An error occurred while updating the product.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch product details and populate form
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        const product = response.data;
        formik.setValues({
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category?.name || "",
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#CCCCFF",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        width: "90%",
        maxWidth: "500px",
        zIndex: 1000,
      }}
    >
      <h2 style={{ textAlign: "center", color: "#6a1b9a" }}>Edit Product</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Name Input */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "5px", color: "#6a1b9a" }}
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {formik.touched.name && formik.errors.name && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {formik.errors.name}
            </p>
          )}
        </div>

        {/* Price Input */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="price"
            style={{ display: "block", marginBottom: "5px", color: "#6a1b9a" }}
          >
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {formik.touched.price && formik.errors.price && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {formik.errors.price}
            </p>
          )}
        </div>

        {/* Stock Input */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="stock"
            style={{ display: "block", marginBottom: "5px", color: "#6a1b9a" }}
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {formik.touched.stock && formik.errors.stock && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {formik.errors.stock}
            </p>
          )}
        </div>

        {/* Category Input */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="category"
            style={{ display: "block", marginBottom: "5px", color: "#6a1b9a" }}
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {formik.touched.category && formik.errors.category && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {formik.errors.category}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: "#e0e0e0",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#6a1b9a",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
