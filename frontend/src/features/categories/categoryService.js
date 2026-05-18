import {
  getAllCategoriesApi,
  getCategoryByIdApi,
  getAdminCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "./categoryApi";

export const categoryService = {
  async getAllCategories(params) {
    const res = await getAllCategoriesApi(params);
    return res.data;
  },

  async getCategoryById(id) {
    const res = await getCategoryByIdApi(id);
    return res.data;
  },

  async getAdminCategories(params) {
    const res = await getAdminCategoriesApi(params);
    return res.data;
  },

  async createCategory(data) {
    const res = await createCategoryApi(data);
    return res.data;
  },

  async updateCategory(id, data) {
    const res = await updateCategoryApi(id, data);
    return res.data;
  },

  async deleteCategory(id) {
    const res = await deleteCategoryApi(id);
    return res.data;
  },
};