"use client";

import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Stats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/stats") // Adjust the endpoint path if needed
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div>Loading...</div>;

  const salesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue (in ₹)",
        data: data.salesData.map((d) => d.totalRevenue), // Map totalRevenue to data
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        pointBackgroundColor: "rgba(75, 192, 192, 1)", // Dot color
        pointRadius: 5, // Size of the dot
        borderWidth: 2, // Line width
        tension: 0.4, // Curved line
        fill: false, // No fill under the line
      },
    ],
  };

 

  const bestSellingProductsData = {
    labels: data.productSalesData.map((p) => p.name),
    datasets: [
      {
        label: "Sales (in units)",
        data: data.productSalesData.map((p) => p.sales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const customerDemographicsData = {
    labels: data.customerDemographics.map((c) => c._id),
    datasets: [
      {
        label: "Customer Count",
        data: data.customerDemographics.map((c) => c.count),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // User Registration per Month (Bar Chart)
  const userRegistrationData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Users Registered",
        data: Array(12).fill(0), // Initialize data array with 12 months
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Populate the user registration data by month
  data.userRegistrationStats.forEach((stat) => {
    const monthIndex = stat._id - 1; // Convert month number to 0-based index
    userRegistrationData.datasets[0].data[monthIndex] = stat.userCount;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        eCommerce Dashboard
      </h2>

      {/* Flexbox Layout for 2-up, 2-down charts */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {/* Sales Performance and Best-Selling Products in the first row */}
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Sales Performance
          </h3>
          <Line data={salesData} options={{ responsive: true }} height={250} />
        </div>

        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Best-Selling Products
          </h3>
          <Bar
            data={bestSellingProductsData}
            options={{ responsive: true }}
            height={250}
          />
        </div>

        {/* User Registration per Month and Customer Demographics in the second row */}
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            User Registrations per Month
          </h3>
          <Bar
            data={userRegistrationData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    min: 0,
                    max: 1000, // Adjusting the Y-axis for user registrations
                  },
                },
              },
            }}
            height={250}
          />
        </div>

        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Customer Demographics
          </h3>
          <Pie
            data={customerDemographicsData}
            options={{ responsive: true }}
            height={200}
            width={300}
          />
        </div>
      </div>
    </div>
  );
}
