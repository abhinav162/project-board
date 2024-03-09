import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://my-json-server.typicode.com/abhinav162/project-board",
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;