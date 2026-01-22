// src/hooks/useSpecialties.ts (hoặc file chứa hook này)
import { useQuery } from "@tanstack/react-query";
import { Specialty } from "../types"; // Định nghĩa type Specialty nếu cần: interface Specialty { id: string; name: string; }
import axiosClient from "../api/axiosClient";

export const useSpecialties = () => {
    return useQuery<Specialty[], Error>({
        queryKey: ["specialties"],
        queryFn: async () => {
            const response = await axiosClient.get<string[]>("/specialties"); // Giả sử API trả về string[]
            // Biến đổi dữ liệu ở đây
            return response.data.map((specialtyName) => ({
                id: specialtyName, // Sử dụng tên làm ID
                name: specialtyName, // Sử dụng tên làm Name
            }));
        }
    });
};
