// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, LoginData, RegisterData } from "../types";
import { useLogin, useRegister } from "../hooks/useAuth"; // Giả sử hooks này đã có (hooks API)

// Định nghĩa AuthContextType ở đây hoặc trong types.ts
interface AuthContextType {
    currentUser: User | null;
    login: (credentials: LoginData) => Promise<User>;
    register: (userData: RegisterData) => Promise<User>;
    logout: () => void;
    isLoadingAuth: boolean;
    authError: Error | null;
}

// Export AuthContext để useAuth hook có thể import nó
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const loginMutation = useLogin();
    const registerMutation = useRegister();

    useEffect(() => {
        try {
            const currentUserString = localStorage.getItem("currentUser");
            const currentUser = currentUserString
                ? JSON.parse(currentUserString)
                : {};
            if (currentUser) {
                setCurrentUser(currentUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem("currentUser");
        }
    }, []);

    const login = async (credentials: LoginData) => {
        try {
            const user = await loginMutation.mutateAsync(credentials);
            setCurrentUser(user);
            localStorage.setItem("currentUser", JSON.stringify(user));
            return user;
        } catch (error) {
            console.error("Login failed in context:", error);
            throw error;
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            const user = await registerMutation.mutateAsync(userData);
            return user;
        } catch (error) {
            console.error("Register failed in context:", error);
            throw error;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
    };

    const isLoadingAuth = loginMutation.isPending || registerMutation.isPending;
    const authError = loginMutation.error || registerMutation.error;

    const value = {
        currentUser,
        login,
        register,
        logout,
        isLoadingAuth,
        authError,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

// Đã loại bỏ export const useAuth = () => { ... } khỏi đây
