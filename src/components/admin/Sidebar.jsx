import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 👇 QUAN TRỌNG: Import file CSS riêng vừa tạo
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook lấy đường dẫn hiện tại

    const handleLogout = () => {
        // Thêm confirm cho chắc chắn
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.clear();
            navigate("/");
        }
    };

    // Hàm kiểm tra đường dẫn để thêm class 'active'
    const isActive = (path) => {
        // So sánh chính xác đường dẫn
        return location.pathname === path ? 'active' : '';
    };

    return (
        <aside className="sidebar">
            <div className="logo">🛒 AdminPro</div>
            <nav>
                {/* --- MENU ITEMS --- */}

                {/* Sản Phẩm */}
                <div
                    className={`menu-item ${isActive('/admin/products')}`}
                    onClick={() => navigate("/admin/products")}
                >
                    <span>📦</span> Sản Phẩm
                </div>

                {/* Đơn Hàng (Ví dụ) */}
                <div
                    className={`menu-item ${isActive('/admin/orders')}`}
                    onClick={() => navigate("/admin/orders")}
                >
                    <span>📄</span> Đơn Hàng
                </div>

                {/* 👇 THÊM DÒNG NÀY: Menu Quản lý User */}
                <div className={`menu-item ${isActive('/admin/users')}`} onClick={() => navigate("/admin/users")}>
                    <span>👥</span> Người Dùng
                </div>

                <div className={`menu-item ${isActive('/admin/categories')}`} onClick={() => navigate("/admin/categories")}>
                    <span>📂</span> Quản lý Danh mục
                </div>

                <div
                    className={`menu-item ${isActive('/admin/staff')}`}
                    onClick={() => navigate("/admin/staff")}
                >
                    <span>🧑‍💼</span> Nhân Viên (Staff)
                </div>

                <div
                    className={`menu-item ${isActive('/admin/stock-history')}`}
                    onClick={() => navigate("/admin/stock-history")}
                >
                    <span>📊</span> Lịch sử Kho
                </div>

                <div
                    className={`menu-item ${isActive('/admin/revenue')}`}
                    onClick={() => navigate("/admin/revenue")}
                >
                    <span>💰</span> Doanh Thu
                </div>



                {/* Hồ Sơ */}
                <div
                    className={`menu-item ${isActive('/profile')}`}
                    onClick={() => navigate("/profile")}
                >
                    <span>👤</span> Hồ Sơ
                </div>

                {/* --- NÚT ĐĂNG XUẤT --- */}
                {/* Đã dùng class logout-btn thay vì inline style */}
                <div
                    className="menu-item logout-btn"
                    onClick={handleLogout}
                >
                    <span>🚪</span> Đăng Xuất
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;