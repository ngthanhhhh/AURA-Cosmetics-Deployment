import { Routes, Route } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import AdminRoutes from "./AdminRoutes";

function AppRoutes() {
    return (
        <Routes>
            {/* Tuyến đường dành cho Khách hàng: Luôn có dấu /* để các file con chạy được */}
            <Route path="/*" element={<CustomerRoutes />} />

            {/* Tuyến đường dành cho Admin: Tách biệt hoàn toàn */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
        </Routes>
    );
}

export default AppRoutes;