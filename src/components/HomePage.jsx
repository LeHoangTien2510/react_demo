import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            {/* Header: Chỉ có Logo và Login/Register */}
            <nav className="navbar">
                <div className="logo">LUXURY STORE</div>

                {/* Bỏ hết các link điều hướng nội bộ */}

                <div className="auth-buttons">
                    <Link to="/login" className="btn-auth btn-login">Đăng nhập</Link>
                    <Link to="/register" className="btn-auth btn-register">Đăng ký thành viên</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <h1>The Art of Fashion</h1>
                    <p className="hero-subtitle">Nâng tầm phong cách với công nghệ AI và thiết kế độc bản</p>
                    {/* Nút này dẫn về Login hoặc Register */}
                    <Link to="/register" className="btn-hero">Trở thành hội viên</Link>
                </div>
            </header>

            {/* Brand Story - Giới thiệu suông, không có link */}
            <section className="brand-story">
                <h2>Vẻ Đẹp Vượt Thời Gian</h2>
                <p>
                    Chào mừng bạn đến với Luxury Store. Chúng tôi không chỉ bán quần áo,
                    chúng tôi mang đến giải pháp phong cách toàn diện.
                    Mọi thiết kế đều được tinh chỉnh để tôn vinh vẻ đẹp cá nhân của bạn.
                </p>
            </section>

            {/* Teaser Collections - Chỉ cho xem hình, bấm vào bắt Login */}
            <section className="teaser-section">
                <div className="teaser-item">
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" alt="Woman" className="teaser-img" />
                    <div className="teaser-content">
                        <h3>Women's Collection</h3>
                        <Link to="/login" style={{color: '#fff', textDecoration: 'underline'}}>Khám phá</Link>
                    </div>
                </div>
                <div className="teaser-item">
                    <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1995" alt="Man" className="teaser-img" />
                    <div className="teaser-content">
                        <h3>Men's Collection</h3>
                        <Link to="/login" style={{color: '#fff', textDecoration: 'underline'}}>Khám phá</Link>
                    </div>
                </div>
            </section>

            {/* AI Advisor Intro - Teaser tính năng VIP */}
            <section className="ai-tech">
                <div className="ai-text">
                    <h2>AI Fashion Advisor</h2>
                    <p>
                        Công nghệ trí tuệ nhân tạo độc quyền giúp phân tích vóc dáng và gu thẩm mỹ,
                        đề xuất những bộ trang phục hoàn hảo nhất dành riêng cho bạn.
                    </p>
                    <p><i>*Tính năng chỉ dành riêng cho thành viên chính thức.</i></p>
                    <Link to="/register" className="btn-auth btn-register">Đăng ký để trải nghiệm ngay</Link>
                </div>
                <div className="ai-visual"></div>
            </section>

            <footer>
                <p>&copy; 2026 Luxury Store. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;