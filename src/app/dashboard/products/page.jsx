"use client";

import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditProductForm from "@/components/EditProductForm"; // Import the EditProductForm component
import Image from "next/image";

const ProductTable = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null); // For tracking the product being edited

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      console.log(data)
      setRowData(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close the edit form and refresh data
  const handleEditClose = () => {
    setEditingProductId(null);
    fetchProducts(); // Refresh product list after editing
  };

  // Function to delete a product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setRowData((prevData) =>
            prevData.filter((product) => product.id !== id)
          );
          alert("Product deleted successfully.");
        } else {
          throw new Error("Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  // Define column structure for AgGridReact
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    {
      headerName: "Product",
      field: "name",
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image width={40} height={40}
            src={params.data.images[0]} // Assuming `images` is an array
            alt={params.data.name}
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          {params.data.name}
        </div>
      ),
    },
    {
      headerName: "Category",
      field: "category.name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "stock",
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <span
          style={{
            color: params.value > 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value > 0 ? "In Stock" : "Out of Stock"}
        </span>
      ),
    },
    { headerName: "Stock", field: "stock", sortable: true, filter: true },
    { headerName: "Price ($)", field: "price", sortable: true, filter: true },
    {
      headerName: "Action",
      field: "id",
      cellRenderer: (params) => (
        <div>
          <button
            style={{
              marginRight: "10px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "blue",
            }}
            onClick={() => {
              // console.log("Editing Product ID:", params.data._id);
              setEditingProductId(params.data._id)}}
          >
            ✏️ Edit
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => handleDelete(params.data._id)}
          >
            🗑️ Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>
      <div
        className="ag-theme-alpine"
        style={{ height: "600px", width: "100%" }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={12}
            defaultColDef={{
              sortable: true,
              filter: true,
              flex: 1,
            }}
            rowSelection="multiple"
          />
        )}
      </div>

      {/* Render the EditProductForm */}
      {editingProductId && (
        <EditProductForm
          productId={editingProductId}
          onClose={handleEditClose} // Callback to handle form close
        />
      )}
    </div>
  );
};

export default ProductTable;
