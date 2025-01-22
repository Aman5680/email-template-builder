import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

export const getEmailLayout = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getEmailLayout`);
    return response.data;
  } catch (error) {
    console.error("Error fetching email layout:", error);
    return null;
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await axios.post(`${API_BASE_URL}/uploadImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
