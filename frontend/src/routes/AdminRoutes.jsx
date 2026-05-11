import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

import OrderManagementPage from "../pages/admin/OrderManagementPage";
import OrderDetailManagementPage from "../pages/admin/OrderDetailManagementPage";
import ReviewManagementPage from "../pages/admin/ReviewManagementPage";
import ReviewReportPage from "../pages/admin/ReviewReportPage";
import CustomerManagementPage from "../pages/admin/CustomerManagementPage";
function AdminRoutes() {
    return (
    <ProtectedRoute>
        <AdminLayout>
        <Routes>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/customers" element={<CustomerManagementPage />} />

            <Route path="/orders" element={<OrderManagementPage/>} />
            <Route path="/orders/:orderId" element={<OrderDetailManagementPage />} />

            <Route path="/reviews" element={<ReviewManagementPage />} />
            <Route path="/reviews/report" element={<ReviewReportPage />} />
        </Routes>
        </AdminLayout>
    </ProtectedRoute>
    );
}

export default AdminRoutes;