import { Navigate } from "react-router-dom";


/**
 * Component bảo vệ route theo trạng thái đăng nhập và role.
 *
 * Nếu chưa đăng nhập, user sẽ được chuyển về trang login.
 * Nếu sai role, user sẽ được điều hướng về khu vực phù hợp.
 */

function ProtectedRoute({ 
    children, 
    requiredRole,
    loginPath = "/auth/login",
 }) {
    const token = localStorage.getItem("token");

    const role =
        localStorage.getItem("role") ||
        JSON.parse(localStorage.getItem("user") || "null")?.role;

    if (!token) {
        return <Navigate to={loginPath} replace />;
    }

    if (requiredRole && role !== requiredRole) {
        if (role === "ROLE_ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        if (role === "ROLE_CUSTOMER"){
            return <Navigate to="/" replace />;
        }

        return <Navigate to={loginPath} replace />;
    }

    return children;
}

export default ProtectedRoute;