import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import { fetchCustomers, updateCustomersStatus } from "../../features/users/userService";
import Loading from "../../components/common/Loading";
import "./CustomerManagementPage.css";
import { formatDate } from "../../utils/formatDate";

import { notify } from "../../utils/notify";
import { confirmAction } from "../../utils/confirm";

const SORT_OPTIONS = [
    { label: "Mới nhất", value: "createdAt,desc"},
    { label: "Cũ nhất", value: "createdAt,asc"},
    { label: "Tên A-Z", value: "name,asc"},
    { label: "Tên Z-A", value: "name,desc"},
];
const PAGE_SIZE = 10;


function CustomerManagementPage() {

    const navigate = useNavigate();

    //State
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isActive, setIsActive] = useState("");
    const [sort, setSort] = useState("createdAt,desc");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");

    /**
     * Tạo query params gửi tới API khách hàng.
     *
     * Bao gồm:
     * - phân trang
     * - tìm kiếm
     * - lọc trạng thái
     * - sắp xếp
     *
     * @returns {Object} Query params cho API.
     */
    const buildParams = () => {
        const params = {
            page,
            size: PAGE_SIZE,
            sort,
        };

        if(keyword.trim()){
            params.keyword = keyword.trim();
        }

        if(isActive !== ""){
            params.isActive = isActive;
        }

        return params;
    };

    /**
     * Tải danh sách khách hàng từ backend.
     */
    const loadCustomers = async () => {
        setLoading(true);
        setError("");

        try{
            const params = buildParams();
            
            const data = await fetchCustomers(params);

            setCustomers(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);

        } catch (err){
            setError(err.response?.data?.message || "Không thể tải danh sách khách hàng");
            setCustomers([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort, keyword, isActive]);

    /**
     * Xử lý tìm kiếm khách hàng theo tên hoặc email.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Sự kiện submit form.
     */
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        setKeyword(searchInput.trim());
    };

    /**
     * Xóa từ khóa tìm kiếm và tải lại danh sách khách hàng.
     */
    const handleClearSearch = () => {
        setSearchInput("");
        setKeyword("");
        setPage(0);
    };

    /**
     * Khóa hoặc mở khóa tài khoản khách hàng.
     *
     * Sau khi cập nhật thành công, danh sách sẽ được tải lại
     * để đồng bộ dữ liệu với backend.
     *
     * @param {number} id ID khách hàng.
     * @param {boolean} currentStatus Trạng thái hiện tại.
     */
    const handleToggleStatus = async (id, currentStatus) => {
        
        if(!id){
            notify.error("Không xác định được khách hàng");
            return;
        }
        
        const action = currentStatus ? "khóa" : "mở khóa";

        const ok = await confirmAction(
            `${action === "khóa" ? "Khóa" : "Mở khóa"} tài khoản`,
            `Bạn có chắc muốn ${action} tài khoản này không?`
        );

        if (!ok) return;

        
        try{
            await updateCustomersStatus(id, !currentStatus);
            await loadCustomers();
        } catch {
            notify.error("Cập nhật trạng thái thất bại, vui lòng thử lại!");
        }
    };

    const columns = [
        "STT", 
        "Họ tên", 
        "Email", 
        "SĐT", 
        "Ngày đăng ký", 
        "Trạng thái", 
        "Thao tác"];

    const renderRow = (customer, index) => (
        <tr key={customer.id}>
            <td>{page * PAGE_SIZE + index + 1}</td>
            <td>{customer.name || "-"}</td>
            <td>{customer.email || "-"}</td>
            <td>{customer.phone || "-"}</td>
            <td>{formatDate(customer.createdAt)}</td>

            <td>

                <span className={`customer-badge ${
                    customer.isActive 
                    ? "customer-badge--active" 
                    : "customer-badge--inactive"
                }`}>
                    {customer.isActive ? "Hoạt động" : "Đã khóa"}
                </span>
            </td>
            <td>
                <div className="customer-actions">
                <button 
                    type="button"
                    className="customer-btn customer-btn--detail"
                    onClick={() => {
                        
                        if(!customer.id){
                            notify.error("Không xác định được khách hàng");
                            return;
                        }

                        navigate(`/admin/customers/${customer.id}`);
                    }}
                >
                    Chi tiết
                </button>

                    <button
                        type="button"
                        className={`customer-btn ${
                            customer.isActive 
                                ? "customer-btn--lock" 
                                : "customer-btn--unlock"}`}
                        onClick={() => 
                            handleToggleStatus(
                                customer.id, 
                                customer.isActive)}
                    >
                        {customer.isActive ? "Khóa" : "Mở khóa"}
                    </button>
                 </div>
            </td>
        </tr>
    );

    return(
        <div className="customer-management">
            <div className="customer-page-header">
                <div>
                    <h2>Quản lý khách hàng</h2>
                    <p>Theo dõi, tìm kiếm và cập nhật trạng thái khách hàng</p>
                </div>
            </div>
    

            {/* Thanh tìm kiếm + lọc + sắp xếp */}

            <div className="customer-toolbar">
                <form 
                    className="customer-search-form"
                    onSubmit={handleSearch}>

                        <input
                            className="customer-search-input" 
                            type="text"
                            placeholder="Tìm theo tên hoặc email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="customer-btn customer-btn--primary" 
                        >Tìm</button>

                        {keyword && (
                            <button 
                                type="button"
                                className="customer-btn customer-btn--secondary"
                                onClick={handleClearSearch}
                            >Xóa</button>
                        )}
                        
                </form> 

                <div className="customer-filter-sort">
                    {/* Lọc trạng thái */}
                    <select 
                        value={isActive}
                        onChange={(e) => {
                            setIsActive(e.target.value); setPage(0);
                        }}
                    
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
                        
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value= {opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="customer-table-card">
                <div className="customer-table-header">
                    {/* Tổng số */}
                    <p className="total-info">
                        Tổng: <strong>{totalElements}</strong> khách hàng
                    </p>
                </div>

                {/* Bảng */}
                {loading ? (
                    <div className="customer-table-loading">
                        <Loading/>
                    </div>

                ) : error ? (
                    <p className="customer-empty">{error}</p>
                
                ) : customers.length === 0 ? (
                        <p className="customer-empty">Không có khách hàng phù hợp</p>  

                ) : (
                    <div className="customer-table-scroll">
                        <Table
                            columns={columns}
                            data={customers}
                            renderRow={renderRow}
                        />
                    </div>
                    
                )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="customer-pagination">
                    <button
                        type="button"
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        
                    >
                        Trước
                    </button>
                    {Array.from({length : totalPages }, (_, i) => (
                        <button
                            type="button"
                            key={i}
                            onClick={()=> setPage(i)}
                            className={`btn-page ${page === i ? "active" : ""}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        type="button"
                        disabled={page === totalPages - 1}
                        onClick={() => setPage(page + 1)}
                        className="btn-page"
                    >Tiếp
                    </button>
                </div>
            )}
        </div>
    );
}

export default CustomerManagementPage;