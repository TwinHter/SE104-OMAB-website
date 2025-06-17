// src/components/auth/LoginForm.tsx
import React, { useState } from "react";
import { UserRole } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLock,
    faUserTag,
    faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

interface LoginFormProps {
    onLogin: (email: string, password: string, role: UserRole) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.Patient); // Mặc định là Patient

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onLogin(email, password, role); // Gọi hàm onLogin từ props
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">
                Đăng nhập
            </h2>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    <FontAwesomeIcon
                        icon={faEnvelope}
                        className="mr-2 text-gray-500"
                    />{" "}
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="your@example.com"
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    <FontAwesomeIcon
                        icon={faLock}
                        className="mr-2 text-gray-500"
                    />{" "}
                    Mật khẩu
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="••••••••"
                />
            </div>
            <div>
                <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    <FontAwesomeIcon
                        icon={faUserTag}
                        className="mr-2 text-gray-500"
                    />{" "}
                    Vai trò
                </label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) =>
                        setRole(parseInt(e.target.value, 10) as UserRole)
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200"
                >
                    <option value={UserRole.Patient}>Bệnh nhân</option>
                    <option value={UserRole.Doctor}>Bác sĩ</option>
                    <option value={UserRole.Admin}>Admin</option>
                </select>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
            >
                {isLoading ? (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : (
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                )}
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            {error && (
                <p className="text-red-600 text-center mt-4 text-sm">
                    Lỗi: {error.message || "Có lỗi xảy ra."}
                </p>
            )}

            {/* Thêm đường dẫn đến trang đổi mật khẩu */}
            <div className="text-center mt-4">
                <Link
                    to="/change-password"
                    className="text-primary hover:underline text-sm"
                >
                    Quên mật khẩu? / Đổi mật khẩu
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;
