import { useEffect, useState, useCallback } from "react";
import Table from "../../components/ui/Table";

import AdminAccountModal from "../../components/ui/AdminAccountModal";
import {
    fetchAdminAccounts,
    deleteAdminAccount,
} from "../../features/adminAccounts/adminAccountService";
import "./AdminAccountManagementPage.css";
import Loading from "../../components/common/Loading";
import { formatDate } from "../../utils/formatDate";

const COLUMNS = ["STT", "Họ tên", "Email", "Ngày tạo", "Trạng thái", "Hành động"];
const SIZE = 10;

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
  

    // modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedAccount, setSelectedAccount] = useState(null);

    const currentEmail = JSON.parse(localStorage.getItem("user") || "null")?.email;

    /**
     * Tải danh sách tài khoản admin theo bộ lọc hiện tại.
     *
     * Hỗ trợ:
     * - phân trang
     * - tìm kiếm theo tên/email
     * - lọc trạng thái
     * - sắp xếp theo ngày tạo hoặc họ tên
     *
     * @param {number} overridePage Trang cần tải dữ liệu.
     */
    const loadAccounts = useCallback(async (overridePage = page) => {
        setLoading(true);
        setError("");

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
            setAccounts(data.content || []);
            setTotalPages(data.totalPages || 0);

        } catch (err) {
            setAccounts([]);
            setTotalPages(0);
            setError(err.response?.data?.message || "Không thể tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    },[sortField, sortDir, keyword, isActive, page]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadAccounts(page);
        }, keyword ? 400 : 0);

        return () => clearTimeout(timeout);
    }, [page, sortField, sortDir, isActive, keyword, loadAccounts]);
    
    /**
     * Đưa danh sách về trang đầu khi người dùng tìm kiếm.
     */
    const handleSearch = () => {
        setPage(0)
    };

    /**
     * Đặt lại toàn bộ bộ lọc về mặc định.
     */
    const handleReset = () => {
        setKeyword("");
        setIsActive("");
        setSortField("createdAt");
        setSortDir("desc");
        setPage(0);
    };

    /**
     * Mở modal tạo tài khoản admin mới.
     */
    const handleOpenAdd = () => {
        setSelectedAccount(null);
        setModalMode("add");
        setModalOpen(true);
    };

    /**
     * Mở modal chỉnh sửa thông tin tài khoản admin.
     *
     * @param {Object} account Tài khoản admin cần chỉnh sửa.
     */
    const handleOpenEdit = (account) => {
        setSelectedAccount(account);
        setModalMode("edit");
        setModalOpen(true);
    };

    /**
     * Mở modal đổi mật khẩu tài khoản admin.
     *
     * @param {Object} account Tài khoản admin cần đổi mật khẩu.
     */
    const handleOpenPassword = (account) => {
        setSelectedAccount(account);
        setModalMode("password");
        setModalOpen(true);
    };

    /**
     * Vô hiệu hóa tài khoản admin.
     *
     * Sau khi thao tác thành công, danh sách sẽ được tải lại
     * để đồng bộ giao diện với backend.
     *
     * @param {number} id ID tài khoản admin.
     */
    const handleDelete = async (id) => {
        if (!window.confirm("Xác nhận vô hiệu hóa tài khoản này?")) return;
        try {
            await deleteAdminAccount(id);
            await loadAccounts(page);
        } catch (err){
            alert(err.response?.data?.message || "Thao tác thất bại");
        }
    };

    /**
     * Xử lý sau khi thêm, sửa hoặc đổi mật khẩu admin thành công.
     *
     * Đóng modal và tải lại danh sách tài khoản.
     */
    const handleModalSubmit = async () => {
        setModalOpen(false);
        await loadAccounts(page); 
    };

    return (
        <div className="account-page">

            {/* Header */}
            <div className="account-page-header">
                <h2>Quản lý tài khoản Admin</h2>
                <button
                    type="button"
                    className="account-btn account-btn--primary" 
                    onClick={handleOpenAdd}> 
                    + Thêm tài khoản
                </button>
            </div>

            {/* Filter bar */}
            <div className="account-toolbar">
                <form
                    className="account-search-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <input 
                        className="account-search-input"
                        type="text"
                        placeholder="Tìm theo tên hoặc email..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(0);
                        }}
                    />

                    <button 
                    type="submit"
                    className="account-btn account-btn--primary">
                        Tìm
                    </button>

                    <button 
                        type="button"
                        className="account-btn account-btn--primary"
                        onClick={handleReset}>
                            Đặt lại
                    </button>
                </form>

                <div className="account-filter-sort">
                    
                    <select 
                        value={isActive}
                        onChange={(e) => {
                            setIsActive(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="true">Hoạt động</option>
                        <option value="false">Đã khóa</option>
                    </select>

                    <select 
                    value={sortField}
                    onChange={(e) => {
                    setSortField(e.target.value);
                    setPage(0);
                    }}
                    >
                        <option value="createdAt">Ngày tạo</option>
                        <option value="name">Họ tên</option>    
                    </select>
        
                    <select 
                        value={sortDir}
                        onChange={(e) => {
                            setSortDir(e.target.value)
                            setPage(0);
                        }}
                    >
                        <option value="desc">Mới nhất / Z-A</option>
                        <option value="asc">Cũ nhất / A-Z</option>
                    </select>
                </div>

            </div>

            <div className="account-table-card">
                {error && <p className="account-page__error">{error}</p>}

                {loading ? (
                    <div className="account-table-loading">
                        <Loading/>
                    </div>
                
                ) : (
            
                    <div className="account-table-scroll">
                        <Table
                            columns={COLUMNS}
                            data={accounts}
                            renderRow={(acc, index) => (
                                <tr key={acc.userId}>
                                    <td>{page * SIZE + index + 1}</td>
                                    <td>{acc.name}</td>
                                    <td>{acc.email}</td>
                                    <td>{formatDate(acc.createdAt)}</td>

                                    <td>
                                        <span className={`status-badge ${acc.isActive ? "status-badge--active" : "status-badge--inactive"}`}>
                                            {acc.isActive ? "Hoạt động" : "Đã khóa"}
                                        </span>    
                                    </td>
                                    <td> 
                                        <div className="action-group">
                                            <button
                                                type="button"
                                                className="btn-action btn-action--edit"
                                                onClick={() => handleOpenEdit(acc)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-action btn-action--password"
                                                onClick={() => handleOpenPassword(acc)}
                                            >
                                                Đổi mật khẩu
                                            </button>
                                            <button
                                                type="button"
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
                )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="account-page__pagination">
                    <button 
                        type="button"
                        disabled={page <= 0} 
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        Trang trước
                    </button>

                    <span>Trang {page + 1} / {totalPages}</span>

                    <button 
                        type="button"
                        disabled={page + 1 >= totalPages} 
                        onClick={() =>setPage((prev) => prev + 1)}
                    >
                        Trang sau
                    </button>
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