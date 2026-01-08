import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api/v1/",
  // baseURL: 'https://dilbahars-ecom-b2b-b2c.onrender.com/api/v1/',
  // baseURL: 'https://dilbahars-ecom-b2b-b2c-production.up.railway.app/api/v1/',
  baseURL: 'baseURL: \'https://jgq28ngcpf.us-east-1.awsapprunner.com/api/v1/\',',
  

  withCredentials: true,
});

// api.interceptors.request.use(
//   (config) => {
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     console.log("token", token);

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
