'use client'
import axios from "axios"
import { useEffect, useState } from "react"

export default function Page() {
    const [data, setData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/categories");
            const data = await response.data;
            setData(data);
            console.log(data);
        };
        fetchData();
    }, []);

    const handleEditClick = (category) => {
        setEditCategory(category);
        setShowEditModal(true);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const { name, parentCategory, discountOffer } = event.target.elements;
        const updatedCategory = {
            name: name.value,
            parentCategory: parentCategory.value,
            discountOffer: discountOffer.value,
        };

        try {
            const response = await axios.put(`/api/categories/update/${editCategory._id}`, updatedCategory);
            const updatedData = data.map((category) =>
                category._id === editCategory._id ? response.data : category
            );
            setData(updatedData);
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-gray-600 font-medium">Name</th>
                            <th className="px-6 py-3 text-gray-600 font-medium">Parent Category</th>
                            <th className="px-6 py-3 text-gray-600 font-medium">Discount Offer</th>
                            <th className="px-6 py-3 text-gray-600 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((category, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-6 py-3">{category.name}</td>
                                <td className="px-6 py-3">{category.parentCategory}</td>
                                <td className="px-6 py-3">{category.discountOffer}%</td>
                                <td className="px-6 py-3">
                                    <button
                                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                                        onClick={() => handleEditClick(category)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Edit Category</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600">Name</label>
                                <input
                                    name="name"
                                    defaultValue={editCategory.name}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600">Parent Category</label>
                                <input
                                    name="parentCategory"
                                    defaultValue={editCategory.parentCategory}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600">Discount Offer</label>
                                <input
                                    name="discountOffer"
                                    defaultValue={editCategory.discountOffer}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
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