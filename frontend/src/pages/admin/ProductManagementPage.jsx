import { useEffect, useState } from "react";
import productApi from "../../api/productApi";

function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    categoryId: "",
    status: "ACTIVE",
  });

  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    const res = await productApi.getAdminProducts({
      page,
      size: 10,
      sortBy: "productId",
      direction: "asc",
    });

    setProducts(res.data.content || []);
    setTotalPages(res.data.totalPages || 0);
  };

  useEffect(() => {
    loadProducts();
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
      price: "",
      stock: "",
      description: "",
      image: "",
      categoryId: "",
      status: "ACTIVE",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
    };

    if (editingId) {
      await productApi.updateProduct(editingId, data);
      alert("Cập nhật sản phẩm thành công");
    } else {
      await productApi.createProduct(data);
      alert("Thêm sản phẩm thành công");
    }

    resetForm();
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.productId);

    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      image: product.image || "",
      categoryId: "",
      status: product.status || "ACTIVE",
    });

    alert("Nhập lại categoryId khi cập nhật sản phẩm");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    await productApi.deleteProduct(id);
    alert("Xóa sản phẩm thành công");
    loadProducts();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Quản lý sản phẩm</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <h3>{editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>

        <input name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Giá" value={form.price} onChange={handleChange} />
        <input name="stock" placeholder="Số lượng" value={form.stock} onChange={handleChange} />
        <input name="categoryId" placeholder="Category ID" value={form.categoryId} onChange={handleChange} />
        <input name="image" placeholder="Ảnh" value={form.image} onChange={handleChange} />
        <input name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
        {editingId && <button type="button" onClick={resetForm}>Hủy</button>}
      </form>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Kho</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.name}</td>
              <td>{Number(product.price).toLocaleString("vi-VN")} đ</td>
              <td>{product.stock}</td>
              <td>{product.categoryName}</td>
              <td>{product.status}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Sửa</button>
                <button onClick={() => handleDelete(product.productId)}>Xóa</button>
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

        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ProductManagementPage;