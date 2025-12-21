import api from "./api";

export const registerB2bUser = async (formData) => {
  try {
    const response = await api.post("/b2b/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};

export const loginB2BUser = async (data) => {
  try {
    console.log('called B2B')
    const response = await api.post("/b2b/login", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};

export const logoutB2BUser = async () => {
  try {
    const response = await api.get("/b2b/logout");
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};

export const getB2BProfile = async () => {
  try {
    const response = await api.get("/b2b/profile");
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};

export const updateB2BProfile = async (formData) => {
  try {
    console.log('formData', formData)
    const response = await api.put("/b2b/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};

export const forgotB2BPassword = async (data) => {
  try {
    const response = await api.post("/b2b/forgot-password", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};

export const changeB2BPassword = async (data) => {
  try {
    const response = await api.post("/b2b/password", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};

export const resetB2BPassword = async (data) => {
  try {
    const response = await api.put("/b2b/reset-password", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || error;
  }
};
