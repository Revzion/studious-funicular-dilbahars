import api from "./api";

export const addMainProduct = async (data) => {
  try {
    const response = await api.post("/product/main-product", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding main product:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const addSubProductToMain = async (mainProductId, formData) => {
  try {
    const response = await api.post(
      `/product/sub-product-tomain/${mainProductId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding sub-product:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getProducts = async (queryParams = {}) => {
  try {
    const response = await api.get("/product", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getProductByCustomUrl = async (customUrl) => {
  try {
    const response = await api.get(`/product/${customUrl}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching product by custom URL:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getBestSellingProducts = async () => {
  try {
    const response = await api.get("/product/bestselling");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching best-selling products:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getAllActiveProducts = async (params = {}) => {
  try {
    const response = await api.get("/product/", { params });
    // console.log('product response', response)
    // console.log('Product response', response)
    return response.data;
  } catch (error) {
    throw error?.response?.data || { error: "Failed to fetch active products" };
  }
};

export const toggleProductStatus = async (productId) => {
  try {
    const response = await api.delete(`/product/main-product/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error toggling product status:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getSimilarProductsByCategory = async (productId) => {
  try {
    const response = await api.get(`/product/similar/${productId}`);
    console.log("getSimilarProductsByCategory response", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching similar products by category:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getNewArrivalProducts = async () => {
  try {
    const response = await api.get("product/new-arrivals");
    return response.data;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error?.response?.data || error;
  }
};

export const getActiveProductsByCustomerType = async (type) => {
  try {
    const response = await api.get(`/product/customer-type/${type}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || { error: "Failed to fetch B2B products" };
  }
};
