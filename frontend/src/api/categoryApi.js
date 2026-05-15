import axiosClient from "./axiosClient";

const categoryApi = {
  getAllCategories(params) {
    return axiosClient.get("/categories", { params });
  },

  getCategoryById(id) {
    return axiosClient.get(`/categories/${id}`);
  },

  getAdminCategories(params) {
    return axiosClient.get("/admin/categories", { params });
  },

  createCategory(data) {
    return axiosClient.post("/admin/categories", data);
  },

  updateCategory(id, data) {
    return axiosClient.put(`/admin/categories/${id}`, data);
  },

  deleteCategory(id) {
    return axiosClient.delete(`/admin/categories/${id}`);
  },
};

export default categoryApi;