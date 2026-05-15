import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import ProductManagementPage from "../pages/admin/ProductManagementPage";
import CategoryManagementPage from "../pages/admin/CategoryManagementPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import DashboardPage from "../pages/admin/DashboardPage";
import CustomerManagementPage from "../pages/admin/CustomerManagementPage";

import OrderManagementPage from "../pages/admin/OrderManagementPage";
import OrderDetailManagementPage from "../pages/admin/OrderDetailManagementPage";
import ReviewManagementPage from "../pages/admin/ReviewManagementPage";
import ReviewReportPage from "../pages/admin/ReviewReportPage";

function ProtectedAdminPage({ children }) {
  return (
    <ProtectedRoute requiredRole="ROLE_ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />

      <Route
        path=""
        element={
          <ProtectedAdminPage>
            <DashboardPage />
          </ProtectedAdminPage>
        }
      />

      <Route
        path="products"
        element={
          <ProtectedAdminPage>
            <ProductManagementPage />
          </ProtectedAdminPage>
        }
      />

      <Route
        path="categories"
        element={
          <ProtectedAdminPage>
            <CategoryManagementPage />
          </ProtectedAdminPage>
        }
      />

      <Route
        path="customers"
        element={
          <ProtectedAdminPage>
            <CustomerManagementPage />
          </ProtectedAdminPage>
        }
      />

      <Route
        path="orders"
        element={
          <ProtectedAdminPage>
            <OrderManagementPage />
          </ProtectedAdminPage>
        }
      />

      <Route
        path="orders/:orderId"
        element={
          <ProtectedAdminPage>
            <OrderDetailManagementPage />
          </ProtectedAdminPage>
        }
      />

      <Route
        path="reviews"
        element={
          <ProtectedAdminPage>
            <ReviewManagementPage />
          </ProtectedAdminPage>
        }
      />

      <Route
        path="reviews/report"
        element={
          <ProtectedAdminPage>
            <ReviewReportPage />
          </ProtectedAdminPage>
        }
      />
    </Routes>
  );
}

export default AdminRoutes;