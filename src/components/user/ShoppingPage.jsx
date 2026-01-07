import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProductService from '../../api/UserProductService'; // Import Service vừa sửa
import SideBarUser from './SideBarUser';
import './ShoppingPage.css';

const ShoppingPage = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });

    // --- State Dữ Liệu ---
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);

    // --- State Tìm Kiếm ---
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // --- 1. Load dữ liệu (FIX LỖI ESLINT & LOGIC) ---
    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }

        // Định nghĩa hàm ngay trong useEffect để tránh lỗi dependency
        const loadData = async () => {
            try {
                const [resProducts, resCategories] = await Promise.all([
                    UserProductService.getAllProducts(),
                    UserProductService.getAllCategories()
                ]);

                setAllProducts(resProducts.data);
                setCategories(resCategories.data);
                setFilteredProducts(resProducts.data);
            } catch (error) {
                console.error("Lỗi tải dữ liệu (Check Backend):", error);
            }
        };

        loadData();
    }, [currentUser, navigate]);

    // --- 2. Xử lý hình ảnh (Dùng localhost & Ảnh dự phòng) ---
    const getImageUrl = (imageName) => {
        if (!imageName) return fallbackImage;
        return `http://localhost:8080/uploads/${imageName}`;
    };

    // Ảnh SVG dự phòng (hiển thị khi ảnh lỗi hoặc backend chưa chạy)
    const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2394a3b8%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

    // --- 3. Logic Tìm Kiếm ---
    const handleSearch = () => {
        const result = allProducts.filter(product => {
            const matchName = product.name.toLowerCase().includes(searchText.toLowerCase());
            const matchCategory = selectedCategory === 'ALL' ||
                (product.category && product.category.id === parseInt(selectedCategory));
            return matchName && matchCategory;
        });
        setFilteredProducts(result);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    // --- 4. Logic Giỏ Hàng & Checkout ---
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
            await UserProductService.checkout(payload);

            alert("✅ Đặt hàng thành công!");
            setCart([]);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            const msg = error.response?.data || "Lỗi server (backend chưa chạy?)";
            alert("❌ Đặt hàng thất bại: " + msg);
        }
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
                        {/* SEARCH BAR */}
                        <div className="filter-bar">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="🔍 Tìm sản phẩm..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={handleKeyDown}
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
                            <button className="btn-search-trigger" onClick={handleSearch}>Tìm Kiếm</button>
                        </div>

                        {/* PRODUCT GRID */}
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div key={product.id} className="product-card">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="product-img"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = fallbackImage;
                                            }}
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
                                    <p>🚫 Không tìm thấy sản phẩm!</p>
                                    <button className="btn-reset" onClick={() => {
                                        setSearchText('');
                                        setSelectedCategory('ALL');
                                        setFilteredProducts(allProducts);
                                    }}>Xem tất cả</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CART */}
                    <aside className="cart-sidebar">
                        <div className="cart-title">
                            🛒 Giỏ hàng <span style={{fontSize:'16px', color:'#6366f1'}}>({cart.length})</span>
                        </div>
                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <p style={{color:'#94a3b8', textAlign:'center', marginTop:'20px'}}>Giỏ hàng trống</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.productId} className="cart-item">
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <span>{item.price.toLocaleString()} x {item.quantity}</span>
                                        </div>
                                        <div className="cart-controls">
                                            <button className="btn-qty" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button className="btn-qty" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="cart-total">
                            <span>Tổng:</span>
                            <span style={{color:'#6366f1'}}>{totalPrice.toLocaleString()} ₫</span>
                        </div>
                        <button className="btn-checkout" onClick={handleCheckout} disabled={cart.length === 0}>
                            THANH TOÁN
                        </button>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ShoppingPage;