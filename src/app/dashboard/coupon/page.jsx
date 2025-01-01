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

  const {
    register,
    handleSubmit,
    reset,
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
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
            <img className="w-4" src="/filter.png" alt="filter" /> Filters
          </button>
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            onClick={() => setShowForm(!showForm)}
          >
            Add Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
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
            {coupons.map((coupon, idx) => (
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
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing 1-5 from {coupons.length}
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
            Previous
          </button>
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
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
                  <option value="flat">Flat</option>
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
                  onClick={() => setShowForm(false)}
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
    </div>
  );
}
