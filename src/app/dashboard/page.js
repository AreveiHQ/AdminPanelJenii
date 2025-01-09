"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";

import { Edit } from "iconoir-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      }
    };
    fetchData();
  }, []);

  if (!dashboardData) {
    return <p>Loading...</p>;
  }

  const { totalOrders, totalRevenue, paymentModes, recentOrders, ordersByMonth } = dashboardData;

  // Data for Payment Modes Distribution
  const paymentModesData = {
    labels: paymentModes.map((mode) => mode._id),
    datasets: [
      {
        label: "Payment Modes Distribution",
        data: paymentModes.map((mode) => mode.count),
        backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"],
      },
    ],
  };

  const paymentModesOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Payment Modes Distribution" },
    },
  };

  // Data for Orders by Month
  const ordersByMonthData = {
    labels: ordersByMonth.map(
      (entry) => `${entry._id.year}-${entry._id.month.toString().padStart(2, "0")}`
    ),
    datasets: [
      {
        label: "Orders by Month",
        data: ordersByMonth.map((entry) => entry.count),
        backgroundColor: "#42A5F5",
      },
    ],
  };

  const ordersByMonthOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Orders by Month" },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">Rs.{totalRevenue}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
         {/* Payment Modes Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <Bar data={paymentModesData} options={paymentModesOptions} />
      </div>

      {/* Orders by Month Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <Bar data={ordersByMonthData} options={ordersByMonthOptions} />
      </div>
      </div>
      {/* Recent Orders Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
       <div className="flex justify-between">
       <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h2>
       <Link href="/dashboard/orders">
                    <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400">
                        <Edit className="w-5 h-5" /> Manage Orders
                    </button>
        </Link>
       </div>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Order ID</th>
              <th className="border border-gray-300 p-2">Customer</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 p-2">{order.orders[0].orderID}</td>
                <td className="border border-gray-300 p-2">{order.orders[0].customer.name}</td>
                <td className="border border-gray-300 p-2">Rs.{order.orders[0].amount}</td>
                <td className="border border-gray-300 p-2">{order.orders[0].orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;