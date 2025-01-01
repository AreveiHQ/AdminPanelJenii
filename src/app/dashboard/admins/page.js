"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit } from "iconoir-react";

export default function App() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({ role: "", status: "" });
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/admin`);
        const data = response.data.users;
        setAdmins(data);
        setFilteredAdmins(data);
        setAdminCount(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = admins;

      if (filterCriteria.role) {
        filtered = filtered.filter((admin) => admin.role === filterCriteria.role);
      }
      if (filterCriteria.status) {
        const isActive = filterCriteria.status === "active";
        filtered = filtered.filter((admin) => admin.active === isActive);
      }

      setFilteredAdmins(filtered);
      setAdminCount(filtered.length);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setCurrentPage(1); // Reset to the first page after filtering
    };

    applyFilters();
  }, [filterCriteria, admins]);


  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const currentAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Admin Users <span className="text-pink-500">({adminCount})</span>
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilterVisible(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <img className="w-4" src="/filter.png" alt="filter" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-gray-600 font-medium">Serial</th>
              <th className="px-6 py-3 text-gray-600 font-medium">User</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Email</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Role</th>
              <th className="px-6 py-3 text-gray-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.map((admin, idx) => (
              <tr key={admin.id} className="border-b">
                <td className="px-6 py-3">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-6 py-3">{admin.username}</td>
                <td className="px-6 py-3">{admin.email}</td>
                <td className="px-6 py-3">{admin.role}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      admin.active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {admin.active ? "Active" : "Not Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {currentAdmins.length} admin{currentAdmins.length > 1 ? "s" : ""} on page {currentPage} of {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-gray-600 border border-gray-300 rounded-lg ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-gray-600 border border-gray-300 rounded-lg ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {filterVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4">Filter Admins</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={filterCriteria.role}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filterCriteria.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="notActive">Not Active</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setFilterVisible(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setFilterVisible(false)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
