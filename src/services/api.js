import axios from "axios";

const api = axios.create({
    baseURL: '/api/v1/',
    withCredentials: true,
});

// Enable this to add authentication tokens
api.interceptors.request.use(
    (config) => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 errors gracefully
        if (error.response?.status === 401) {
            // Optional: redirect to login or clear invalid tokens
            if (typeof window !== "undefined") {
                // localStorage.removeItem("token");
                // window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;