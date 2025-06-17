// src/components/auth/RegisterForm.tsx
import React, { useState } from "react";
import { UserRole } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEnvelope,
    faLock,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

interface RegisterFormProps {
    onRegister: (
        name: string,
        email: string,
        password: string,
        role: UserRole
    ) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    onRegister,
    isLoading,
    error,
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.Patient); // Mặc định Patient

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onRegister(name, email, password, role);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">
                Đăng ký tài khoản
            </h2>
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    <FontAwesomeIcon
                        icon={faUser}
                        className="mr-2 text-gray-500"
                    />{" "}
                    Tên của bạn
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="Tên đầy đủ của bạn"
                />
            </div>
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
                    {/* Admin không tự đăng ký, Bác sĩ thường được Admin tạo */}
                    {/* <option value={UserRole.Doctor}>Bác sĩ</option> */}
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
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                )}
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
            {error && (
                <p className="text-red-600 text-center mt-4 text-sm">
                    Lỗi: {error.message || "Có lỗi xảy ra."}
                </p>
            )}
        </form>
    );
};

export default RegisterForm;
