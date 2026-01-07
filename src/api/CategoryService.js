import axiosClient from "./axiosClient";

const CategoryService = {
    // Lấy danh sách danh mục
    getAll: () => {
        return axiosClient.get('/categories');
    },

    // Thêm mới
    create: (data) => {
        return axiosClient.post('/admin/categories', data);
    },

    // Cập nhật
    update: (id, data) => {
        return axiosClient.put(`/admin/categories/${id}`, data);
    },

    // Xóa
    delete: (id) => {
        return axiosClient.delete(`/admin/categories/${id}`);
    }
};

export default CategoryService;