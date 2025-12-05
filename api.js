const API_BASE_URL = "http://localhost:4000"; // Replace with your backend URL

export const fetchRFPs = async () => {
  const response = await fetch(`${API_BASE_URL}/rfp`);
  if (!response.ok) {
    throw new Error("Failed to fetch RFPs");
  }
  return response.json();
};

export const createRFP = async (description) => {
  const response = await fetch(`${API_BASE_URL}/rfp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });
  if (!response.ok) {
    throw new Error("Failed to create RFP");
  }
  return response.json();
};