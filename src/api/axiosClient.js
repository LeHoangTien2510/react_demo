import axios from 'axios';

// Cấu hình cơ bản
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api', // URL gốc chung
    headers: {
        'Content-Type': 'application/json', // Mặc định là JSON
    },
});

// --- INTERCEPTOR REQUEST ---
// (Chạy trước khi request được gửi đi)
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Tự động gắn token vào header nếu có
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- INTERCEPTOR RESPONSE (Tùy chọn) ---
// (Chạy sau khi nhận response, trước khi về component)
axiosClient.interceptors.response.use(
    (response) => {
        // Có thể trả về response.data luôn để đỡ phải gọi .data ở component
        return response;
    },
    (error) => {
        // Xử lý lỗi chung (VD: Token hết hạn 401 -> đá về login)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;