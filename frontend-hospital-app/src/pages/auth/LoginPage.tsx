// src/pages/auth/LoginPage.tsx
import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuthContext";

const LoginPage: React.FC = () => {
    const { login, isLoadingAuth, authError, currentUser } = useAuth();
    const navigate = useNavigate();

    // Nếu đã đăng nhập, chuyển hướng về trang chủ hoặc profile
    React.useEffect(() => {
        if (currentUser) {
            navigate(`/profile/${currentUser.id}`, { replace: true });
        }
    }, [currentUser, navigate]);

    const handleLoginSuccess = async (
        email: string,
        password: string,
        role: number
    ) => {
        const user = await login({ email, password, role });
        alert(`Đăng nhập thành công! Chào mừng, ${user.name}`);
        navigate(`/profile/${user.id}`); // Điều hướng sau khi đăng nhập thành công
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md font-pt-sans">
                <LoginForm
                    onLogin={handleLoginSuccess}
                    isLoading={isLoadingAuth}
                    error={authError}
                />
            </div>
        </div>
    );
};

export default LoginPage;
