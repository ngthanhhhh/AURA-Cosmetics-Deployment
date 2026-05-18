import axiosClient from "../../api/axiosClient";

export const getAllCategoriesApi = (params) => {
  return axiosClient.get("/categories", { params });
};

export const getCategoryByIdApi = (id) => {
  return axiosClient.get(`/categories/${id}`);
};

export const getAdminCategoriesApi = (params) => {
  return axiosClient.get("/admin/categories", { params });
};

export const createCategoryApi = (data) => {
  return axiosClient.post("/admin/categories", data);
};

export const updateCategoryApi = (id, data) => {
  return axiosClient.put(`/admin/categories/${id}`, data);
};

export const deleteCategoryApi = (id) => {
  return axiosClient.delete(`/admin/categories/${id}`);
};