import React, { useState, useEffect } from 'react';
import { getVendors, createVendor, deleteVendor, updateVendor } from '../api/vendorApi';

const VendorManager = () => {
    const [vendors, setVendors] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', specialized_categories: '' });
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const data = await getVendors();
            setVendors(data);
        } catch (error) {
            console.error('Error fetching vendors', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStyle = () => {
        // Placeholder for dynamic style logic if needed
        return "bg-gray-800 p-4 rounded-lg shadow-lg";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateVendor(editingId, formData);
                setEditMode(false);
                setEditingId(null);
            } else {
                await createVendor(formData);
            }
            setFormData({ name: '', email: '', specialized_categories: '' });
            fetchVendors();
        } catch (error) {
            console.error('Error saving vendor', error);
        }
    };

    const handleEdit = (vendor) => {
        setFormData({
            name: vendor.name,
            email: vendor.email,
            specialized_categories: vendor.specialized_categories || ''
        });
        setEditMode(true);
        setEditingId(vendor.id);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditingId(null);
        setFormData({ name: '', email: '', specialized_categories: '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                await deleteVendor(id);
                fetchVendors();
            } catch (error) {
                console.error('Error deleting vendor', error);
            }
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Vendor Management</h1>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-8">
                <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Vendor' : 'Add New Vendor'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Vendor Name"
                        className="p-3 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="p-3 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Specialties (e.g. Laptops, Server)"
                        className="p-3 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 outline-none md:col-span-2"
                        value={formData.specialized_categories}
                        onChange={(e) => setFormData({ ...formData, specialized_categories: e.target.value })}
                    />
                    <div className="md:col-span-2 flex gap-3">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition">
                            {editMode ? 'Update Vendor' : 'Add Vendor'}
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-gray-400 border-b border-gray-700">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Specialties</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                        ) : vendors.length === 0 ? (
                            <tr><td colSpan="4" className="p-4 text-center text-gray-500">No vendors found.</td></tr>
                        ) : (
                            vendors.map((vendor) => (
                                <tr key={vendor.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                                    <td className="p-4 font-medium">{vendor.name}</td>
                                    <td className="p-4 text-gray-300">{vendor.email}</td>
                                    <td className="p-4 text-gray-400">{vendor.specialized_categories}</td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(vendor)}
                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vendor.id)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorManager;
