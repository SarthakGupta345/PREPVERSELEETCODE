import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://alfa-leetcode-api.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
})