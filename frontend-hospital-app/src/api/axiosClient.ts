// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5027/api", // Thay đổi nếu backend của bạn chạy ở cổng khác
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor để thêm token vào mỗi request (nếu có)
axiosClient.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem("currentUser");
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi response (ví dụ: token hết hạn)
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Xử lý token hết hạn hoặc không hợp lệ: xóa user khỏi localStorage và chuyển hướng về trang đăng nhập
            localStorage.removeItem("currentUser");
            // window.location.href = '/login'; // Có thể dùng navigate của react-router-dom nếu ngoài component
            alert(
                "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại."
            );
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
