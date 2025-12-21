import api from './api'; 

export const getCategoriesService = async () => {
  try {
    const response = await api.get('/category/active-all');
  //  console.log('response for category', response)
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error?.response?.data || { message: 'An error occurred while fetching categories' };
  }
};

export const getCategoryByIdService = async (id) => {
  try {
    const response = await api.get(`/category/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error?.response?.data || { message: 'An error occurred while fetching the category' };
  }
};

export const toggleCategoryActiveService = async (id) => {
  try {
    const response = await api.delete(`/category/delete-category/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling active status for category with id ${id}:`, error);
    throw error?.response?.data || { message: 'An error occurred while toggling the category status' };
  }
};
