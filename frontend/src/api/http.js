import axios from "axios";

export const http = axios.create({
    baseURL: "http://localhost:8000",
});

http.interceptors.request.use((config) => {
    const role = localStorage.getItem("role");
    if (role) config.headers["X-ROLE"] = role; // pour les routes /bibliothecaire/*
    return config;
});