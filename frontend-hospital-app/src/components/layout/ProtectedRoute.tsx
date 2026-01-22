// src/components/layout/ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[]; // Mảng các vai trò được phép
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { currentUser, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return <LoadingSpinner />; // Hoặc một component loading toàn màn hình
    }

    if (!currentUser) {
        // Chưa đăng nhập, chuyển hướng đến trang đăng nhập
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(currentUser.type)) {
            // Không có quyền, chuyển hướng đến trang không có quyền truy cập hoặc trang chủ
            // Bạn có thể tạo một trang UnauthorizedPage riêng
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
