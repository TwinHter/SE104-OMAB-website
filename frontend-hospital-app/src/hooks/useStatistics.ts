// src/hooks/useStatistics.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import {
    SystemOverviewStatistics,
    DoctorStatisticsOverview,
    User, // Import User type
    Doctor, // Import Doctor type
} from "../types";

// =========================================================================
// ADMIN HOOKS
// =========================================================================

// Hook để lấy thông tin tổng quan cho Admin
export const useAdminOverviewStatistics = () => {
    return useQuery<SystemOverviewStatistics, Error>({
        queryKey: ["adminOverviewStats"],
        queryFn: async () => {
            // Lấy danh sách tất cả bác sĩ
            const doctorsResponse = await axiosClient.get<Doctor[]>("/doctors"); // Gọi API /api/doctors
            const allDoctors = doctorsResponse.data;

            const total_Doctors = allDoctors.length;

            // Tính tổng số lịch hẹn từ tất cả bác sĩ
            const total_Appointments = allDoctors.reduce(
                (sum, doctor) => sum + (doctor.total_Appointments ?? 0), // Sử dụng ?? 0 để an toàn nếu null/undefined
                0
            );

            // Tính tổng số đánh giá từ tất cả bác sĩ
            const total_Reviews = allDoctors.reduce(
                (sum, doctor) => sum + (doctor.reviews?.length ?? 0), // Sử dụng ?? 0 để an toàn nếu null/undefined
                0
            );

            // Lấy danh sách bệnh nhân
            const patientsResponse = await axiosClient.get<User[]>(
                "/users/role/patient"
            );
            console.log("Patients Response:", patientsResponse.data); // Debug log
            const total_Patients = patientsResponse.data.length;
            console.log("Total Patients:", total_Patients); // Debug log

            return {
                total_Doctors,
                total_Patients,
                total_Appointments, // Lấy từ tổng hợp dữ liệu bác sĩ
                total_Reviews, // Lấy từ tổng hợp dữ liệu bác sĩ
            };
        },
    });
};

// =========================================================================
// DOCTOR HOOKS
// =========================================================================

// Hook để lấy thông tin tổng quan cho Bác sĩ (lấy từ API /api/doctors/{doctorId})
export const useDoctorOverviewStatistics = (doctorId: string) => {
    return useQuery<DoctorStatisticsOverview, Error>({
        queryKey: ["doctorOverviewStats", doctorId],
        queryFn: async () => {
            if (!doctorId) {
                throw new Error(
                    "Doctor ID is required to fetch doctor overview statistics."
                );
            }
            // Gọi API lấy thông tin chi tiết bác sĩ
            const response = await axiosClient.get<Doctor>(
                `/doctors/${doctorId}`
            );
            const doctorData = response.data;

            // API đã trả về avg_Rating và total_Appointments
            // Chúng ta cần tính total_Reviews từ mảng reviews
            const total_Reviews = doctorData.reviews?.length ?? 0; // Sử dụng ?? 0 để an toàn

            return {
                avg_Rating: doctorData.avg_Rating ?? 0,
                total_Appointments: doctorData.total_Appointments ?? 0,
                total_Reviews: total_Reviews,
            };
        },
        enabled: !!doctorId, // Chỉ chạy query khi doctorId có giá trị
    });
};

// Các hook thống kê hàng tháng/hàng năm được bỏ qua theo yêu cầu.
// Nếu sau này cần, bạn sẽ phải xem xét cách backend cung cấp dữ liệu này.
