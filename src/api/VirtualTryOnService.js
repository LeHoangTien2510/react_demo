import axiosClient from './axiosClient'; // Import file axiosClient bạn đã có

// Không cần khai báo API_URL vì axiosClient đã set baseURL là 'http://localhost:8080/api'

const getAllProducts = () => {
    // Gọi thẳng endpoint, axiosClient tự nối thêm /api và tự gắn Token
    return axiosClient.get('/products');
};

const generateTryOnImage = (productId, userImageFile) => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('userImage', userImageFile);

    return axiosClient.post('/virtual-try-on/generate', formData, {
        headers: {
            // Ghi đè header mặc định (application/json) thành multipart/form-data để gửi file
            'Content-Type': 'multipart/form-data'
        }
    });
};

const VirtualTryOnService = {
    getAllProducts,
    generateTryOnImage
};

export default VirtualTryOnService;