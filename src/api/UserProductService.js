// src/api/UserProductService.js
import axiosClient from "./axiosClient";

const UserProductService = {
    // Lấy danh sách sản phẩm
    getAllProducts: () => {
        return axiosClient.get('/products');
    },

    // Lấy danh sách danh mục
    getAllCategories: () => {
        return axiosClient.get('/categories');
    },

    // Xử lý thanh toán
    checkout: (payload) => {
        return axiosClient.post('/user/orders/checkout', payload);
    }
};

export default UserProductService;