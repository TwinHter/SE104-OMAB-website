// src/pages/HomePage.tsx
import React from "react";
import { Link } from "react-router-dom";
// import heroBg from '../assets/hero-bg.jpg'; // Đảm bảo bạn có hình ảnh này trong src/assets

const HomePage: React.FC = () => {
    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-cover bg-center font-pt-sans"
            style={{
                backgroundImage: `url('https://media.istockphoto.com/id/1719538017/photo/home-care-healthcare-professional-hugging-senior-patient.jpg?s=612x612&w=0&k=20&c=DTQwVD1DTH0CMQ78aox8-cVKg8Nl-wCkSwY-S072M4E=')`,
            }} // Đặt hình ảnh ở public hoặc import từ assets
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
            {/* Lớp phủ tối */}
            <div className="relative z-10 text-center text-white p-8 bg-white bg-opacity-20 rounded-lg shadow-xl max-w-2xl mx-auto">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                    Hệ thống OMAB
                </h1>
                <p className="text-xl mb-8 leading-relaxed">
                    Nền tảng giúp bạn dễ dàng kết nối với các bác sĩ hàng đầu,
                    quản lý lịch hẹn và hồ sơ y tế cá nhân một cách tiện lợi và
                    an toàn.
                </p>
                <Link
                    to="/login" // Dẫn đến trang đăng nhập để vào Profile
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    Bắt đầu ngay
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
