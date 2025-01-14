"use client";
import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newStock, setNewStock] = useState("");

    // State variables for calculated prices
    const [totalPrice, setTotalPrice] = useState(0);
    const [lowStockPrice, setLowStockPrice] = useState(0);
    const [outOfStockPrice, setOutOfStockPrice] = useState(0);
    const [golbalInStockPrice,setGlobalInStockPrice]=useState(0);

    const calculatePrices = (products) => {
        let total = 0,
            lowStock = 0,
            outOfStock = 0;
        
        let globalPrice=0

        products.forEach((product) => {
            if(product.stock!=0){
                globalPrice+=product.price*product.stock;
            }
            if (product.stock > 0 && product.stock <= 5) {
                lowStock += product.price * product.stock;
            } else if (product.stock === 0) {
                outOfStock += product.price;
            }
        });

        total = lowStock + outOfStock;
        setTotalPrice(total);
        setLowStockPrice(lowStock);
        setOutOfStockPrice(outOfStock);
        setGlobalInStockPrice(globalPrice);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/products/inventory");
                const fetchedProducts = response.data.products || [];
                setProducts(fetchedProducts);
                setError(null);
                calculatePrices(fetchedProducts);
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setNewStock(product.stock);
        setModalOpen(true);
    };

    const handleUpdateStock = async () => {
        try {
            const updatedProduct = { ...selectedProduct, stock: Number(newStock) };
            await axios.put(`/api/products/inventory/${selectedProduct._id}`, updatedProduct);
            setModalOpen(false);
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === selectedProduct._id
                        ? { ...product, stock: Number(newStock) }
                        : product
                )
            );
            calculatePrices(products);
        } catch (err) {
            alert("Failed to update stock. Please try again.");
        }
    };

    const columnDefs = useMemo(
        () => [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                width: 50,
            },
            { headerName: "Product", field: "name", sortable: true, filter: true },
            { headerName: "Stock", field: "stock", sortable: true, filter: true },
            { headerName: "Category", field: "category.name", sortable: true, filter: true },
            { headerName: "Price", field: "price", sortable: true, filter: true },
            {
                headerName: "Status",
                field: "stock",
                filter: true,
                cellRenderer: (params) => {
                    const inStock = params.value;
                    return (
                        <span
                            className={`px-2 py-1 rounded text-sm ${
                                inStock > 0
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                            }`}
                        >
                            {inStock > 0 ? "Low Stock" : "Out of Stock"}
                        </span>
                    );
                },
            },
            {
                headerName: "Action",
                field: "",
                cellRenderer: (params) => (
                    <button
                        onClick={() => handleEditClick(params.data)}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-pink-100"
                    >
                        <Pencil className="w-4 h-4" />Edit
                    </button>
                ),
            },
        ],
        []
    );

    return (
        <div>
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
                Inventory <span className="text-pink-500">({products.length} items)</span>
            </h3>
            <Link href="/dashboard/products/add">
                <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400">
                    <FiPlusCircle className="w-5 h-5" /> Add Product
                </button>
            </Link>
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6 p-3">
            {[
                //  { label: "Global Price (In Stock)", value: golbalInStockPrice, color: "bg-green-100 text-green-600" },
                { label: "Total Price", value: totalPrice, color: "bg-blue-100 text-blue-600" },
                { label: "Low Stock Price", value: lowStockPrice, color: "bg-yellow-100 text-yellow-600" },
                { label: "Out of Stock Price", value: outOfStockPrice, color: "bg-red-100 text-red-600" },
            ].map((card, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-lg shadow-md text-center ${card.color}`}
                >
                    <h4 className="text-lg font-semibold">{card.label}</h4>
                    <p className="text-xl font-bold">Rs.{card.value}</p>
                </div>
            ))}
        </div>

        {/* Inventory Table */}
        <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <FaSpinner className="animate-spin text-pink-500 text-3xl" />
                </div>
            ) : error ? (
                <p className="text-red-600 font-semibold">{error}</p>
            ) : (
                <AgGridReact
                rowData={products}
                    columnDefs={columnDefs}
                    defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true,
                    }}
                    pagination={true}
                    paginationPageSize={11}
                    rowSelection="multiple"
                />
            )}
        </div>

        {/* Modal */}
        {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 shadow-md w-96">
                    <h3 className="text-lg font-semibold mb-4">Edit Stock</h3>
                    <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full px-4 py-2 border rounded mb-4 focus:ring-2 focus:ring-pink-400"
                    />
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateStock}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};

export default Inventory;
