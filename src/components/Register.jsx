import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css"; // Dùng chung CSS với Login

export default function Register() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
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
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        axios.post("http://localhost:8080/register", registerData)
            .then((res) => {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/login");
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    setErrorMessage(err.response.data);
                } else {
                    setErrorMessage("Đăng ký thất bại. Vui lòng thử lại.");
                }
            });
    };

    return (
        <div className="auth-container">
            {/* Cột trái: Ảnh khác với trang Login để tạo cảm giác mới */}
            <div
                className="auth-banner"
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop')"}}
            >
                <div className="banner-content">
                    <h2>Join The Club</h2>
                    <p>Trở thành thành viên để nhận ưu đãi đặc quyền và cập nhật xu hướng mới nhất.</p>
                </div>
            </div>

            {/* Cột phải: Form Register */}
            <div className="auth-form-wrapper">
                <div className="auth-form-content">
                    <Link to="/" className="btn-back">← Quay lại trang chủ</Link>
                    <Link to="/" className="brand-logo">LUXURY STORE</Link>

                    <h1 className="auth-title">Tạo tài khoản</h1>
                    <p className="auth-subtitle">
                        Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
                    </p>

                    {errorMessage && <div className="error-msg">⚠️ {errorMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* 2 trường quan trọng nhất để lên đầu */}
                        <div className="form-group">
                            <label className="form-label">Tên đăng nhập (*)</label>
                            <input
                                name="username"
                                value={registerData.username}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Chọn tên đăng nhập duy nhất"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu (*)</label>
                            <input
                                type="password"
                                name="password"
                                value={registerData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ít nhất 6 ký tự"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Họ và tên (*)</label>
                            <input
                                type="text"
                                name="fullName"
                                value={registerData.fullName}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ví dụ: Nguyễn Văn A"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="contact@example.com"
                            />
                        </div>

                        {/* Gom Phone và Address vào hàng ngang nếu cần, hoặc để dọc cho clean */}
                        <div className="form-group">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={registerData.phone}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="09xxxxxxx"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={registerData.address}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Số nhà, đường, quận/huyện..."
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Đăng ký ngay
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}