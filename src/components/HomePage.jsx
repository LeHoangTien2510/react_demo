import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

// Dữ liệu giả lập ĐA NGÀNH HÀNG
const MARKETPLACE_CATEGORIES = [
    { id: 1, name: 'Thời Trang', icon: '👕' },
    { id: 2, name: 'Điện Thoại', icon: '📱' },
    { id: 3, name: 'Laptop', icon: '💻' },
    { id: 4, name: 'Gia Dụng', icon: '🏠' },
    { id: 5, name: 'Mỹ Phẩm', icon: '💄' },
    { id: 6, name: 'Giày Dép', icon: '👟' },
    { id: 7, name: 'Mẹ & Bé', icon: '🍼' },
    { id: 8, name: 'Sách', icon: '📚' },
];

const MIXED_PRODUCTS = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 28990000, sold: 5200, img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', discount: '-15%' },
    { id: 2, name: 'Áo Thun Cotton Basic', price: 159000, sold: 12000, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', discount: '-50%' },
    { id: 3, name: 'Nồi Chiên Không Dầu', price: 1850000, sold: 450, img: 'https://images.unsplash.com/photo-1626162232938-232a4e2ba41b?w=500', discount: '-30%' },
    { id: 4, name: 'Son Kem Lì Black Rouge', price: 135000, sold: 8900, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500', discount: '' },
    { id: 5, name: 'AirPods Pro 2', price: 5490000, sold: 210, img: 'https://images.unsplash.com/photo-1603351154351-5cf99bc5f16a?w=500', discount: '-5%' },
    { id: 6, name: 'Giày Nike Pegasus 40', price: 3200000, sold: 67, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', discount: '-10%' },
];

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">

            {/* 1. Header: Chỉ giữ Logo, Search, Cart, Login/Register */}
            <header className="simple-header">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="market-logo">
                        <span className="logo-icon">🛍️</span>
                        <span className="logo-text">MegaMart</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="search-wrapper">
                        <input type="text" className="search-input" placeholder="Tìm sản phẩm..." />
                        <button className="search-btn">🔍</button>
                    </div>

                    {/* Actions: Cart & Auth */}
                    <div className="header-actions">
                        <Link to="/login" className="action-item cart-btn">
                            🛒
                        </Link>
                        <div className="auth-links">
                            <Link to="/login" className="auth-btn login">Đăng nhập</Link>
                            <Link to="/register" className="auth-btn register">Đăng ký</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Banner Chính */}
            <div className="banner-section">
                <div className="main-banner">
                    <div className="banner-content">
                        <h2>Siêu Sale Hôm Nay</h2>
                        <p>Giảm giá đến 50% cho ngành hàng Điện tử & Thời trang</p>
                    </div>
                </div>
            </div>

            {/* 3. Danh Mục (Icon tròn đơn giản) */}
            <div className="section-box">
                <h3 className="section-title">DANH MỤC</h3>
                <div className="category-row">
                    {MARKETPLACE_CATEGORIES.map(cat => (
                        <div key={cat.id} className="cat-item" onClick={() => navigate('/login')}>
                            <div className="cat-icon">{cat.icon}</div>
                            <span className="cat-name">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. AI Feature (Điểm nhấn) */}
            <div className="section-box ai-promo">
                <div className="ai-info">
                    <span className="badge-new">TÍNH NĂNG MỚI</span>
                    <h2>AI Fashion Advisor 🤖</h2>
                    <p>Bạn mua quần áo nhưng không biết phối đồ? Hãy để AI giúp bạn.</p>
                    <Link to="/login" className="btn-ai">Thử Ngay</Link>
                </div>
                <div className="ai-img-decor">✨👗✨</div>
            </div>

            {/* 5. Gợi Ý Hôm Nay (Sản phẩm) */}
            <div className="section-box no-bg">
                <div className="section-header-highlight">GỢI Ý HÔM NAY</div>
                <div className="product-grid-home">
                    {MIXED_PRODUCTS.map(product => (
                        <div key={product.id} className="home-product-card" onClick={() => navigate('/login')}>
                            <div className="hp-img">
                                <img src={product.img} alt={product.name} />
                                {product.discount && <div className="hp-discount">{product.discount}</div>}
                            </div>
                            <div className="hp-details">
                                <div className="hp-name">{product.name}</div>
                                <div className="hp-price-row">
                                    <span className="hp-price">{product.price.toLocaleString()}₫</span>
                                    <span className="hp-sold">Đã bán {product.sold}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="view-more-container">
                    <button className="btn-view-more" onClick={() => navigate('/login')}>Xem Thêm</button>
                </div>
            </div>

            {/* Footer Gọn */}
            <footer className="simple-footer">
                <p>&copy; 2026 MegaMart. Nền tảng thương mại điện tử.</p>
            </footer>
        </div>
    );
};

export default HomePage;