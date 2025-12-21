import api from './api';

export const createBlog = async (formData) => {
  try {
    const response = await api.post('/blog/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await api.get('/blog/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const toggleLike = async (blogId) => {
  try {
    const response = await api.patch(`/blog/like/${blogId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
