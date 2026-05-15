import axiosClient from "./axiosClient";

const productApi = {
  getAllProducts(params) {
    return axiosClient.get("/products", { params });
  },

  getProductById(id) {
    return axiosClient.get(`/products/${id}`);
  },

  getAdminProducts(params) {
    return axiosClient.get("/admin/products", { params });
  },

  createProduct(data) {
    return axiosClient.post("/admin/products", data);
  },

  updateProduct(id, data) {
    return axiosClient.put(`/admin/products/${id}`, data);
  },

  deleteProduct(id) {
    return axiosClient.delete(`/admin/products/${id}`);
  },
};

export default productApi;