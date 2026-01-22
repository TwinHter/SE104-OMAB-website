// src/components/auth/ChangePasswordForm.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLock,
    faKey, // Icon cho mật khẩu mới
    faCheckCircle, // Icon cho xác nhận mật khẩu
} from "@fortawesome/free-solid-svg-icons";

// Định nghĩa props cho component ChangePasswordForm
interface ChangePasswordFormProps {
    // userId cần thiết để gửi lên API khi đổi mật khẩu
    userId: string;
    // Callback function khi người dùng gửi form
    // Tham số: userId, currentPassword, newPassword
    // Trả về Promise<void> để có thể await nó trong component cha
    onPasswordChange: (
        userId: string,
        currentPassword: string,
        newPassword: string
    ) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
    successMessage: string | null; // Thêm prop để hiển thị thông báo thành công
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    userId,
    onPasswordChange,
    isLoading,
    error,
    successMessage,
}) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null); // Lỗi cục bộ của form

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null); // Reset lỗi form trước mỗi lần submit

        if (newPassword !== confirmNewPassword) {
            setFormError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            // Ví dụ: yêu cầu tối thiểu 6 ký tự
            setFormError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        // Gọi hàm onPasswordChange được truyền từ props
        await onPasswordChange(userId, currentPassword, newPassword);

        // Sau khi gửi thành công, có thể reset form (tùy chọn)
        // Nếu có thông báo thành công, hãy reset các trường input
        if (!error && !isLoading && successMessage) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">
                Đổi mật khẩu
            </h2>

            {/* Thông báo thành công */}
            {successMessage && (
                <div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    {successMessage}
                </div>
            )}

            <div>
                <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    <FontAwesomeIcon
                        icon={faLock}
                        className="mr-2 text-gray-500"
                    />{" "}
                    Mật khẩu hiện tại
                </label>
                <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="••••••••"
                />
            </div>
            <div>
                <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    <FontAwesomeIcon
                        icon={faKey}
                        className="mr-2 text-gray-500"
                    />{" "}
                    Mật khẩu mới
                </label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="••••••••"
                />
            </div>
            <div>
                <label
                    htmlFor="confirmNewPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="mr-2 text-gray-500"
                    />{" "}
                    Xác nhận mật khẩu mới
                </label>
                <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200"
                    placeholder="••••••••"
                />
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
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                )}
                {isLoading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </button>
            {formError && ( // Hiển thị lỗi cục bộ của form
                <p className="text-red-600 text-center mt-4 text-sm">
                    Lỗi: {formError}
                </p>
            )}
            {error && ( // Hiển thị lỗi từ API
                <p className="text-red-600 text-center mt-4 text-sm">
                    Lỗi: {error.message || "Có lỗi xảy ra khi đổi mật khẩu."}
                </p>
            )}
        </form>
    );
};

export default ChangePasswordForm;
