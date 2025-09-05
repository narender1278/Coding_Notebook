import axios from "axios"
//in prod there is not local host so make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
    baseURL:BASE_URL,
})

export default api;