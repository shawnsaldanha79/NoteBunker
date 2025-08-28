import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMyContext } from "../../store/useMyContext";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken, setIsAdmin } = useMyContext();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                localStorage.setItem("JWT_TOKEN", token);

                const user = {
                    username: decodedToken.sub,
                    roles: decodedToken.roles.split(","),
                };
                localStorage.setItem("USER", JSON.stringify(user));

                setToken(token);
                setIsAdmin(user.roles.includes("ADMIN"));

                setTimeout(() => {
                    navigate("/notes");
                }, 100);
            } catch (error) {
                console.error("Token decoding failed:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [location, navigate, setToken, setIsAdmin]);

    return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
