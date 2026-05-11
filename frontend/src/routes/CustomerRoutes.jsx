import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../components/layout/CustomerLayout";

import HomePage from "../pages/customer/HomePage";
import ProductListPage from "../pages/customer/ProductListPage";
import ProductDetailPage from "../pages/customer/ProductDetailPage";
import CartPage from "../pages/customer/CartPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import MyOrdersPage from "../pages/customer/MyOrdersPage";
import OrderDetailPage from "../pages/customer/OrderDetailPage";
import VnpayReturnPage from "../pages/customer/VnpayReturnPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ChangePasswordPage from "../pages/customer/ChangePasswordPage";


function CustomerRoutes() {
    return (
    <CustomerLayout>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/my-orders/:orderId" element={<OrderDetailPage />} />

            <Route path="/payments/vnpay-return" element={<VnpayReturnPage />} />

            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
        
        </Routes>
    </CustomerLayout>
    );
}

export default CustomerRoutes;