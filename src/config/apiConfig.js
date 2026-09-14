import axios from "axios"

export const API_BASE_URL = "http://localhost:8000/api/"

export const api=axios.create({
    baseURL:API_BASE_URL
})

api.interceptors.request.use(config => {
    const jwt = localStorage.getItem("jwt");
    const role=localStorage.getItem("role");
    if (jwt) {
        config.headers["Authorization"] = `Bearer ${jwt}`;
        config.headers["Role"] = role;
    }
    console.log("API request headers:", config.headers)
    return config;
}, error => {
    return Promise.reject(error);
});