import React, { useEffect, useState } from 'react';
import UserProductService from '../api/UserProductService'; // Tận dụng service đã có
import './StaffProductDetailModal.css'; // Import CSS riêng biệt

const StaffProductDetailModal = ({ isOpen, onClose, product }) => {
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Khi modal mở hoặc product thay đổi -> Gọi API lấy chi tiết đầy đủ (để lấy comments)
    useEffect(() => {
        if (isOpen && product) {
            setLoading(true);
            UserProductService.getProductDetail(product.id)
                .then(res => {
                    setDetailData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi tải chi tiết:", err);
                    setLoading(false);
                });
        } else {
            setDetailData(null);
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    // Helper hiển thị ảnh
    const getImageUrl = (imageName) => {
        return imageName
            ? `http://localhost:8080/uploads/${imageName}`
            : 'https://via.placeholder.com/300?text=No+Image';
    };

    return (
        <div className="staff-modal-overlay" onClick={onClose}>
            <div className="staff-modal-content" onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <div className="staff-modal-header">
                    <h3>🔍 Chi tiết sản phẩm (View Only)</h3>
                    <button className="btn-close-staff" onClick={onClose}>&times;</button>
                </div>

                {/* BODY */}
                <div className="staff-modal-body">
                    {loading || !detailData ? (
                        <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <>
                            {/* Cột Trái: Ảnh */}
                            <div className="staff-col-left">
                                <img
                                    src={getImageUrl(detailData.image)}
                                    alt={detailData.name}
                                    className="staff-product-img"
                                    onError={e => e.target.src = 'https://via.placeholder.com/300'}
                                />
                            </div>

                            {/* Cột Phải: Thông tin & Comment */}
                            <div className="staff-col-right">
                                <div className="staff-info-section">
                                    <h2>{detailData.name}</h2>
                                    <div className="staff-price">
                                        {detailData.price?.toLocaleString()} ₫
                                    </div>

                                    {/* Grid thông tin nhanh */}
                                    <div className="staff-meta-grid">
                                        <div className="staff-meta-item">
                                            <strong>Danh mục</strong>
                                            <span>{detailData.category?.categoryName || detailData.categoryName || 'N/A'}</span>
                                        </div>
                                        <div className="staff-meta-item">
                                            <strong>Tồn kho</strong>
                                            <span>{detailData.quantity} sản phẩm</span>
                                        </div>
                                        <div className="staff-meta-item">
                                            <strong>ID Sản phẩm</strong>
                                            <span>#{detailData.id}</span>
                                        </div>
                                        <div className="staff-meta-item">
                                            <strong>Trạng thái</strong>
                                            <span className={`status-tag ${detailData.status === 'AVAILABLE' ? 'status-ok' : 'status-out'}`}>
                                                {detailData.status === 'AVAILABLE' ? 'Đang bán' : 'Hết hàng/Ẩn'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="staff-desc">
                                        <strong>Mô tả chi tiết:</strong><br/>
                                        {detailData.description || "Không có mô tả."}
                                    </div>
                                </div>

                                {/* Khu vực Comment (READ ONLY) */}
                                <div className="staff-comments-section">
                                    <h4>💬 Phản hồi từ khách hàng ({detailData.comments?.length || 0})</h4>

                                    <div className="staff-comment-list">
                                        {detailData.comments && detailData.comments.length > 0 ? (
                                            detailData.comments.map((c, index) => (
                                                <div key={c.id || index} className="staff-comment-item">
                                                    <div className="staff-cmt-avatar">
                                                        {(c.userFullName || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="staff-cmt-content">
                                                        <div>{c.userFullName || 'Người dùng ẩn danh'}</div>
                                                        <p>{c.content}</p>
                                                        <span className="staff-cmt-date">
                                                            {c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{fontStyle:'italic', color:'#999'}}>Chưa có bình luận nào.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffProductDetailModal;