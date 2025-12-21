import api from "./api";

export const getCarouselImages = async () => {
  try {
    const response = await api.get("/carousel");
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};