import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import CustomerManagementPage from "../pages/admin/CustomerManagementPage";
import ProtectedRoute from "./ProtectedRoute";

function AdminRoutes() {
    return (
    <ProtectedRoute>
        <AdminLayout>
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="customers" element={<CustomerManagementPage />} />
            
        </Routes>
        </AdminLayout>
    </ProtectedRoute>
    );
}

export default AdminRoutes;