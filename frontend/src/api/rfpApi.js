import axios from 'axios';

const API_URL = 'http://localhost:3000/api/rfps';

export const createRFP = async (rfpData) => {
    const response = await axios.post(API_URL, rfpData);
    return response.data;
};

export const getRFPs = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getRFPById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const sendRFP = async (rfpId, vendorIds) => {
    const response = await axios.post(`${API_URL}/send`, { rfpId, vendorIds });
    return response.data;
};


