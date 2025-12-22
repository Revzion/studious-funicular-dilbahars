import axios from "axios";

const api = axios.create({
    // For local development, you can switch between these:
    // baseURL: "http://localhost:5000/api/v1/", // Local backend
    baseURL: '/api/v1/', // Production - uses Next.js proxy

    withCredentials: true,
});

// Uncomment if you need authentication with tokens
// api.interceptors.request.use(
//   (config) => {
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     console.log("token", token);
//
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // console.log("error", error);
        return Promise.reject(error);
    }
);

export default api;