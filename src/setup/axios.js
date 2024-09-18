import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
    baseURL: 'http://localhost:8080'
});

instance.defaults.withCredentials = true;
// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request erroror

    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response erroror
    const status = error && error.response?.status || 500;
    switch (status) {
        case 401:
            toast.error("Unauthorized user, please login.");
            return error.response.data;
        case 403:
            toast.error("You don't have the permission to access this resource...");

            break;
        case 404:
            toast.error("Resource not found.");
            break;
        case 409:
            toast.error("Conflict occurred.");
            break;
        case 422:
            toast.error("Unprocessable entity.");
            break;
        default:
            toast.error("Something wrongs error");
            break;
    }

});

export default instance;