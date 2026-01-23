import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProductService from '../../api/UserProductService';
import SideBarUser from './SideBarUser';
import ProductDetailModal from './ProductDetailModal'; // Import Modal mới tạo
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

    // --- State Modal & Detail ---
    const [showModal, setShowModal] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [loadingModal, setLoadingModal] = useState(false);

    // --- 1. Load dữ liệu ---
    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }

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
                console.error("Lỗi tải dữ liệu:", error);
            }
        };

        loadData();
    }, [currentUser, navigate]);

    // --- 2. Xử lý hình ảnh ---
    const getImageUrl = (imageName) => {
        // Nếu có tên ảnh thì lấy từ server, không thì dùng ảnh nội bộ
        return imageName
            ? `http://localhost:8080/uploads/${imageName}`
            : '/assets/no-image.png'; // Đường dẫn đến file trong thư mục public
    };

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
    const addToCart = (product, e) => {
        // Ngăn sự kiện nổi bọt (để không mở modal khi bấm nút thêm giỏ hàng)
        if (e) e.stopPropagation();

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }];
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
            // 1. Tạo danh sách item đúng chuẩn
            const items = cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            // 2. --- QUAN TRỌNG NHẤT ---
            // Phải đóng gói vào một Object (JSON Object), KHÔNG ĐƯỢC gửi Array trần trụi.
            // Key "cartItems" bên dưới là tôi đoán dựa trên tên biến trong OrderService.
            // Nếu vẫn lỗi, bạn phải mở file PlaceOrderRequest.java để xem tên biến là gì.
            const payload = {
                cartItems: items,
                voucherCode: "" // Thêm trường này vì OrderService có xử lý voucher
            };

            // Log ra xem thử payload trông như nào (F12 để xem)
            console.log("Dữ liệu gửi đi:", payload);

            await UserProductService.checkout(payload);

            alert("✅ Đặt hàng thành công!");
            setCart([]);

            // Xóa cache giỏ hàng nếu có lưu local
            // localStorage.removeItem('cart');

            window.location.reload();
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            const msg = error.response?.data?.message || JSON.stringify(error.response?.data) || "Lỗi server";
            alert("❌ Đặt hàng thất bại: " + msg);
        }
    };

    // --- 5. LOGIC MODAL & COMMENT (MỚI THÊM) ---
    const openProductModal = async (productId) => {
        setLoadingModal(true);
        try {
            // Gọi API lấy chi tiết sản phẩm (bao gồm cả comments)
            const res = await UserProductService.getProductDetail(productId);
            setActiveProduct(res.data);
            setShowModal(true);
        } catch (error) {
            console.error("Lỗi lấy chi tiết sản phẩm:", error);
        } finally {
            setLoadingModal(false);
        }
    };

    const handleSubmitComment = async (productId, content) => {
        try {
            const payload = {
                userId: currentUser.id,
                productId: productId,
                content: content
            };
            await UserProductService.addComment(payload);

            // Sau khi comment xong, reload lại dữ liệu chi tiết để hiển thị comment mới
            const res = await UserProductService.getProductDetail(productId);
            setActiveProduct(res.data);
        } catch (error) {
            alert("Lỗi gửi bình luận: " + (error.response?.data || "Server error"));
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
                                    <div
                                        key={product.id}
                                        className="product-card"
                                        onClick={() => openProductModal(product.id)} // Click thẻ -> Mở Modal
                                    >
                                        {/* 1. Ảnh vuông */}
                                        <div className="card-img-wrapper">
                                            <div className="shopee-badge">Yêu thích</div>
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/assets/no-image.jpg'; // Thay link placeholder bằng ảnh local
                                                }}
                                            />
                                            {product.quantity <= 0 && (
                                                <div className="out-of-stock-overlay">
                                                    <span className="oos-label">Hết hàng</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 2. Thông tin */}
                                        <div className="card-body">
                                            <div className="product-name" title={product.name}>{product.name}</div>

                                            <div className="product-info-row">
                                                <span>Kho: {product.quantity}</span>
                                            </div>

                                            {/* Footer: GIÁ TRÁI - NÚT PHẢI */}
                                            <div className="product-footer">
                                                <div className="price-wrapper">
                                                    <span className="currency-symbol">₫</span>
                                                    {new Intl.NumberFormat('vi-VN').format(product.price)}
                                                </div>

                                                {/* ĐÂY LÀ NÚT BẠN CẦN GIỮ LẠI */}
                                                <button
                                                    className="btn-card-add"
                                                    disabled={product.quantity <= 0}
                                                    onClick={(e) => addToCart(product, e)} // e.stopPropagation đã có trong hàm addToCart ở code cũ
                                                    title="Thêm nhanh vào giỏ"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-result">
                                    <p>Không tìm thấy sản phẩm!</p>
                                    <button className="btn-reset" onClick={() => {
                                        setSearchText('');
                                        setSelectedCategory('ALL');
                                        setFilteredProducts(allProducts);
                                    }}>Xem tất cả</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CART SIDEBAR */}
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

                {/* --- RENDER MODAL TẠI ĐÂY --- */}
                <ProductDetailModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    product={activeProduct}
                    onAddToCart={addToCart}
                    onSubmitComment={handleSubmitComment}
                />
            </main>
        </div>
    );
};

export default ShoppingPage;