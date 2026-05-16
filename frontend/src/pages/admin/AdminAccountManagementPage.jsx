import { useEffect, useState, useCallback } from "react";
import Table from "../../components/ui/Table";

import AdminAccountModal from "../../components/ui/AdminAccountModal";
import {
    fetchAdminAccounts,
    deleteAdminAccount,
} from "../../features/adminAccounts/adminAccountService";
import "./AdminAccountManagementPage.css";

const COLUMNS = ["STT", "Họ tên", "Email", "Ngày tạo", "Trạng thái", "Hành động"];

function AdminAccountManagementPage(){
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // filter / search / sort
    const [keyword, setKeyword] = useState("");
    const [isActive, setIsActive] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    // pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const SIZE = 5;

    // modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedAccount, setSelectedAccount] = useState(null);

    const currentEmail = JSON.parse(localStorage.getItem("user"))?.email;

    const loadAccounts = useCallback(async (overridePage = page) => {
        setLoading(true);

        try{
            const params = {
                page: overridePage,
                size: SIZE,
                sortField,
                sortDir,
            };
            if(keyword.trim()) params.keyword = keyword.trim();
            if(isActive !== "") params.isActive = isActive;

            const data = await fetchAdminAccounts(params);
            setAccounts(data.content);
            setTotalPages(data.totalPages);

        } catch {
            setError("Không thể tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    },[page, sortField, sortDir, keyword, isActive]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            
            loadAccounts(0);
        }, keyword ? 400 : 0);

        return () => clearTimeout(timeout);
        
    }, [page, sortField, sortDir, isActive, keyword, loadAccounts]);
    
    const handleSearch = () => {
        setPage(0)
        
    };

    const handleReset = () => {
        setKeyword("");
        setIsActive("");
        setSortField("createdAt");
        setSortDir("desc");
        setPage(0);
        
    };


    const handleOpenAdd = () => {
        setSelectedAccount(null);
        setModalMode("add");
        setModalOpen(true);
    };

    const handleOpenEdit = (account) => {
        setSelectedAccount(account);
        setModalMode("edit");
        setModalOpen(true);
    };

    const handleOpenPassword = (account) => {
        setSelectedAccount(account);
        setModalMode("password");
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xác nhận xóa tài khoản này?")) return;
        try {
            await deleteAdminAccount(id);
            await loadAccounts(); // load lại danh sách

        } catch (err){
            alert(err.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleModalSubmit = async () => {
        setModalOpen(false);
        await loadAccounts(); // load lại sau khi thêm/sửa/đổi mật khẩu
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    return (
        <div className="account-page">

            {/* Header */}
            <div className="account-page__header">
                <h2 className="account-page__title">Quản lý tài khoản Admin</h2>
                <button
                    className="btn-primary" 
                    onClick={handleOpenAdd}> 
                    + Thêm tài khoản
                </button>
            </div>

            {/* Filter bar */}
            <div className="account-page__filters">
                <div className="filter-group" style={{ minWidth: 220}}>
                    <label>Tìm kiếm</label>
                    <input 
                        type="text"
                        placeholder="Tên hoặc email...."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        
                    />
                </div>

                <div className="filter-group">
                    <label>Trạng thái</label>
                    <select 
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}>
                            <option value="">Tất cả</option>
                            <option value="true">Hoạt động</option>
                            <option value="false">Đã khóa</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Sắp xếp theo</label>
                    <select 
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}>
                            <option value="createdAt">Ngày tạo</option>
                            <option value="name">Họ tên</option>
                            
                    </select>
                </div>

                <div className="filter-group">
                    <label>Thứ tự</label>
                    <select 
                        value={sortDir}
                        onChange={(e) => setSortDir(e.target.value)}>
                            <option value="desc">Mới nhất / Z-A</option>
                            <option value="asc">Cũ nhất / A-Z</option>
                            
                    </select>
                </div>

                <div className="filter-actions">
                    <button className="btn-primary" onClick={handleSearch}>Tìm</button>
                    <button className="btn-outline" onClick={handleReset}>Đặt lại</button>
                </div>

            </div>

            {error && <p className="account-page__error">{error}</p>}
            {loading && <p className="account-page__loading">Đang tải...</p>}

            <div className="account-table-wrapper">
                <Table
                    columns={COLUMNS}
                    data={accounts}
                    renderRow={(acc, index) => (
                        <tr key={acc.userId}>
                            <td>{index + 1}</td>
                            <td>{acc.name}</td>
                            <td>{acc.email}</td>
                            <td>{formatDate(acc.createdAt)}</td>

                            <td>
                                <span className={`status-badge ${acc.isActive ? "status-badge--active" : "status-badge--inactive"}`}>
                                    {acc.isActive ? "Hoạt động" : "Đã khóa"}
                                </span>    
                            </td>
                            <td> <div className="action-group">
                                    <button
                                        className="btn-action btn-action--edit"
                                        onClick={() => handleOpenEdit(acc)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn-action btn-action--password"
                                        onClick={() => handleOpenPassword(acc)}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    <button
                                        className="btn-action btn-action--danger"
                                        onClick={() => handleDelete(acc.userId)}
                                        disabled={acc.email === currentEmail}
                                    >
                                        Vô hiệu hóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="account-page__pagination">
                    <button disabled={page <= 0} onClick={() => setPage(p => p - 1)}>Trang trước</button>
                    <span>Trang {page + 1} / {totalPages}</span>
                    <button disabled={page + 1 >= totalPages} onClick={() =>setPage(p => p + 1)}>Trang sau</button>
                </div>
            )}

            <AdminAccountModal
                open={modalOpen}
                mode={modalMode}
                account={selectedAccount}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );

}

export default AdminAccountManagementPage;