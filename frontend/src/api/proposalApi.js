import axios from 'axios';

const API_URL = 'http://localhost:3000/api/proposals';

export const checkEmails = async () => {
    const response = await axios.post(`${API_URL}/check-emails`);
    return response.data;
};

export const getProposals = async (rfpId) => {
    const response = await axios.get(`${API_URL}/rfp/${rfpId}`);
    return response.data;
};

export const getProposalRecommendation = async (rfpId) => {
    const response = await axios.get(`${API_URL}/rfp/${rfpId}/recommendation`);
    return response.data;
};
