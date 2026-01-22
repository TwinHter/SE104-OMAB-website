// src/pages/auth/RegisterPage.tsx
import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuthContext";

const RegisterPage: React.FC = () => {
    const { register, isLoadingAuth, authError, currentUser } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (currentUser) {
            navigate(`/profile/${currentUser.id}`, { replace: true });
        }
    }, [currentUser, navigate]);

    const handleRegisterSuccess = async (
        name: string,
        email: string,
        password: string,
        role: number
    ) => {
        await register({ name, email, password, role });
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login"); // Chuyển hướng về trang đăng nhập
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md font-pt-sans">
                <RegisterForm
                    onRegister={handleRegisterSuccess}
                    isLoading={isLoadingAuth}
                    error={authError}
                />
            </div>
        </div>
    );
};

export default RegisterPage;
