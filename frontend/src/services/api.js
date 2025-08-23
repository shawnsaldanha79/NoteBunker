import axios from "axios";

console.log("API URL: ", import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("JWT_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        let csrfToken = localStorage.getItem("CSRF_TOKEN");
        if (!csrfToken) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/csrf-token`,
                    {
                        withCredentials: true,
                    }
                );
                csrfToken = response.data.token;
                localStorage.setItem("CSRF_TOKEN", csrfToken);
            } catch (error) {
                console.log("Error fetching CSRF token:", error);
            }
        }
        if (csrfToken) {
            config.headers["X-CSRF-TOKEN"] = csrfToken;
        }
        console.log("X-CSRF-TOKEN: ", csrfToken);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
