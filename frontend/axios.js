import axios from "axios";

const instance = axios.create({
  baseURL: "https://full-stack-socialmediaapp.onrender.com", // Backend base URL
});

export default instance;
