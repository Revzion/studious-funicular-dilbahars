import api from "./api";

export const getCompanyProfileService = async () => {
  try {
    const response = await api.get("/company/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching company profiles:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
