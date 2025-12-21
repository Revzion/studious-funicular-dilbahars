import api from "./api";

export const loginB2cUserService = async (data) => {
  try {
    const response = await api.post("/b2c/login", data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

export const registerB2cUserService = async (formData) => {
  try {
    const response = await api.post("/b2c/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

export const logoutB2cUserService = async () => {
  try {
    const response = await api.get("/b2c/logout");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export const getProfileService = async () => {
  try {
    const response = await api.get("/b2c/profile");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Fetching profile failed"
    );
  }
};

export const updateB2cProfileService = async (formData) => {
  try {
    const response = await api.put("/b2c/update", formData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Profile update failed");
  }
};

export const addB2cAddressService = async (addressData) => {
  try {
    const response = await api.post("/b2c/address/add", addressData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error || "Failed to add address";
    throw new Error(errorMessage);
  }
};

export const deleteB2cAddressService = async (addressId) => {
  try {
    const response = await api.delete(`/b2c/delete/${addressId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete address"
    );
  }
};

export const forgetPasswordService = async (email) => {
  try {
    const response = await api.post("/b2c/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Reset password request failed"
    );
  }
};

export const changePasswordService = async ({
  token,
  password,
  confirmPassword,
}) => {
  try {
    const response = await api.post("/b2c/password", {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Changing password failed"
    );
  }
};

export const resetPasswordService = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  try {
    const response = await api.put("/b2c/reset-password", {
      oldPassword,
      newPassword,
      confirmPassword,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Password change failed");
  }
};

export const updateB2cAddressService = async (addressId, addressData) => {
  try {
    const response = await api.put(`b2c/address/update/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Password change failed");
  }
};
