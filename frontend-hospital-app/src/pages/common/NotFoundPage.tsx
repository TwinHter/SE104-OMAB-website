// src/pages/common/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg font-pt-sans">
            <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-6xl text-red-500 mb-6 animate-bounce-slow"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                404 - Không tìm thấy trang
            </h1>
            <p className="text-lg text-gray-600 text-center mb-8">
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition duration-300 shadow-md"
            >
                Quay về Trang chủ
            </Link>
        </div>
    );
};

export default NotFoundPage;
