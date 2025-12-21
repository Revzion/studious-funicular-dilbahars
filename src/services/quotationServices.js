import api from './api'; 

export const addQuotationService = async (formData) => {
  try {
    const response = await api.post('/quotation/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Add Quotation Service Error:', error);
    throw error.response?.data || { message: 'Unable to add quotation' };
  }
};

export const getQuotationDetailsService = async (id) => {
  try {
    const response = await api.get(`/quotation/get/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Quotation Details Service Error:', error);
    throw error.response?.data || { message: 'Unable to fetch quotation details' };
  }
};

export const getB2bUserQuotations = async ({ startDate, endDate, quotationId } = {}) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (quotationId) params.quotationId = quotationId;

    const response = await api.get('/quotation/my-quotations', { params });
    return response.data;
  } catch (error) {
    console.error('Get my Quotations Service Error:', error);
    throw error.response?.data || { message: 'Unable to fetch my quotations' };
  }
};

export const updateQuotationStatusByCustomerService = async (quotationId, status) => {
  try {
    const response = await api.patch(`/quotation/status/${quotationId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Update Quotation Status by Customer Error:', error);
    throw error.response?.data || { message: 'Unable to update quotation status' };
  }
};

