import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css"; // Đảm bảo bạn vẫn giữ file css này

export default function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Gọi API đăng nhập
        axios.post("http://localhost:8080/login", user)
            .then((res) => {
                console.log("🔍 Response từ Backend:", res.data);

                const token = res.data.token;

                if (token) {
                    // 1. Lưu Token (Để gọi API sau này)
                    localStorage.setItem('token', token);

                    // 2. 🔥 QUAN TRỌNG: Tạo object User từ phản hồi của Server
                    // (Dựa trên LoginResponse.java của bạn)
                    const userInfo = {
                        id: res.data.id,
                        username: res.data.username,
                        fullName: res.data.fullName,
                        roles: res.data.roles
                    };

                    // 3. Lưu thông tin User vào localStorage (đè lên dữ liệu cũ "elsu")
                    localStorage.setItem('user', JSON.stringify(userInfo));

                    alert(`✅ Xin chào ${userInfo.username}! Đăng nhập thành công.`);

                    // 4. Chuyển hướng sang trang quản lý
                    navigate("/admin/products");
                } else {
                    alert("⚠️ Lỗi: Server không trả về Token!");
                }
            })
            .catch((err) => {
                console.error("❌ Lỗi đăng nhập:", err);
                // Hiển thị lỗi từ backend nếu có (ví dụ: Sai mật khẩu)
                const errorMsg = err.response?.data || "Đăng nhập thất bại!";
                alert(errorMsg);
            });
    };

    return (
        <div className="user-details-container">
            <div className="user-details-card">
                <h1 className="user-details-title">➕ Đăng nhập</h1>

                <form onSubmit={handleSubmit}>
                    <div className="user-details-form-group">
                        <label className="user-details-label">UserName:</label>
                        <input
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            className="user-details-input"
                            required
                        />
                    </div>

                    <div className="user-details-form-group">
                        <label className="user-details-label">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className="user-details-input"
                            required
                        />
                    </div>

                    <div className="user-details-button-container">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="user-details-btn user-details-btn-secondary"
                        >
                            🔙 Quay lại
                        </button>

                        <button
                            type="submit"
                            className="user-details-btn user-details-btn-primary"
                        >
                            ✅ Đăng nhập
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="user-details-btn user-details-btn-secondary"
                            style={{ marginLeft: "10px" }}
                        >
                            📝 Đăng ký
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}