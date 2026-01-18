import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 👇 QUAN TRỌNG: Import file CSS riêng vừa tạo
import '../admin/Sidebar.css';

const SideBarStaff = () => {
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
        <aside className="SideBarStaff">
            <div className="logo">🛒 Staff Management</div>
            <nav>
                {/* --- MENU ITEMS --- */}

                {/* Sản Phẩm */}
                <div
                    className={`menu-item ${isActive('/staff/products')}`}
                    onClick={() => navigate("/staff/products")}
                >
                    <span>📦</span> Sản Phẩm
                </div>

                {/* Đơn Hàng (Ví dụ) */}
                <div
                    className={`menu-item ${isActive('/staff/orders')}`}
                    onClick={() => navigate("/staff/orders")}
                >
                    <span>📄</span> Đơn Hàng
                </div>

                <div
                    className={`menu-item ${isActive('/staff/stock-manage')}`}
                    onClick={() => navigate("/staff/stock-manage")}
                >
                    <span>⇄</span> Quản lý Kho
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

export default SideBarStaff;