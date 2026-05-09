import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import { fetchCustomers, updateCustomersStatus } from "../../features/users/userService";

const SORT_OPTIONS = [
    { label: "Mới nhất", value: "createdAt, desc"},
    { label: "Cũ nhất", value: "createdAt, asc"},
    { label: "Tên A-Z", value: "name, asc"},
    { label: "Tên Z-A", value: "name, desc"},
];


function CustomerManagementPage() {

    const navigate = useNavigate();

    //State
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isActive, setIsActive] = useState("");
    const [sort, setSort] = useState("createdAt, desc");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const PAGE_SIZE = 10;

    //Fetch danh sách khách hàng
    const loadCustomers = async () => {
        setLoading(true);
        try{
            const params = {
                page,
                size: PAGE_SIZE,
                sort,
                ...(keyword && { keyword }),
                ...(isActive !== "" && { isActive : isActive === "true"}),
            };
            const data = await fetchCustomers(params);
            setCustomers(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

        } catch (err){
            console.error("Lỗi tải danh sách khách hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort, keyword, isActive]);

    // Tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        setKeyword(searchInput.trim());
    };

    // Mở/khóa tài khoản
    const handleToggleStatus = async (id, currentStatus) => {
        const action = currentStatus ? "khóa" : "mở khóa";
        if(!window.confirm(`Bạn có chắc muốn ${action} tài khoản này`)) return;
        try{
            await updateCustomersStatus(id, !currentStatus);
            loadCustomers();
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            alert("Cập nhật thất bại, vui lòng thử lại!");
        }
    };

    const columns = ["STT", "Họ tên", "Email", "SĐT", "Ngày đăng ký", "Trạng thái", "Thao tác"];

    const renderRow = (customer, index) => (
        <tr key={customer.id}>
            <td>{page * PAGE_SIZE + index + 1}</td>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.phone || "-"}</td>
            <td>{new Date(customer.createdAt).toLocaleDateString("vi-VN")}</td>
            <td>

                <span className={`badge ${customer.isActive ? "badge-active" : "badge-inactive"}`}>
                    {customer.isActive ? "Hoạt động" : "Đã khóa"}
                </span>
            </td>

            <td className="action-cell">
                <button 
                    className="btn-detail"
                    onClick={() =>
                        navigate(`/admin/customers/${customer.id}`)
                    }>
                        Chi tiết
                    </button>

                    <button
                        className={customer.isActive ? "btn-lock" : "btn-unlock"}
                        onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                    >
                        {customer.isActive ? "Khóa" : "Mở khóa"}
                    </button>
            </td>
        </tr>
    );

    return(
        <div className="customer-management">
            <h2 className="page-title">Quản lý khách hàng</h2>

            {/* Thanh tìm kiếm + lọc + sắp xếp */}

            <div className="toolbar">
                <form 
                    className="search-form"
                    onSubmit={handleSearch}>

                        <input
                            className="search-input" 
                            type="text"
                            placeholder="Tìm theo tên hoặc email"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="btn-search" 
                        >Tìm</button>

                        {keyword && (
                            <button 
                                type="button"
                                className="btn-clear"
                                onClick={() =>{ setSearchInput(""); setKeyword(""); setPage(0)}}
                            >Xóa</button>
                        )}
                        
                </form> 

                <div className="filter-sort">
                    {/* Lọc trạng thái */}
                    <select 
                        value={isActive}
                        onChange={(e) => {
                            setIsActive(e.target.value); setPage(0);
                        }}
                        className="select-filter"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Hoạt động</option>
                        <option value="false">Đã khóa</option>
                    </select>

                    {/* Sắp xếp */}
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value); setPage(0);
                        }}
                        className="select-sort"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value= {opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tổng số */}
            <p className="total-info">Tổng: <strong>{totalElements}</strong>khách hàng</p>

            {/* Bảng */}
            {loading ? (
                <p 
                    className="loading-text">Đang tải...</p>
            ) : (
                <Table
                    columns={columns}
                    data={customers}
                    renderRow={renderRow}
                />
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
                <div 
                    className="pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="btn-page"
                        >
                            Trước
                        </button>
                        {Array.from(
                            {length : totalPages }, 
                            (_, i) => (
                                <button
                                    key={i}
                                    onClick={()=> setPage(i)}
                                    className={`btn-page ${page === i ? "active" : ""}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                    <button 
                        disabled={page === totalPages - 1}
                        onClick={() => setPage(page + 1)}
                        className="btn-page"
                    >Tiếp</button>
                </div>
            )}
        </div>
    );
}

export default CustomerManagementPage;