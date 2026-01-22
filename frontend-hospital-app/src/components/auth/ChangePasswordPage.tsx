// src/pages/auth/ChangePasswordPage.tsx
import React, { useState } from "react";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import { useAuth } from "../../hooks/useAuthContext"; // Giả định bạn có useAuth hook
import axiosClient from "../../api/axiosClient"; // Axios instance của bạn
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng

const ChangePasswordPage: React.FC = () => {
    const { currentUser } = useAuth(); // Lấy thông tin người dùng hiện tại
    const navigate = useNavigate(); // Hook để điều hướng

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // userId là bắt buộc. Nếu người dùng chưa đăng nhập, họ không thể đổi mật khẩu theo cách này.
    // Nếu bạn muốn cho phép đổi mật khẩu khi chưa đăng nhập (quên mật khẩu),
    // bạn sẽ cần một flow "forgot password" phức tạp hơn với email verification token.
    // Hiện tại, chúng ta giả định người dùng đã đăng nhập hoặc có cách để xác định userId.
    // Nếu currentUser không có, chúng ta sẽ thông báo hoặc chuyển hướng.
    const userId = currentUser?.id || "";

    const handlePasswordChange = async (
        id: string, // Đổi tên tham số để tránh nhầm lẫn với userId của state
        currentPassword: string,
        newPassword: string
    ) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!id) {
            setError(
                new Error(
                    "Không tìm thấy ID người dùng. Vui lòng đăng nhập lại."
                )
            );
            setIsLoading(false);
            return;
        }
        const response = await axiosClient.post("/auth/change-password", {
            userId: id, // Sử dụng tham số id
            currentPassword,
            newPassword,
            confirmNewPassword: newPassword,
        });

        if (response.status === 200) {
            setSuccessMessage(
                response.data.message || "Mật khẩu đã được đổi thành công!"
            );
            // Sau khi đổi mật khẩu thành công, có thể chuyển hướng về trang profile hoặc login
            // setTimeout(() => {
            //     navigate("/profile"); // Hoặc /login
            // }, 2000);
        } else {
            setError(
                new Error(
                    response.data.message || "Đã xảy ra lỗi không xác định."
                )
            );
        }
        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                {/* Nếu chưa đăng nhập, hiển thị thông báo hoặc chuyển hướng */}
                {!currentUser ? (
                    <div className="text-center text-red-500">
                        Bạn cần đăng nhập để đổi mật khẩu. <br />
                        <button
                            onClick={() => navigate("/login")}
                            className="text-primary hover:underline mt-2"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                ) : (
                    <ChangePasswordForm
                        userId={userId}
                        onPasswordChange={handlePasswordChange}
                        isLoading={isLoading}
                        error={error}
                        successMessage={successMessage}
                    />
                )}
            </div>
        </div>
    );
};

export default ChangePasswordPage;
