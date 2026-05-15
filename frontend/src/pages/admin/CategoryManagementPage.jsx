import { useEffect, useState } from "react";
import categoryApi from "../../api/categoryApi";

function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAdminCategories({
        page,
        size: 10,
        sortBy: "categoryId",
        direction: "asc",
      });

      setCategories(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách danh mục");
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page]);

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
      name: form.name,
      description: form.description,
    };

    try {
      if (editingId) {
        await categoryApi.updateCategory(editingId, data);
        alert("Cập nhật danh mục thành công");
      } else {
        await categoryApi.createCategory(data);
        alert("Thêm danh mục thành công");
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.categoryId);

    setForm({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      await categoryApi.deleteCategory(id);
      alert("Xóa danh mục thành công");
      loadCategories();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Quản lý danh mục</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <h3>{editingId ? "Cập nhật danh mục" : "Thêm danh mục"}</h3>

        <input
          name="name"
          placeholder="Tên danh mục"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEdit(category)}>Sửa</button>
                <button onClick={() => handleDelete(category.categoryId)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
          Trang trước
        </button>

        <span style={{ margin: "0 12px" }}>
          Trang {page + 1} / {totalPages || 1}
        </span>

        <button
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