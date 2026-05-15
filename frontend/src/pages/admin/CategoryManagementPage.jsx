import { useEffect, useState } from "react";
import categoryApi from "../../features/categories/categoryApi";

function CategoryManagementPage() {
  // danh sách category
  const [categories, setCategories] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  // form thêm category
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  // load danh sách category
  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await categoryApi.getAllCategories({
        page: 0,
        size: 20,
      });

      // backend trả về Page<>
      setCategories(data.content || []);
    } catch (error) {
      console.error("Load categories error:", error);
      alert("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // thêm category
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await categoryApi.createCategory(newCategory);

      alert("Thêm danh mục thành công");

      // reset form
      setNewCategory({
        name: "",
        description: "",
      });

      loadCategories();
    } catch (error) {
      console.error("Create category error:", error);

      alert("Không thể thêm danh mục");
    }
  };

  // xóa category
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa danh mục này?"
    );

    if (!confirmDelete) return;

    try {
      await categoryApi.deleteCategory(id);

      alert("Xóa danh mục thành công");

      loadCategories();
    } catch (error) {
      console.error("Delete category error:", error);

      alert("Không thể xóa danh mục");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Quản lý danh mục</h1>

      {/* FORM THÊM CATEGORY */}
      <form
        onSubmit={handleCreate}
        style={{
          marginTop: "24px",
          marginBottom: "32px",
        }}
      >
        <h2>Thêm danh mục</h2>

        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Tên danh mục"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({
                ...newCategory,
                name: e.target.value,
              })
            }
            required
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <textarea
            placeholder="Mô tả"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({
                ...newCategory,
                description: e.target.value,
              })
            }
            rows={4}
          />
        </div>

        <button type="submit">Thêm danh mục</button>
      </form>

      {/* DANH SÁCH CATEGORY */}
      <h2>Danh sách danh mục</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : categories.length === 0 ? (
        <p>Không có danh mục nào</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
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
                  <button
                    onClick={() =>
                      handleDelete(category.categoryId)
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CategoryManagementPage;