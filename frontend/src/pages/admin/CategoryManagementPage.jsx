import { useEffect, useState } from "react";
import { categoryService } from "../../features/categories/categoryService";
import "./CategoryManagementPage.css";

import { notify } from "../../utils/notify";
import { confirmDelete } from "../../utils/confirm";

/* =========================================================
   CATEGORY MANAGEMENT PAGE
   ---------------------------------------------------------
   Trang quản lý danh mục dành cho quản trị viên.

   Chức năng chính:
   - Hiển thị danh sách danh mục.
   - Tìm kiếm danh mục theo tên.
   - Sắp xếp danh mục theo ID hoặc tên.
   - Phân trang danh sách danh mục.
   - Thêm mới danh mục.
   - Cập nhật danh mục.
   - Xóa danh mục.
========================================================= */
function CategoryManagementPage() {
  /* =========================================================
     STATE LƯU DANH SÁCH DANH MỤC
     ---------------------------------------------------------
     categories chứa dữ liệu danh mục nhận từ backend.
  ========================================================= */
  const [categories, setCategories] = useState([]);

  /* =========================================================
     STATE PHÂN TRANG
     ---------------------------------------------------------
     page       : trang hiện tại.
     totalPages : tổng số trang trả về từ backend.
  ========================================================= */
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* =========================================================
     STATE TÌM KIẾM VÀ SẮP XẾP
     ---------------------------------------------------------
     keyword   : từ khóa tìm kiếm theo tên danh mục.
     sortBy    : trường dùng để sắp xếp.
     direction : hướng sắp xếp tăng dần hoặc giảm dần.
  ========================================================= */
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("categoryId");
  const [direction, setDirection] = useState("asc");

  /* =========================================================
     STATE FORM THÊM / CẬP NHẬT DANH MỤC
     ---------------------------------------------------------
     form lưu dữ liệu người dùng nhập vào form.
  ========================================================= */
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* =========================================================
     STATE XÁC ĐỊNH CHẾ ĐỘ FORM
     ---------------------------------------------------------
     editingId = null  : đang ở chế độ thêm mới.
     editingId != null : đang ở chế độ cập nhật danh mục.
  ========================================================= */
  const [editingId, setEditingId] = useState(null);

  /* =========================================================
     HÀM TẢI DANH SÁCH DANH MỤC
     ---------------------------------------------------------
     Gọi API lấy danh sách danh mục từ backend.

     Hỗ trợ:
     - Tìm kiếm theo keyword.
     - Phân trang.
     - Sắp xếp theo sortBy và direction.

     Các tham số next... giúp gọi lại hàm với giá trị mới
     mà không phụ thuộc hoàn toàn vào state hiện tại.
  ========================================================= */
  const loadCategories = async ({
    nextKeyword = keyword,
    nextPage = page,
    nextSortBy = sortBy,
    nextDirection = direction,
  } = {}) => {
    try {
      const data = await categoryService.getAdminCategories({
        keyword: nextKeyword.trim() || undefined,
        page: nextPage,
        size: 10,
        sortBy: nextSortBy,
        direction: nextDirection,
      });

      setCategories(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Load categories error:", error);
      notify.error(error.response?.data?.message || "Không thể tải danh sách danh mục");
    }
  };

  /* =========================================================
     EFFECT TỰ ĐỘNG LOAD DANH MỤC
     ---------------------------------------------------------
     Khi page, sortBy hoặc direction thay đổi, hệ thống tự
     gọi lại API để cập nhật danh sách danh mục.
  ========================================================= */
  useEffect(() => {
    loadCategories({
      nextKeyword: keyword,
      nextPage: page,
      nextSortBy: sortBy,
      nextDirection: direction,
    });
  }, [page, sortBy, direction]);

  /* =========================================================
     XỬ LÝ SUBMIT BỘ LỌC
     ---------------------------------------------------------
     Khi quản trị viên nhấn nút "Áp dụng":
     - Không reload trang.
     - Đưa về trang đầu tiên.
     - Gọi API với keyword và tiêu chí sắp xếp hiện tại.
  ========================================================= */
  const handleFilterSubmit = async (e) => {
    e.preventDefault();

    setPage(0);

    await loadCategories({
      nextKeyword: keyword,
      nextPage: 0,
      nextSortBy: sortBy,
      nextDirection: direction,
    });
  };

  /* =========================================================
     RESET BỘ LỌC
     ---------------------------------------------------------
     Đưa các tiêu chí lọc và sắp xếp về mặc định,
     sau đó tải lại danh sách danh mục từ trang đầu tiên.
  ========================================================= */
  const handleResetFilter = async () => {
    setKeyword("");
    setSortBy("categoryId");
    setDirection("asc");
    setPage(0);

    await loadCategories({
      nextKeyword: "",
      nextPage: 0,
      nextSortBy: "categoryId",
      nextDirection: "asc",
    });
  };

  /* =========================================================
     XỬ LÝ THAY ĐỔI DỮ LIỆU FORM
     ---------------------------------------------------------
     Cập nhật state form dựa trên name của input.
     Dùng chung cho cả ô tên danh mục và mô tả.
  ========================================================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================================================
     RESET FORM
     ---------------------------------------------------------
     Xóa dữ liệu đang nhập và thoát khỏi chế độ chỉnh sửa.
  ========================================================= */
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });

    setEditingId(null);
  };

  /* =========================================================
     XỬ LÝ THÊM MỚI / CẬP NHẬT DANH MỤC
     ---------------------------------------------------------
     Nếu editingId có giá trị:
     - Gọi API cập nhật danh mục.

     Nếu editingId là null:
     - Gọi API thêm mới danh mục.
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    if (!data.name) {
      notify.error("Tên danh mục không được để trống");
      return;
    }

    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, data);
        notify.success("Cập nhật danh mục thành công");
      } else {
        await categoryService.createCategory(data);
        notify.success("Thêm danh mục thành công");
      }

      resetForm();

      await loadCategories({
        nextKeyword: keyword,
        nextPage: page,
        nextSortBy: sortBy,
        nextDirection: direction,
      });
    } catch (error) {
      console.error("Save category error:", error);
      notify.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  /* =========================================================
     CHỌN DANH MỤC ĐỂ CHỈNH SỬA
     ---------------------------------------------------------
     Khi nhấn nút "Sửa":
     - Lưu ID danh mục đang sửa.
     - Đổ dữ liệu danh mục lên form.
     - Cuộn lên đầu trang để dễ thao tác.
  ========================================================= */
  const handleEdit = (category) => {
    setEditingId(category.categoryId);

    setForm({
      name: category.name || "",
      description: category.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     XÓA DANH MỤC
     ---------------------------------------------------------
     Trước khi xóa, hệ thống hiển thị hộp thoại xác nhận.
     Nếu backend không cho xóa do danh mục còn sản phẩm,
     thông báo lỗi từ backend sẽ được hiển thị.
  ========================================================= */
  const handleDelete = async (id) => {
    const ok = await confirmDelete(
      "Xóa danh mục",
      "Bạn có chắc muốn xóa danh mục này?"
    );

    if (!ok) return;

    try {
      await categoryService.deleteCategory(id);
      notify.success("Xóa danh mục thành công");

      await loadCategories({
        nextKeyword: keyword,
        nextPage: page,
        nextSortBy: sortBy,
        nextDirection: direction,
      });
    } catch (error) {
      console.error("Delete category error:", error);
      notify.error(error.response?.data?.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div className="category-management">
      {/* =====================================================
          TIÊU ĐỀ TRANG QUẢN LÝ DANH MỤC
      ===================================================== */}
      <h2 className="category-management__title">Quản lý danh mục</h2>

      {/* =====================================================
          FORM TÌM KIẾM, LỌC VÀ SẮP XẾP DANH MỤC
      ===================================================== */}
      <form className="category-management__filter" onSubmit={handleFilterSubmit}>
        <h3 className="category-management__filter-title">
          Lọc / tìm kiếm danh mục
        </h3>

        <div className="category-management__filter-row">
          <input
            className="category-management__input"
            placeholder="Tìm theo tên danh mục"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <select
            className="category-management__input"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(0);
            }}
          >
            <option value="categoryId">Sắp xếp theo ID</option>
            <option value="name">Sắp xếp theo tên</option>
          </select>

          <select
            className="category-management__input"
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value);
              setPage(0);
            }}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>

          <button className="category-management__btn" type="submit">
            Áp dụng
          </button>

          <button
            className="category-management__btn category-management__btn--secondary"
            type="button"
            onClick={handleResetFilter}
          >
            Reset
          </button>
        </div>
      </form>

      {/* =====================================================
          FORM THÊM MỚI / CẬP NHẬT DANH MỤC
      ===================================================== */}
      <form className="category-management__form" onSubmit={handleSubmit}>
        <h3 className="category-management__form-title">
          {editingId ? "Cập nhật danh mục" : "Thêm danh mục"}
        </h3>

        <div className="category-management__form-row">
          <input
            className="category-management__input"
            name="name"
            placeholder="Tên danh mục"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="category-management__input"
            name="description"
            placeholder="Mô tả"
            value={form.description}
            onChange={handleChange}
          />

          <button className="category-management__btn" type="submit">
            {editingId ? "Cập nhật" : "Thêm"}
          </button>

          {editingId && (
            <button
              className="category-management__btn category-management__btn--secondary"
              type="button"
              onClick={resetForm}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* =====================================================
          BẢNG HIỂN THỊ DANH SÁCH DANH MỤC
      ===================================================== */}
      <table className="category-management__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Không có danh mục phù hợp
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button
                    className="category-management__action-btn"
                    onClick={() => handleEdit(category)}
                  >
                    Sửa
                  </button>

                  <button
                    className="category-management__action-btn category-management__action-btn--danger"
                    onClick={() => handleDelete(category.categoryId)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* =====================================================
          KHU VỰC PHÂN TRANG DANH MỤC
      ===================================================== */}
      <div className="category-management__pagination">
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => setPage(page - 1)}
        >
          Trang trước
        </button>

        <span>
          Trang {page + 1} / {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default CategoryManagementPage;