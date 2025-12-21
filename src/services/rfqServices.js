import api from './api';

export const addRFQService = async (rfqData) => {
  try {
    const response = await api.post('/rfq/add', rfqData);
    return response.data;
  } catch (error) {
    console.error('Add RFQ Service Error:', error);
    throw error.response?.data || { message: 'Error adding RFQ' };
  }
};

export const getAllRFQsService = async () => {
  try {
    const response = await api.get('/rfq/');
    return response.data;
  } catch (error) {
    console.error('Get All RFQs Service Error:', error);
    throw error.response?.data || { message: 'Error fetching RFQs' };
  }
};

export const getB2BUserRFQsService = async ({ startDate, endDate, rfqId } = {}) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (rfqId) params.rfqId = rfqId;

    const response = await api.get('/rfq/b2b_user', { params });
    return response.data;
  } catch (error) {
    console.error('Get B2B User RFQs Service Error:', error);
    throw error.response?.data || { message: 'Error fetching your RFQs' };
  }
};

export const submitPendingRFQsService = async () => {
  try {
    const response = await api.put('/rfq/submit');
    return response.data;
  } catch (error) {
    console.error('Submit Pending RFQs Service Error:', error);
    throw error.response?.data || { message: 'Error submitting RFQs' };
  }
};

export const adminResponseRFQService = async (id, status) => {
  try {
    const response = await api.patch(`/rfq/admin-response/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Admin Response RFQ Service Error:', error);
    throw error.response?.data || { message: 'Error updating RFQ status' };
  }
};
