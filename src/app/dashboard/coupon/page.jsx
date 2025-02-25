"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useEffect } from "react";


const CouponSchema = Yup.object().shape({
  code: Yup.string().required("Coupon code is required"),
  discountType: Yup.string().required("Select a discount type"),
  discountValue: Yup.number().positive().required("Enter a discount value"),
  minimumOrderValue: Yup.number().positive().optional(),
  usageLimit: Yup.number().positive().optional(),
  validUntil: Yup.string().required("Select a validity period"),
});

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [activeCoupons, setActiveCoupons] = useState(0);
  const [expiredCoupons, setExpiredCoupons] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showEdit, setShowEdit] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  
  const filteredCoupons = coupons.filter((coupon) => {
    if (filter === "All") return true;
    return coupon.status === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CouponSchema),
  });

  // Fetch coupons and categorize them on component mount

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch("/api/coupons");

        if (!res.ok) {
          throw new Error("Failed to fetch coupons.");
        }

        const coupons = await res.json();

        const now = new Date();
        const categorizedCoupons = coupons.map((coupon) => ({
          ...coupon,
          status: new Date(coupon.validUntil) < now ? "Expired" : "Active",
        }));

        setCoupons(categorizedCoupons);
        setTotalCoupons(categorizedCoupons.length);
        setActiveCoupons(
          categorizedCoupons.filter((coupon) => coupon.status === "Active")
            .length
        );
        setExpiredCoupons(
          categorizedCoupons.filter((coupon) => coupon.status === "Expired")
            .length
        );
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    }

    fetchCoupons();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create coupon.");
      }

      const newCoupon = await response.json();

      // After adding, update the coupon list
      setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
      setShowForm(false); // Hide form after submitting
      reset(); // Reset form inputs
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };

  const handleEditClick = (coupon) => {
    setEditCoupon(coupon);
    setShowEdit(true);
    console.log(coupon);
    setValue("code", coupon.code);
    setValue("discountType", coupon.discountType);
    setValue("discountValue", coupon.discountValue);
    setValue("minimumOrderValue", coupon.minimumOrderValue);
    setValue("usageLimit", coupon.usageLimit);
    setValue("validUntil", coupon.validUntil);
  };

  const onUpdate = async (data) => {
    try {
      const response = await fetch(`/api/coupons/${editCoupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update coupon.");

      const updatedCoupon = await response.json();
      console.log(updatedCoupon);

      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) =>
          coupon._id === updatedCoupon._id ? updatedCoupon : coupon
        )
      );

      setShowEdit(false);
      setEditCoupon(null);
      reset();
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const handleDelete = async (coupon) => {
      if(!confirm("Are you sure you want to delete this coupon?")){
          return;
      }
    try {
      const response = await fetch(`/api/coupons/${coupon._id}`, {
        method:"DELETE"});

      if (!response.ok) throw new Error("Failed to delete coupon.");

      alert("Coupon deleted Sucessfully");

      }
    catch(err){
        console.error("Error deleting coupon:", err);
    }
  }


  return (
    <div className="container mx-auto p-4">
      {/* Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { title: "Total Coupon", value: totalCoupons },
          { title: "Expired Coupon", value: expiredCoupons },
          { title: "Active Coupon", value: activeCoupons },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg shadow-sm bg-white border border-gray-200 flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {card.value}
              </p>
            </div>
            <img className="w-12 h-12" src="/coupon.png" alt="coupon" />
          </div>
        ))}
      </section>

      {/* Table Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Coupons{" "}
          <span className="text-pink-500">({totalCoupons} Coupons)</span>
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <img className="w-4" src="/filter.png" alt="filter" /> Filters
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    setFilter("All");
                    setShowDropdown(false);
                  }}
                  className={`block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left ${
                    filter === "All" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setFilter("Active");
                    setShowDropdown(false);
                  }}
                  className={`block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left ${
                    filter === "Active" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setFilter("Expired");
                    setShowDropdown(false);
                  }}
                  className={`block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left ${
                    filter === "Expired" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Expired
                </button>
              </div>
            )}
          </div>

          <button
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            onClick={() => setShowForm(!showForm)}
          >
            Add Coupon
          </button>
        </div>
      </div>

      
      {/* Coupons Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto mt-4">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-gray-600 font-medium">Coupon</th>
              <th className="px-6 py-3 text-gray-600 font-medium">
                Discount Type
              </th>
              <th className="px-6 py-3 text-gray-600 font-medium">
                Discount Amount
              </th>
              <th className="px-6 py-3 text-gray-600 font-medium">
                Minimum Order
              </th>
              <th className="px-6 py-3 text-gray-600 font-medium">
                Usage Limit
              </th>
              <th className="px-6 py-3 text-gray-600 font-medium">Status</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCoupons.map((coupon, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-6 py-3">{coupon.code}</td>
                <td className="px-6 py-3">{coupon.discountType}</td>
                <td className="px-6 py-3">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}
                </td>
                <td className="px-6 py-3">{coupon.minimumOrderValue || "-"}</td>
                <td className="px-6 py-3">{coupon.usageLimit || "-"}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      coupon.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {coupon.status}
                  </span>
                </td>
                <td className="px-6 py-3 flex items-center gap-2">
                  <button  onClick={() => handleEditClick(coupon)}>Edit</button>
                  <button onClick={()=> handleDelete(coupon)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredCoupons.length)}{" "}
          of {filteredCoupons.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Coupon Form */}
      {showForm && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Coupon
          </h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600">Coupon Code</label>
                <input
                  type="text"
                  {...register("code")}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code.message}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600">Discount Type</label>
                <select
                  {...register("discountType")}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Flat</option>
                </select>
                {errors.discountType && (
                  <p className="text-red-500 text-sm">
                    {errors.discountType.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-600">Discount Value</label>
                <input
                  type="number"
                  {...register("discountValue")}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-sm">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-600">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  {...register("minimumOrderValue")}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Usage Limit</label>
                <input
                  type="number"
                  {...register("usageLimit")}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Valid Until</label>
                <input
                  type="date"
                  {...register("validUntil")}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                {errors.validUntil && (
                  <p className="text-red-500 text-sm">
                    {errors.validUntil.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg"
                >
                  Save Coupon
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

{showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Edit Coupon
            </h3>
            <form onSubmit={handleSubmit(onUpdate)}>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-600">Valid Until</label>
                <input {...register("validUntil")} type="date" className="w-full p-2 border rounded" />
                <p className="text-red-500 text-xs">{errors.validUntil?.message}</p>
              </div>

              <div className="mb-4">
              <label className="block text-sm text-gray-600">Usage Limit</label>
                <input {...register("usageLimit")} type="number" className="w-full p-2 border rounded" />
                <p className="text-red-500 text-xs">{errors.usageLimit?.message}</p>
              </div>

              
              <div className="mb-4">
              <label className="block text-sm text-gray-600">Minimum Order Value</label>
                <input {...register("minimumOrderValue")} type="number" className="w-full p-2 border rounded" />
                <p className="text-red-500 text-xs">{errors.minimumOrderValue?.message}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
