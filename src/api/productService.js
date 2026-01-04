// src/api/productService.js
import axiosClient from './axiosClient';

// Base path riêng cho product (nối vào baseURL cũ)
// Kết quả: http://localhost:8080/api/admin/products
const PRODUCT_URL = '/admin/products';

// Hàm tiện ích lấy ảnh (không gọi API nên giữ nguyên ở đây hoặc tách ra file utils)
export const getImageUrl = (imageName) => {
    return imageName
        ? `http://localhost:8080/uploads/${imageName}`
        : 'https://via.placeholder.com/150';
};

// --- CÁC HÀM API ---

export const getAllProducts = () => {
    // Không cần truyền header, axiosClient tự làm
    return axiosClient.get(PRODUCT_URL);
};

export const deleteProduct = (id) => {
    return axiosClient.delete(`${PRODUCT_URL}/${id}`);
};

// Xử lý Multipart (Sửa/Thêm)
// Lưu ý: Axios thông minh, nếu thấy FormData nó sẽ tự bỏ Content-Type JSON
// và để trình duyệt tự set boundary cho file.
export const createProduct = (productData, imageFile) => {
    const formData = new FormData();

    // Đóng gói JSON vào Blob để Spring Boot @RequestPart hiểu
    const productBlob = new Blob([JSON.stringify(productData)], {
        type: 'application/json'
    });
    formData.append('product', productBlob);

    if (imageFile) {
        formData.append('imageFile', imageFile);
    }

    return axiosClient.post(PRODUCT_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateProduct = (id, productData, imageFile) => {
    const formData = new FormData();
    const productBlob = new Blob([JSON.stringify(productData)], { type: "application/json" });

    formData.append("product", productBlob);
    if (imageFile) formData.append("imageFile", imageFile);

    return axiosClient.put(`${PRODUCT_URL}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getAllCategories = () => {
    return axiosClient.get('/categories');
};