import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../components/layout/CustomerLayout";
import HomePage from "../pages/customer/HomePage";
import ProductListPage from "../pages/customer/ProductListPage";
import RegisterPage from "../pages/auth/RegisterPage";

function CustomerRoutes() {
    return (
        <Routes>
            {/* Cấp 1: Layout chung cho khách hàng (Chứa Header và Footer) */}
            <Route element={<CustomerLayout />}>

                {/* Cấp 2: Các trang con sẽ hiển thị tại vị trí <Outlet /> của Layout */}
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/products" element={<ProductListPage />} /> */}

                

                {/* Trang đăng ký */}
                <Route path="auth/register" element={<RegisterPage />} />
            </Route>
        </Routes>
    );
}

export default CustomerRoutes;