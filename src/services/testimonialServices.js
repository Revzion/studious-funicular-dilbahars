import api from "@/services/api"; // adjust path if needed

// Create a new testimonial
export const createTestimonial = async (testimonialData) => {
  const response = await api.post("testimonials/create", testimonialData);
  return response.data;
};

// Get all testimonials
export const getAllTestimonials = async () => {
  const response = await api.get("testimonials/all");
  return response.data;
};

// Get testimonial by ID
export const getTestimonialById = async (id) => {
  const response = await api.get(`testimonials/${id}`);
  return response.data;
};

// Delete testimonial by ID
export const deleteTestimonialById = async (id) => {
  const response = await api.delete(`testimonials/delete/${id}`);
  return response.data;
};
