// File: src/App.jsx
import { Routes, Route } from "react-router-dom"; // Import công cụ định tuyến
import "./App.css";

// Import các trang của bạn
import Register from "./Register";
// Nếu bạn chưa có file Login, tạm thời mình sẽ tạo một trang Home giả định bên dưới

function App() {
    return (
        <>
            {/* Routes đóng vai trò như một cái Switch-Case */}
            <Routes>

                {/* 1. Trang chủ (Đường dẫn /) */}
                {/* Tạm thời hiển thị trang Login hoặc một dòng chữ */}
                <Route path="/" element={<h1>Đây là trang đăng nhập (Login)</h1>} />

                {/* 2. Trang Đăng ký (Đường dẫn /register) */}
                {/* Đây là chỗ quy định: Gõ /register thì hiện file Register.jsx */}
                <Route path="/register" element={<Register />} />

            </Routes>
        </>
    );
}

export default App;