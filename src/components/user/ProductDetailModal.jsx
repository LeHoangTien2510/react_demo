import React, { useState } from 'react';
import './ProductDetailModal.css'; // Import file CSS riêng của modal

const ProductDetailModal = ({
                                isOpen,
                                onClose,
                                product,
                                onAddToCart,
                                onSubmitComment
                            }) => {
    const [commentContent, setCommentContent] = useState('');

    // Nếu modal không mở hoặc chưa có dữ liệu sản phẩm -> không hiển thị gì
    if (!isOpen || !product) return null;

    // --- Helper xử lý hiển thị ---
    const getImageUrl = (imageName) => {
        return imageName
            ? `http://localhost:8080/uploads/${imageName}`
            : 'https://via.placeholder.com/300?text=No+Image';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // --- Xử lý sự kiện nội bộ ---
    const handleSendComment = () => {
        if (!commentContent.trim()) return;
        // Gọi hàm của cha để xử lý API
        onSubmitComment(product.id, commentContent);
        setCommentContent(''); // Reset ô nhập
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendComment();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="btn-close-modal" onClick={onClose}>&times;</button>

                <div className="modal-body">
                    {/* Cột Trái: Ảnh */}
                    <div className="modal-left">
                        <img src={getImageUrl(product.image)} alt={product.name} />
                    </div>

                    {/* Cột Phải: Thông tin & Comment */}
                    <div className="modal-right">
                        <div className="product-info-scroll">
                            <h2 className="m-title">{product.name}</h2>
                            <div className="m-price">{formatPrice(product.price)}</div>
                            <p className="m-desc">{product.description || "Chưa có mô tả chi tiết."}</p>

                            <div className="m-meta">
                                <span>Danh mục: <b>{product.categoryName}</b></span>
                                <span>Tồn kho: <b>{product.quantity}</b></span>
                            </div>

                            <button
                                className="btn-add-large"
                                onClick={() => { onAddToCart(product); onClose(); }}
                                disabled={product.quantity <= 0}
                            >
                                {product.quantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                            </button>

                            <hr className="divider"/>

                            {/* Khu vực Bình Luận */}
                            <div className="comment-section">
                                <h3>Bình luận ({product.comments?.length || 0})</h3>
                                <div className="comment-list">
                                    {product.comments && product.comments.length > 0 ? (
                                        product.comments.map(c => (
                                            <div key={c.id} className="comment-item">
                                                <div className="cmt-avatar">{c.userFullName.charAt(0)}</div>
                                                <div className="cmt-content">
                                                    <strong>{c.userFullName}</strong>
                                                    <p>{c.content}</p>
                                                    <span className="cmt-time">
                                                        {new Date(c.createdAt).toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-cmt">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                    )}
                                </div>

                                {/* Input Comment */}
                                <div className="comment-input-box">
                                    <input
                                        type="text"
                                        placeholder="Viết bình luận của bạn..."
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button onClick={handleSendComment}>Gửi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;