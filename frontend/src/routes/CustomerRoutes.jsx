import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../components/layout/CustomerLayout";
import HomePage from "../pages/customer/HomePage";
import ProductListPage from "../pages/customer/ProductListPage";
import RegisterPage from "../pages/auth/RegisterPage";

function CustomerRoutes() {
    return (
    <CustomerLayout>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        
        <Route path="auth/register" element={<RegisterPage />} />
        </Routes>
    </CustomerLayout>
    );
}

export default CustomerRoutes;