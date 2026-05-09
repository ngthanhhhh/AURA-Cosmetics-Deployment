import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/admin/login" />;
    }

    if (user.role !== "ROLE_ADMIN"){
        return <Navigate to="/"/>;
    }

    return children;
}

export default ProtectedRoute;