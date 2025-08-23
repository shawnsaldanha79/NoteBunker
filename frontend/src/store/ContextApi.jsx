import { createContext, useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("JWT_TOKEN")
        ? JSON.stringify(localStorage.getItem("JWT_TOKEN"))
        : null;
    const isAdmin = localStorage.getItem("IS_ADMIN")
        ? JSON.stringify(localStorage.getItem("IS_ADMIN"))
        : false;

    const [token, setToken] = useState(getToken);
    const [currentUser, setCurrrentUser] = useState(null);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(isAdmin);

    const fetchUser = async () => {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (user?.username) {
            try {
                const { data } = await api.get(`/auth/user`);
                const roles = data.roles;
                if (roles.includes("ROLE_ADMIN")) {
                    localStorage.setItem("IS_ADMIN", JSON.stringify(true));
                    setIsAdminUser(true);
                } else {
                    localStorage.removeItem("IS_ADMIN");
                    setIsAdminUser(false);
                }
                setCurrrentUser(data);
            } catch (error) {
                console.log("Error fetching current user:", error);
                toast.error("Error fetching current user");
            }
        }
    };
    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, [token]);
    return (
        <ContextApi.Provider
            value={{
                token,
                setToken,
                currentUser,
                setCurrrentUser,
                openSidebar,
                setOpenSidebar,
                isAdminUser,
                setIsAdminUser,
            }}
        >
            {children}
        </ContextApi.Provider>
    );
};
