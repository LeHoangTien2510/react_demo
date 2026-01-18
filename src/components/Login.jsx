import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        axios.post("http://localhost:8080/login", user)
            .then((res) => {
                const token = res.data.token;
                if (token) {
                    localStorage.setItem('token', token);
                    const userInfo = {
                        id: res.data.id,
                        username: res.data.username,
                        fullName: res.data.fullName,
                        roles: res.data.roles
                    };
                    localStorage.setItem('user', JSON.stringify(userInfo));

                    const roles = userInfo.roles || [];
                    if (roles.includes("ROLE_ADMIN")) navigate("/admin/products");
                    else if (roles.includes("ROLE_STAFF")) navigate("/staff/products");
                    else navigate("/user/shopping");
                } else {
                    setError("Server không trả về Token hợp lệ.");
                }
            })
            .catch((err) => {
                console.error("Login Error:", err);
                setError("Tên đăng nhập hoặc mật khẩu không đúng.");
            });
    };

    return (
        <div className="auth-container">
            {/* Cột trái: Ảnh Banner - Đã đổi sang ảnh E-commerce tổng hợp */}
            <div
                className="auth-banner"
                style={{
                    // Ảnh minh họa mua sắm online/payment (Laptop + Thẻ)
                    backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop')"
                }}
            >
                <div className="banner-content">
                    <h2>Welcome Back</h2>
                    {/* Slogan tổng quát hơn, không giới hạn ở quần áo */}
                    <p>Khám phá thế giới công nghệ và tiện ích cùng Mega Mart.</p>
                </div>
            </div>

            {/* Cột phải: Form Login */}
            <div className="auth-form-wrapper">
                <div className="auth-form-content">
                    <Link to="/" className="btn-back">← Quay lại trang chủ</Link>

                    <Link to="/" className="brand-logo">Mega Mart</Link>

                    <h1 className="auth-title">Đăng nhập</h1>
                    <p className="auth-subtitle">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>

                    {error && <div className="error-msg">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Tên đăng nhập</label>
                            <input
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Nhập username của bạn"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Đăng nhập
                        </button>
                    </form>

                    <div style={{textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#888'}}>
                        <p>© 2026 Mega Mart. Secure Login.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}