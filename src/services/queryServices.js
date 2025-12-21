import api from "./api";

export const addQueryService = async (formData) => {
  try {
    const response = await api.post("/query/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding query:", error);
    throw (
      error?.response?.data?.message || {
        message: "An error occurred while submitting the query",
      }
    );  
  }
};

export const addB2bQueryService = async (formData) => {
  try {
    const response = await api.post("/query/add-b2b", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding B2B query:", error);
    throw (
      error?.response?.data || {
        message: "An error occurred while submitting the B2B query",
      }
    );
  }
};

export const getAllQueriesService = async () => {
  try {
    const response = await api.get("/query/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all queries:", error);
    throw (
      error?.response?.data || {
        message: "An error occurred while fetching all queries",
      }
    );
  }
};

export const getUserQueriesService = async () => {
  try {
    const response = await api.get("/query/my-query");
    // console.log("getUserQueriesService", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user queries:", error);
    throw (
      error?.response?.data || {
        message: "An error occurred while fetching your queries",
      }
    );
  }
};

export const getQueriesByDateService = async (startDate, endDate) => {
  try {
    const response = await api.get("/query/queries", {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching queries by date:", error);
    throw (
      error?.response?.data || {
        message: "An error occurred while filtering queries",
      }
    );
  }
};

export const getB2bUserQueriesService = async () => {
  try {
    const res = await api.get("/query/b2b-user");
    return res.data;
  } catch (error) {
    console.error("Error fetching B2B user queries:", error);
    throw (
      error?.response?.data || {
        message: "An error occurred while fetching your B2B queries",
      }
    );
  }
};
