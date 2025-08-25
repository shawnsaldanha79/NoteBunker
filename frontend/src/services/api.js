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

// Function to get CSRF token from cookie
const getCsrfTokenFromCookie = () => {
    const name = "XSRF-TOKEN=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("JWT_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Get CSRF token from cookie instead of localStorage
        const csrfToken = getCsrfTokenFromCookie();
        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration and errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("JWT_TOKEN");
            localStorage.removeItem("USER");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;