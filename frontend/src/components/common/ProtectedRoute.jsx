import { Navigate } from "react-router-dom";
import { useMyContext } from "../../store/useMyContext";

const ProtectedRoute = ({ children, adminPage }) => {
    const { token, isAdminUser } = useMyContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (token && adminPage && !isAdminUser) {
        return <Navigate to="/access-denied" />;
    }

    return children;
};

export default ProtectedRoute;
