// src/hooks/useDoctors.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import {
    Doctor,
    DoctorAvailabilityUpdateData,
    DoctorReview,
    AddDoctorReviewData,
    CreateDoctorData,
} from "../types";

// Hook to fetch all doctors
export const useDoctors = () => {
    return useQuery<Doctor[], Error>({
        queryKey: ["doctors"],
        queryFn: async () => {
            const response = await axiosClient.get<Doctor[]>("/doctors");
            return response.data;
        },
    });
};

// Hook to fetch a single doctor by ID
export const useDoctorById = (doctorId?: string) => {
    return useQuery<Doctor, Error>({
        queryKey: ["doctor", doctorId],
        queryFn: async () => {
            if (!doctorId) throw new Error("Doctor ID is required");
            const response = await axiosClient.get<Doctor>(
                `/doctors/${doctorId}`
            );
            return response.data;
        },
        enabled: !!doctorId,
    });
};

// Hook to update a doctor's availability
export const useUpdateDoctorAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { availability: { [date: string]: string[] } }, // Backend trả về { availability: ... }
        Error,
        { doctorId: string; availabilityData: DoctorAvailabilityUpdateData }
    >({
        mutationFn: async ({ doctorId, availabilityData }) => {
            const response = await axiosClient.patch<{
                availability: { [date: string]: string[] };
            }>(`/doctors/${doctorId}/availability`, availabilityData);
            return response.data;
        },
        onSuccess: (data, variables) => {
            console.log(
                "Doctor availability updated successfully:",
                data.availability
            );
            queryClient.invalidateQueries({
                queryKey: ["doctor", variables.doctorId],
            });
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
        },
        onError: (error) => {
            console.error("Failed to update doctor availability:", error);
            throw error;
        },
    });
};

// Hook to add a review for a doctor
export const useAddDoctorReview = () => {
    const queryClient = useQueryClient();
    return useMutation<
        DoctorReview, // Backend trả về DoctorReviewDto
        Error,
        { doctorId: string; reviewData: AddDoctorReviewData }
    >({
        mutationFn: async ({ doctorId, reviewData }) => {
            const response = await axiosClient.post<DoctorReview>(
                `/doctors/${doctorId}/reviews`,
                reviewData
            );
            return response.data;
        },
        onSuccess: (newReview, variables) => {
            console.log("Doctor review added successfully:", newReview);
            queryClient.invalidateQueries({
                queryKey: ["doctor", variables.doctorId],
            });
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
        },
        onError: (error) => {
            console.error("Failed to add doctor review:", error);
            throw error;
        },
    });
};

export const useGetDoctorReviews = (doctorId?: string) => {
    return useQuery<DoctorReview[], Error>({
        queryKey: ["doctorReviews", doctorId],
        queryFn: async () => {
            if (!doctorId) throw new Error("Doctor ID is required");
            const response = await axiosClient.get<DoctorReview[]>(
                `/doctors/${doctorId}/reviews`
            );
            return response.data;
        },
        enabled: !!doctorId,
    });
};
export const useCreateDoctor = () => {
    const queryClient = useQueryClient();
    return useMutation<Doctor, Error, CreateDoctorData>({
        mutationFn: async (doctorData) => {
            // IMPORTANT: This assumes a new backend endpoint like /api/admin/doctors
            // If you don't have this, you might need to adjust or use useRegister
            const response = await axiosClient.post<Doctor>(
                "/doctors/create",
                doctorData
            );
            return response.data;
        },
        onSuccess: (newDoctor) => {
            console.log("Doctor created successfully:", newDoctor);
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
            // Also invalidate general user lists if they include doctors
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Failed to create doctor:", error);
            throw error;
        },
    });
};
