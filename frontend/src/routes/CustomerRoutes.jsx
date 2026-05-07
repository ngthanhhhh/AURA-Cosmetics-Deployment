import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../components/layout/CustomerLayout";
import HomePage from "../pages/customer/HomePage";
import ProductListPage from "../pages/customer/ProductListPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ChangePasswordPage from "../pages/customer/ChangePasswordPage";


function CustomerRoutes() {
    return (
    <CustomerLayout>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        
        </Routes>
    </CustomerLayout>
    );
}

export default CustomerRoutes;