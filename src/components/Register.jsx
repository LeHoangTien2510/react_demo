import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();

    // State khớp với RegisterRequest bên Backend
    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        fullName: "",
        phone: "",
        address: "",
        email: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi API đăng ký
        axios.post("http://localhost:8080/register", registerData)
            .then((res) => {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/login"); // Chuyển sang trang login thay vì trang chủ
            })
            .catch((err) => {
                console.error("Lỗi:", err);
                // Có thể hiển thị lỗi chi tiết từ backend nếu cần
                alert("Đăng ký thất bại. Có thể username đã tồn tại.");
            });
    };

    return (
        <div className="user-details-container">
            <div className="user-details-card">
                <h1 className="user-details-title">➕ Đăng ký tài khoản</h1>

                <form onSubmit={handleSubmit}>
                    {/* 1. Username (Bắt buộc) */}
                    <div className="user-details-form-group">
                        <label className="user-details-label">Tên đăng nhập (*):</label>
                        <input
                            name="username"
                            value={registerData.username} // SỬA: dùng registerData
                            onChange={handleChange}
                            className="user-details-input"
                            required // HTML5 validation
                        />
                    </div>

                    {/* 2. Password (Bắt buộc) */}
                    <div className="user-details-form-group">
                        <label className="user-details-label">Mật khẩu (*):</label>
                        <input
                            type="password" // SỬA: ẩn mật khẩu
                            name="password"
                            value={registerData.password}
                            onChange={handleChange}
                            className="user-details-input"
                            required
                            minLength={6} // Khớp với validation backend
                        />
                    </div>

                    {/* 3. FullName (Bắt buộc) */}
                    <div className="user-details-form-group">
                        <label className="user-details-label">Họ và tên (*):</label>
                        <input
                            type="text"
                            name="fullName"
                            value={registerData.fullName}
                            onChange={handleChange}
                            className="user-details-input"
                            required
                        />
                    </div>

                    {/* 4. Email (Nên có) */}
                    <div className="user-details-form-group">
                        <label className="user-details-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleChange}
                            className="user-details-input"
                        />
                    </div>

                    {/* 5. Phone (Tùy chọn) */}
                    <div className="user-details-form-group">
                        <label className="user-details-label">Số điện thoại:</label>
                        <input
                            type="text"
                            name="phone"
                            value={registerData.phone}
                            onChange={handleChange}
                            className="user-details-input"
                        />
                    </div>

                    {/* 6. Address (Tùy chọn) */}
                    <div className="user-details-form-group">
                        <label className="user-details-label">Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={registerData.address}
                            onChange={handleChange}
                            className="user-details-input"
                        />
                    </div>

                    {/* Nút bấm */}
                    <div className="user-details-button-container">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="user-details-btn user-details-btn-secondary"
                        >
                            🔙 Quay lại
                        </button>

                        <button
                            type="submit"
                            className="user-details-btn user-details-btn-primary"
                        >
                            ✅ Đăng ký
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}