import api from './api';

export const sendContactMessage = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData);
    return response.data;
  } catch (error) {
    console.error("Error sending contact message:", error);
    
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};
