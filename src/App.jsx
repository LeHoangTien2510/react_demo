// File: src/App.jsx
import { Routes, Route } from "react-router-dom"; // Import công cụ định tuyến
import "./App.css";

// Import các trang của bạn
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import ProductManager from "./components/admin/ProductManagement.jsx";
import UserProfile from "./components/UserProfile.jsx";
import UserManagement from "./components/admin/UserManagement.jsx";
import ShoppingPage from "./components/user/ShoppingPage.jsx";
import CategoryManagement from './components/admin/CategoryManagement';
import AdminLayout from './layouts/AdminLayout';
import OrderManagement from './components/admin/OrderManagement';

// Nếu bạn chưa có file Login, tạm thời mình sẽ tạo một trang Home giả định bên dưới

function App() {
    return (
        <>
            {/* Routes đóng vai trò như một cái Switch-Case */}
            <Routes>

                {/* 1. Trang chủ (Đường dẫn /) */}
                {/* Tạm thời hiển thị trang Login hoặc một dòng chữ */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin/products" element={<ProductManager />} />
                {/* 2. Trang Đăng ký (Đường dẫn /register) */}
                {/* Đây là chỗ quy định: Gõ /register thì hiện file Register.jsx */}
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/user/shopping" element={<ShoppingPage />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
            </Routes>
        </>
    );
}

export default App;