import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
    const token = localStorage.getItem("token");
    const role =
        localStorage.getItem("role") ||
        JSON.parse(localStorage.getItem("user") || "null")?.role;

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default ProtectedRoute;