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

        axios.post("http://localhost:8080/login", user)
            .then((res) => {
                console.log("🔍 Response:", res.data);
                const token = res.data.token;

                if (token) {
                    // 1. Lưu Token & User
                    localStorage.setItem('token', token);
                    const userInfo = {
                        id: res.data.id,
                        username: res.data.username,
                        fullName: res.data.fullName,
                        roles: res.data.roles // Server trả về ví dụ: ["ROLE_ADMIN", "ROLE_USER"]
                    };
                    localStorage.setItem('user', JSON.stringify(userInfo));

                    alert(`✅ Xin chào ${userInfo.fullName}!`);

                    // 2. 🔥 LOGIC ĐIỀU HƯỚNG DỰA TRÊN ROLE
                    const roles = userInfo.roles || [];

                    if (roles.includes("ROLE_ADMIN") ) {
                        navigate("/admin/products");
                    }
                    else if(roles.includes("ROLE_STAFF")) {
                        navigate("/staff/products")
                    } else {
                        navigate("/user/shopping");
                    }

                } else {
                    alert("⚠️ Lỗi: Server không trả về Token!");
                }
            })
            .catch((err) => {
                console.error("❌ Lỗi:", err);
                alert("Đăng nhập thất bại!");
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