import React, { useState } from 'react';
import FashionAdvisorService from '../../api/FashionAdvisorService'; // Đảm bảo đường dẫn đúng
import SideBarUser from './SideBarUser'; // Import Sidebar của bạn
import './VirtualFittingRoom.css';

const FashionAdvisor = () => {
    const [userImage, setUserImage] = useState(null);
    const [userImagePreview, setUserImagePreview] = useState(null);
    const [option, setOption] = useState('evaluate'); // Default: Đánh giá
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImage(file);
            setUserImagePreview(URL.createObjectURL(file));
            setAdvice(''); // Xóa kết quả cũ khi chọn ảnh mới
        }
    };

    // Gọi API
    const handleAnalyze = async () => {
        if (!userImage) {
            alert("Vui lòng tải ảnh lên trước!");
            return;
        }

        setLoading(true);
        setAdvice('');

        try {
            const res = await FashionAdvisorService.analyzeOutfit(userImage, option);
            // Backend trả về: { "result": "Nội dung tư vấn..." }
            if (res.data && res.data.result) {
                setAdvice(res.data.result);
            } else {
                setAdvice("AI không trả về kết quả nào. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            setAdvice("Có lỗi xảy ra khi kết nối với AI Server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-layout-container">
            <SideBarUser />
            <main className="main-content vto-container">
                <header className="vto-header">
                    <h2>👔 Trợ Lý Thời Trang AI</h2>
                    <p>Tải ảnh trang phục của bạn lên và nhận lời khuyên từ chuyên gia AI</p>
                </header>

                <div className="vto-grid">
                    {/* Cột 1: Upload Ảnh */}
                    <div className="vto-step step-upload">
                        <h3>1. Ảnh trang phục của bạn</h3>
                        <div className="upload-box">
                            {userImagePreview ? (
                                <img src={userImagePreview} alt="Preview" className="user-preview-img" />
                            ) : (
                                <div className="placeholder-upload">
                                    <span style={{fontSize:'40px'}}>📸</span>
                                    <p>Tải ảnh toàn thân hoặc món đồ</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="file-input-custom" />
                        </div>
                    </div>

                    {/* Cột 2: Tùy chọn & Kết quả (Chia làm 2 phần: Controls cố định & Kết quả cuộn) */}
                    <div className="vto-step step-result">
                        <h3>2. Bạn muốn AI giúp gì?</h3>

                        {/* Phần tĩnh: Options và Nút bấm */}
                        <div className="advisor-controls">
                            <div className="options-container">
                                <label className={`option-card ${option === 'evaluate' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="advisor-opt"
                                        value="evaluate"
                                        checked={option === 'evaluate'}
                                        onChange={(e) => setOption(e.target.value)}
                                        hidden // Ẩn nút radio mặc định cho đẹp
                                    />
                                    <span>🧐 Đánh giá độ phù hợp với dáng người</span>
                                </label>

                                <label className={`option-card ${option === 'suggest_pants' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="advisor-opt"
                                        value="suggest_pants"
                                        checked={option === 'suggest_pants'}
                                        onChange={(e) => setOption(e.target.value)}
                                        hidden
                                    />
                                    <span>👖 Đang mặc áo này, tìm quần phù hợp</span>
                                </label>

                                <label className={`option-card ${option === 'suggest_shirt' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="advisor-opt"
                                        value="suggest_shirt"
                                        checked={option === 'suggest_shirt'}
                                        onChange={(e) => setOption(e.target.value)}
                                        hidden
                                    />
                                    <span>👕 Đang mặc quần này, tìm áo phù hợp</span>
                                </label>
                            </div>

                            <button
                                className="btn-magic"
                                onClick={handleAnalyze}
                                disabled={loading || !userImage}
                            >
                                {loading ? "AI đang suy nghĩ..." : "✨ Phân Tích Ngay"}
                            </button>
                        </div>

                        {/* Phần động: Khu vực hiển thị kết quả (Sẽ có scrollbar nếu dài) */}
                        <div className="advisor-result-scroll">
                            {loading ? (
                                <div className="loader-container">
                                    <div className="spinner"></div>
                                    <p>Đang soạn thảo lời khuyên...</p>
                                </div>
                            ) : advice ? (
                                <div>
                                    <h4>💡 Lời khuyên của AI:</h4>
                                    <p>{advice}</p>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>Kết quả phân tích sẽ hiển thị tại đây</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FashionAdvisor;