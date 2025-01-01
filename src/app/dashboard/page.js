"use client"
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // Data for Bar Chart
  const barChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [3000, 4000, 3500, 5000, 4500, 6000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Data for Pie Chart
  const pieChartData = {
    labels: ["Braclet", "Ring", "Nackels", "Bangle"],
    datasets: [
      {
        label: "Category Distribution",
        data: [40, 30, 20, 10],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Jenni's Dashboard</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />
          <button className="p-2 bg-red-600 text-white rounded-lg">Search</button>
        </div>
      </header>

      {/* Analytics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Sales", value: "Rs.50,000", color: "bg-purple-100" },
          { title: "Orders", value: "1200", color: "bg-blue-100" },
          { title: "Revenue", value: "Rs.35,000", color: "bg-green-100" },
          { title: "Customers", value: "500", color: "bg-yellow-100" },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg shadow-md ${card.color}`}
          >
            <h3 className="text-lg font-semibold text-gray-700">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </section>

      {/* Graphs and Tables */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Revenue Trends
          </h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>

        {/* Pie Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Product Category Distribution
          </h3>
          <Pie data={pieChartData} />
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Orders
        </h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 text-gray-600">Customer</th>
              <th className="py-2 text-gray-600">Product</th>
              <th className="py-2 text-gray-600">Price</th>
              <th className="py-2 text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((_, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">Customer {idx + 1}</td>
                <td>Product {idx + 1}</td>
                <td>Rs.10000</td>
                <td>2024-12-14</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
