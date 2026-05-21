import { useEffect, useState } from "react";
import { categoryService } from "../../features/categories/categoryService";
import "./CategoryManagementPage.css";

function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("categoryId");
  const [direction, setDirection] = useState("asc");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

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
      alert(error.response?.data?.message || "Không thể tải danh sách danh mục");
    }
  };

  useEffect(() => {
    loadCategories({
      nextKeyword: keyword,
      nextPage: page,
      nextSortBy: sortBy,
      nextDirection: direction,
    });
  }, [page, sortBy, direction]);

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    if (!data.name) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, data);
        alert("Cập nhật danh mục thành công");
      } else {
        await categoryService.createCategory(data);
        alert("Thêm danh mục thành công");
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
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      await categoryService.deleteCategory(id);
      alert("Xóa danh mục thành công");

      await loadCategories({
        nextKeyword: keyword,
        nextPage: page,
        nextSortBy: sortBy,
        nextDirection: direction,
      });
    } catch (error) {
      console.error("Delete category error:", error);
      alert(error.response?.data?.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div className="category-management">
      <h2 className="category-management__title">Quản lý danh mục</h2>

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