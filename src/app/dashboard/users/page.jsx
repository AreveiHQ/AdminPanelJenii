'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit } from 'iconoir-react';
import { MdDelete } from "react-icons/md"

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        console.log(response.data)
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

 
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    } else {
      setFilteredUsers(users);
    }
  };

  // Calculate the users to display on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-2 sm:px-5 sm:py-4">
     <h2 className="text-xl mb-2 font-semibold text-gray-700">
          All Users{" "}
          <span className="text-pink-500">({users.length})</span>
      </h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users by name or email"
        className="mb-4 p-2 border rounded w-full"
      />
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-gray-600 font-medium">Serial</th>
                <th className="px-6 py-3 text-gray-600 font-medium">User</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Email</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Phone</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Role</th>
                <th className="px-6 py-3 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, idx) => (
                <tr key={user.id} className="border-b">
                  <td className="px-6 py-3">{indexOfFirstUser + idx + 1}</td>
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className='px-6 py-3'>{user.phone}</td>
                  <td className="px-6 py-3">{user.role||"Customer"}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.isVerified
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {user.isVerified?"Verified":"Not Verified"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, filteredUsers.length)} of{' '}
              {filteredUsers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
    </div>
  );
}
