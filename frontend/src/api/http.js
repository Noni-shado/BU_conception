import axios from "axios";

export const http = axios.create({
    baseURL: "http://localhost:8000",
});

http.interceptors.request.use((config) => {
    const role = localStorage.getItem("role");
    const utilisateurId = localStorage.getItem("utilisateur_id");

    if (role) config.headers["X-ROLE"] = role;
    if (utilisateurId) config.headers["X-USER-ID"] = utilisateurId;

    return config;
});