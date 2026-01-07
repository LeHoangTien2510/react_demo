import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ShoppingPage.css'; // Dùng chung CSS layout với trang mua hàng

const SideBarUser = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hàm kiểm tra active
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        if (window.confirm("Bạn chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate("/login");
        }
    };

    return (
        <aside className="sidebar user-sidebar-theme">
            <div className="logo">
                🛍️ E-Shop User
            </div>

            <nav className="menu">
                <div
                    className={`menu-item ${isActive('/user/shopping') ? 'active' : ''}`}
                    onClick={() => navigate('/user/shopping')}
                >
                    <span>🏪</span> Mua Sắm
                </div>

                <div
                    className={`menu-item ${isActive('/profile') ? 'active' : ''}`}
                    onClick={() => navigate('/profile')}
                >
                    <span>👤</span> Hồ Sơ Cá Nhân
                </div>

                {/* Thêm menu Lịch sử đơn hàng nếu muốn sau này */}
                {/* <div className="menu-item">📦 Lịch Sử Đơn</div> */}
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <div className="menu-item logout" onClick={handleLogout}>
                    <span>🚪</span> Đăng Xuất
                </div>
            </div>
        </aside>
    );
};

export default SideBarUser;