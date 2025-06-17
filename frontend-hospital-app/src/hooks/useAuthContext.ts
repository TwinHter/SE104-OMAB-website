// src/hooks/useAuthContext.ts
import { useContext } from "react";

// Import AuthContext từ file riêng của nó
// Vì AuthContext không phải là một component, nó sẽ được export từ AuthContext.tsx
// Chúng ta cần một chút điều chỉnh ở AuthContext.tsx để export nó
// Tạm thời, giả định AuthContext được export từ AuthContext.tsx
// Sẽ có chỉnh sửa nhỏ ở AuthContext.tsx để làm điều này.

// Để tránh lỗi vòng lặp phụ thuộc nếu AuthContext cũng cần useAuthContext,
// chúng ta sẽ định nghĩa AuthContextType ở một file riêng (vd: types.ts hoặc contexts/AuthContext.d.ts)
// Hoặc chỉ import type ở đây.

// CÁCH 1: Giả sử AuthContext cũng được export từ AuthContext.tsx
// (Bạn sẽ cần thêm `export const AuthContext = createContext<AuthContextType | undefined>(undefined);` vào AuthContext.tsx)
import { AuthContext } from "../contexts/AuthContext"; // <--- Sẽ cần export AuthContext từ file AuthContext.tsx

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
