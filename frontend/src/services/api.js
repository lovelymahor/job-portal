import axios from "axios";

const API = axios.create({
  baseURL: "https://job-portal-57e4.onrender.com",
});

export default API;