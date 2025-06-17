// src/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import {
    Appointment,
    CreateAppointmentData,
    UpdateAppointmentStatusData,
    RecordAppointmentOutcomeData,
    PatientReviewInput,
    AppointmentStatus,
    AppointmentOutcomeStatus,
} from "../types";

// Hook to fetch all appointments
export const useAppointments = () => {
    return useQuery<Appointment[], Error>({
        queryKey: ["appointments"],
        queryFn: async () => {
            const response = await axiosClient.get<Appointment[]>(
                "/appointments"
            );
            return response.data;
        },
    });
};

// Hook to fetch a single appointment by ID
export const useAppointmentById = (appointmentId?: string) => {
    return useQuery<Appointment, Error>({
        queryKey: ["appointment", appointmentId],
        queryFn: async () => {
            if (!appointmentId) throw new Error("Appointment ID is required");
            const response = await axiosClient.get<Appointment>(
                `/appointments/${appointmentId}`
            );
            return response.data;
        },
        enabled: !!appointmentId,
    });
};

// Hook to create a new appointment
export const useCreateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation<Appointment, Error, CreateAppointmentData>({
        mutationFn: async (appointmentData) => {
            // Backend CreateAppointmentRequestDto expects doctor as an object { id: string }
            // Frontend CreateAppointmentData already has this structure.
            const response = await axiosClient.post<Appointment>(
                "/appointments",
                appointmentData
            );
            return response.data;
        },
        onSuccess: (newAppointment) => {
            console.log("Appointment created successfully:", newAppointment);
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            // Invalidate specific doctor and patient if needed for UI updates
            queryClient.invalidateQueries({
                queryKey: ["doctor", newAppointment.doctor.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["user", newAppointment.patientId],
            });
        },
        onError: (error) => {
            console.error("Failed to create appointment:", error);
            throw error;
        },
    });
};

// Hook to update an appointment's status (e.g., Scheduled -> Completed, PendingConfirmation, Rejected)
export const useUpdateAppointmentStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Appointment,
        Error,
        { appointmentId: string; data: UpdateAppointmentStatusData }
    >({
        mutationFn: async ({ appointmentId, data }) => {
            let data_int = 0;
            switch (data.status) {
                case AppointmentStatus.Scheduled:
                    data_int = 0;
                    break;
                case AppointmentStatus.Completed:
                    data_int = 1;
                    break;
                case AppointmentStatus.Cancelled:
                    data_int = 2;
                    break;
                case AppointmentStatus.PendingConfirmation:
                    data_int = 3;
                    break;
                default:
                    data_int = 4;
            }
            const response = await axiosClient.patch<Appointment>(
                `/appointments/${appointmentId}`, // PATCH endpoint for general status update
                { status: data_int }
            );
            return response.data;
        },
        onSuccess: (updatedAppointment, variables) => {
            console.log(
                "Appointment status updated successfully:",
                updatedAppointment
            );
            queryClient.invalidateQueries({
                queryKey: ["appointment", variables.appointmentId],
            });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
        onError: (error) => {
            console.error("Failed to update appointment status:", error);
            throw error;
        },
    });
};

// Hook to record appointment outcome (notes, prescription, outcomeStatus)
export const useRecordAppointmentOutcome = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Appointment,
        Error,
        { appointmentId: string; data: RecordAppointmentOutcomeData }
    >({
        mutationFn: async ({ appointmentId, data }) => {
            // Ensure outcomeStatus is provided as per DTO
            let data_int = 0;
            switch (data.outcomeStatus) {
                case AppointmentOutcomeStatus.CompletedWithNotes:
                    data_int = 0;
                    break;
                case AppointmentOutcomeStatus.Incomplete:
                    data_int = 2;
                    break;
                default:
                    data_int = 1;
            }
            const response = await axiosClient.patch<Appointment>(
                `/appointments/${appointmentId}/outcome`, // PATCH endpoint for outcome
                { ...data, outcomeStatus: data_int }
            );
            return response.data;
        },
        onSuccess: (updatedAppointment, variables) => {
            console.log(
                "Appointment outcome recorded successfully:",
                updatedAppointment
            );
            queryClient.invalidateQueries({
                queryKey: ["appointment", variables.appointmentId],
            });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
        onError: (error) => {
            console.error("Failed to record appointment outcome:", error);
            throw error;
        },
    });
};

// Hook to submit a new review for an appointment (patient reviewing the doctor/appointment)
export const useSubmitAppointmentReview = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Appointment, // Backend trả về AppointmentDto sau khi submit review
        Error,
        { appointmentId: string; data: PatientReviewInput }
    >({
        mutationFn: async ({ appointmentId, data }) => {
            const response = await axiosClient.post<Appointment>(
                `/appointments/${appointmentId}/review`, // POST endpoint for review
                data
            );
            return response.data;
        },
        onSuccess: (updatedAppointment, variables) => {
            console.log(
                "Appointment review submitted successfully:",
                updatedAppointment
            );
            queryClient.invalidateQueries({
                queryKey: ["appointment", variables.appointmentId],
            });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            if (updatedAppointment.doctor?.id) {
                queryClient.invalidateQueries({
                    queryKey: ["doctor", updatedAppointment.doctor.id],
                });
                queryClient.invalidateQueries({ queryKey: ["doctors"] });
            }
        },
        onError: (error) => {
            console.error("Failed to submit appointment review:", error);
            throw error;
        },
    });
};

// Hook to update an existing review for an appointment
export const useUpdateAppointmentReview = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Appointment, // Backend trả về AppointmentDto sau khi update review
        Error,
        { appointmentId: string; data: PatientReviewInput }
    >({
        mutationFn: async ({ appointmentId, data }) => {
            const response = await axiosClient.patch<Appointment>(
                `/appointments/${appointmentId}/review`, // PATCH endpoint for review update
                data
            );
            return response.data;
        },
        onSuccess: (updatedAppointment, variables) => {
            console.log(
                "Appointment review updated successfully:",
                updatedAppointment
            );
            queryClient.invalidateQueries({
                queryKey: ["appointment", variables.appointmentId],
            });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            if (updatedAppointment.doctor?.id) {
                queryClient.invalidateQueries({
                    queryKey: ["doctor", updatedAppointment.doctor.id],
                });
                queryClient.invalidateQueries({ queryKey: ["doctors"] });
            }
        },
        onError: (error) => {
            console.error("Failed to update appointment review:", error);
            throw error;
        },
    });
};

// NEW: Hook to cancel an appointment
export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Appointment, // Assuming backend returns the updated appointment
        Error,
        string // Only need appointmentId to cancel
    >({
        mutationFn: async (appointmentId) => {
            // This reuses the PATCH /api/appointments/{appointmentId} endpoint
            // by setting the status to Cancelled.
            const data: UpdateAppointmentStatusData = {
                status: AppointmentStatus.Cancelled,
            };
            const response = await axiosClient.delete<Appointment>(
                `/appointments/${appointmentId}`,
                { data }
            );
            return response.data;
        },
        onSuccess: (cancelledAppointment, variables) => {
            console.log(
                "Appointment cancelled successfully:",
                cancelledAppointment
            );
            queryClient.invalidateQueries({
                queryKey: ["appointment", variables],
            }); // Invalidate specific appointment
            queryClient.invalidateQueries({ queryKey: ["appointments"] }); // Invalidate all appointments
        },
        onError: (error) => {
            console.error("Failed to cancel appointment:", error);
            throw error;
        },
    });
};
