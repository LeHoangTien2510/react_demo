import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import SideBarUser from './SideBarUser';
import './ShoppingPage.css';

const ShoppingPage = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });

    // --- State Dữ Liệu Gốc (Master Data) ---
    // products: Chứa toàn bộ sản phẩm tải từ Server (không bao giờ bị xóa bớt khi lọc)
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // --- State Hiển Thị (Displayed Data) ---
    // filteredProducts: Danh sách đang được vẽ ra màn hình
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [cart, setCart] = useState([]);

    // --- State Ô Nhập Liệu (Input State) ---
    // Chỉ dùng để lưu tạm text người dùng gõ, chưa dùng để lọc ngay
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // --- 1. Load dữ liệu ban đầu ---
    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        fetchData();
    }, [currentUser, navigate]);

    const fetchData = async () => {
        try {
            const [resProducts, resCategories] = await Promise.all([
                axiosClient.get('/products'),
                axiosClient.get('/categories')
            ]);

            // Lưu vào master data
            setAllProducts(resProducts.data);
            setCategories(resCategories.data);

            // Ban đầu hiển thị tất cả
            setFilteredProducts(resProducts.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    };

    // --- 2. Logic Tìm Kiếm (Chỉ chạy khi bấm nút) ---
    const handleSearch = () => {
        // Bắt đầu lọc từ danh sách gốc (allProducts)
        const result = allProducts.filter(product => {
            // Lọc tên
            const matchName = product.name.toLowerCase().includes(searchText.toLowerCase());
            // Lọc category
            const matchCategory = selectedCategory === 'ALL' ||
                (product.category && product.category.id === parseInt(selectedCategory));

            return matchName && matchCategory;
        });

        // Cập nhật danh sách hiển thị
        setFilteredProducts(result);
    };

    // Xử lý khi nhấn Enter trong ô tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // --- 3. Logic Giỏ Hàng & Checkout (Giữ nguyên) ---
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (productId, change) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.productId === productId) {
                    const newQty = item.quantity + change;
                    if (newQty <= 0) return null;
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(Boolean);
        });
    };

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (!window.confirm(`Xác nhận thanh toán đơn hàng ${totalPrice.toLocaleString()} ₫?`)) return;

        try {
            const payload = cart.map(item => ({ productId: item.productId, quantity: item.quantity }));
            await axiosClient.post('/user/orders/checkout', payload);
            alert("✅ Đặt hàng thành công! Cảm ơn bạn.");
            setCart([]);

            // Tải lại dữ liệu gốc để cập nhật kho
            // Sau khi tải xong, cần gọi lại hàm search để giữ nguyên bộ lọc hiện tại của người dùng
            // Nhưng để đơn giản, ta load lại toàn bộ và reset bộ lọc hoặc giữ nguyên tùy ý.
            // Ở đây mình chọn cách đơn giản: Load lại và Reset về hiển thị tất cả
            fetchData();
            setSearchText('');
            setSelectedCategory('ALL');

        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            const msg = error.response?.data || "Lỗi server.";
            alert("❌ Đặt hàng thất bại: " + msg);
        }
    };

    const getImageUrl = (imageName) => {
        if (!imageName) return "https://via.placeholder.com/200";
        return `http://localhost:8080/uploads/${imageName}`;
    };

    return (
        <div className="user-layout-container">
            <SideBarUser />

            <main className="main-content">
                <header style={{
                    padding: '20px 30px', background:'white', boxShadow:'0 1px 2px rgba(0,0,0,0.05)',
                    display:'flex', justifyContent:'space-between', alignItems:'center'
                }}>
                    <h2 style={{margin:0, color:'#1e293b'}}>🛍️ Mua Sắm</h2>
                    <span style={{color: '#64748b'}}>
                        Xin chào, <strong style={{color:'#6366f1'}}>{currentUser?.fullName || 'Khách hàng'}</strong>
                    </span>
                </header>

                <div className="shopping-inner-content">
                    <div className="products-area">

                        {/* 👇 THANH TÌM KIẾM MỚI */}
                        <div className="filter-bar">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="🔍 Nhập tên sản phẩm..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={handleKeyDown} // Cho phép nhấn Enter
                            />

                            <select
                                className="category-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="ALL">📂 Tất cả danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.categoryName || cat.name}</option>
                                ))}
                            </select>

                            {/* Nút bấm để kích hoạt tìm kiếm */}
                            <button className="btn-search-trigger" onClick={handleSearch}>
                                Tìm Kiếm
                            </button>
                        </div>

                        {/* GRID SẢN PHẨM (Render từ filteredProducts) */}
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div key={product.id} className="product-card">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="product-img"
                                            onError={(e)=>e.target.src='https://via.placeholder.com/200'}
                                        />

                                        <div className="product-cat-tag">
                                            {product.category ? (product.category.categoryName || product.category.name) : 'Khác'}
                                        </div>

                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-price">{product.price?.toLocaleString()} ₫</div>
                                        <div className="product-stock">Kho: {product.quantity}</div>

                                        <button
                                            className="btn-add-cart"
                                            onClick={() => addToCart(product)}
                                            disabled={product.quantity <= 0 || product.status === "OUT_OF_STOCK"}
                                        >
                                            {product.quantity > 0 ? "+ Thêm" : "Hết hàng"}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="no-result">
                                    <p>🚫 Không tìm thấy sản phẩm nào!</p>
                                    <button className="btn-reset" onClick={() => {
                                        setSearchText('');
                                        setSelectedCategory('ALL');
                                        setFilteredProducts(allProducts);
                                    }}>Xem tất cả</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GIỎ HÀNG (Giữ nguyên) */}
                    <aside className="cart-sidebar">
                        <div className="cart-title">
                            🛒 Giỏ hàng <span style={{fontSize:'16px', color:'#6366f1', marginLeft:'5px'}}>({cart.length})</span>
                        </div>
                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <p style={{color:'#94a3b8', textAlign:'center', marginTop:'20px'}}>Chưa có sản phẩm nào</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.productId} className="cart-item">
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <span>{item.price.toLocaleString()} x {item.quantity}</span>
                                        </div>
                                        <div className="cart-controls">
                                            <button className="btn-qty" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                                            <span style={{fontWeight:'bold', minWidth:'20px', textAlign:'center'}}>{item.quantity}</span>
                                            <button className="btn-qty" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="cart-total">
                            <span>Tổng cộng:</span>
                            <span style={{color:'#6366f1'}}>{totalPrice.toLocaleString()} ₫</span>
                        </div>
                        <button className="btn-checkout" onClick={handleCheckout} disabled={cart.length === 0}>
                            THANH TOÁN NGAY
                        </button>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ShoppingPage;