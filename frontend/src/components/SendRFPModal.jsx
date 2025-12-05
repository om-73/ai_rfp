import React, { useState, useEffect } from 'react';
import { getVendors } from '../api/vendorApi';

const SendRFPModal = ({ isOpen, onClose, onSend, rfpId }) => {
    const [vendors, setVendors] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchVendors();
        }
    }, [isOpen]);

    const fetchVendors = async () => {
        try {
            const data = await getVendors();
            setVendors(data);
        } catch (error) {
            console.error("Failed to load vendors", error);
        }
    };

    const toggleVendor = (id) => {
        if (selectedVendors.includes(id)) {
            setSelectedVendors(selectedVendors.filter(v => v !== id));
        } else {
            setSelectedVendors([...selectedVendors, id]);
        }
    };

    const handleSend = () => {
        onSend(selectedVendors);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-white">Select Vendors</h2>
                <div className="max-h-60 overflow-y-auto mb-6 space-y-2">
                    {vendors.map(vendor => (
                        <div
                            key={vendor.id}
                            className={`p-3 rounded cursor-pointer border ${selectedVendors.includes(vendor.id) ? 'bg-blue-900/50 border-blue-500' : 'bg-gray-700 border-gray-600'}`}
                            onClick={() => toggleVendor(vendor.id)}
                        >
                            <div className="font-semibold text-gray-200">{vendor.name}</div>
                            <div className="text-sm text-gray-400">{vendor.specialized_categories}</div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-gray-300 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={selectedVendors.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-bold"
                    >
                        Send to {selectedVendors.length} Vendors
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendRFPModal;
