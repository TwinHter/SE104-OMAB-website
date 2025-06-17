// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import axiosClient from "../api/axiosClient";
import { LoginData, RegisterData, User } from "../types";

export const useLogin = () => {
    const queryClient = useQueryClient(); // Get query client to clear cache on login/logout
    return useMutation<User, Error, LoginData>({
        mutationFn: async (credentials) => {
            const response = await axiosClient.post<User>(
                "/auth/login",
                credentials
            );
            return response.data;
        },
        onSuccess: (user) => {
            console.log("Login successful!", user);
            // Example: Store user info/token in localStorage or a global state manager
            // localStorage.setItem('user', JSON.stringify(user));
            // localStorage.setItem('token', 'your_jwt_token_here_if_applicable'); // If backend returns a token

            // Invalidate all queries to ensure fresh data for the logged-in user
            queryClient.invalidateQueries();
        },
        onError: (error) => {
            console.error("Login failed:", error);
            throw error;
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation<User, Error, RegisterData>({
        mutationFn: async (userData) => {
            const response = await axiosClient.post<User>(
                "/auth/register",
                userData
            );
            return response.data;
        },
        onSuccess: () => {
            console.log("Registration successful!");
            queryClient.invalidateQueries(); // Invalidate all queries
        },
        onError: (error) => {
            console.error("Registration failed:", error);
            throw error;
        },
    });
};

// NEW: Hook for Logout
export const useChangePassword = () => {
    const queryClient = useQueryClient();
    return useMutation<
        unknown,
        Error,
        { userId: string; currentPassword: string; newPassword: string }
    >({
        mutationFn: async ({ userId, currentPassword, newPassword }) => {
            const response = await axiosClient.post("/auth/change-password", {
                userId,
                currentPassword,
                newPassword,
                confirmNewPassword: newPassword, // Assuming backend requires this field
            });
            return response.data; // This will be { message: "Password changed successfully" }
        },
        onSuccess: () => {
            console.log("Password changed successfully from backend API.");
            // Optionally, you can clear the user session or redirect
            // For example, you might want to log out the user after changing password
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            queryClient.clear(); // Clear all queries if needed
            window.location.href = "/login"; // Redirect to login page
        },
        onError: (error) => {
            console.error("Change password failed:", error);
            // Handle error, e.g., show a notification or alert
            throw error; // Re-throw error to be handled by the component
        },
    });
};
export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, void>({
        // Backend returns a simple message object, so 'any' is fine, or define a LogoutResponseDto if needed
        mutationFn: async () => {
            const response = await axiosClient.post("/auth/logout");
            return response.data; // This will be { message: "Logged out successfully" }
        },
        onSuccess: () => {
            console.log("Logged out successfully from backend API.");

            // Frontend logout logic:
            // 1. Clear authentication token/session from localStorage/sessionStorage
            localStorage.removeItem("user");
            localStorage.removeItem("token"); // Assuming you store a token

            // 2. Clear any user-related state in your application (e.g., set current user to null)
            // Example if using a global context: authContext.setUser(null);

            // 3. Clear the entire React Query cache for the current user
            // This is crucial to prevent stale data from being shown to a new user
            queryClient.clear(); // Clears all queries in the cache

            // 4. Redirect to login page or home page
            // Example using react-router-dom: navigate('/login');
            window.location.href = "/login"; // Or use your router's navigate function
        },
        onError: (error) => {
            console.error("Logout failed:", error);
            // Even if API call fails, you might still want to clear local storage
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            queryClient.clear();
            window.location.href = "/login";
            throw error;
        },
    });
};
