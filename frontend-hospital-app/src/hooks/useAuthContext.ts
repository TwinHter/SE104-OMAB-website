// src/hooks/useAuthContext.ts
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // <--- Sẽ cần export AuthContext từ file AuthContext.tsx

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
