import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_URL = `${BASE_URL}/vendors`;

export const getVendors = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createVendor = async (vendorData) => {
    const response = await axios.post(API_URL, vendorData);
    return response.data;
};

export const updateVendor = async (id, vendorData) => {
    const response = await axios.put(`${API_URL}/${id}`, vendorData);
    return response.data;
};

export const deleteVendor = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
