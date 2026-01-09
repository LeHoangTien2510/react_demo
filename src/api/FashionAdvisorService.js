import axiosClient from './axiosClient';

const analyzeOutfit = (imageFile, option) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('option', option); // Gửi tùy chọn (1, 2 hoặc 3)

    return axiosClient.post('/fashion-advisor/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const FashionAdvisorService = {
    analyzeOutfit
};

export default FashionAdvisorService;