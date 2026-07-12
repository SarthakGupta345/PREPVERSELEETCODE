import axios from "axios"
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
})

// axiosInstance.interceptors.request.use(
//     (config) => {

//         const token = localStorage.getItem("token");

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//     (response) => response,

//     (error) => {

//         if (error.response?.status === 401) {
//             console.log("Unauthorized");
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosInstance
