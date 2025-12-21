import api from "./api";

export const likeProduct = async (productId, collectionName = "") => {
  try {
    const response = await api.post("/wishlist/like", {
      productId,
      collectionName,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const unlikeProduct = async (productId, collectionName = "") => {
  try {
    const response = await api.post("/wishlist/unlike", {
      productId,
      collectionName,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getMyWishlist = async () => {
  try {
    const response = await api.get("/wishlist/my-wishlist");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteCollection = async (collectionName) => {
  try {
    const response = await api.delete("/wishlist/collection", {
      data: { collectionName },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
