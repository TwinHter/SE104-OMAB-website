// src/hooks/useRelatives.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import {
    Relative,
    CreateRelativeData,
    UpdateRelativeData,
    RelativeListResponse,
} from "../types";

// Hook to fetch relatives for a specific user
// Assuming the endpoint is something like /api/users/{userId}/relatives
export const useRelatives = (userId?: string) => {
    return useQuery<Relative[], Error>({
        queryKey: ["relatives", userId],
        queryFn: async () => {
            if (!userId)
                throw new Error("User ID is required to fetch relatives.");
            const response = await axiosClient.get<RelativeListResponse>(
                `/users/${userId}/relatives`
            );
            return response.data.relatives; // Backend returns RelativeListDto which contains a list of RelativeDto
        },
        enabled: !!userId, // Only run the query if userId is truthy
    });
};

// Hook to create a new relative for a user
export const useCreateRelative = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Relative,
        Error,
        { userId: string; data: CreateRelativeData }
    >({
        mutationFn: async ({ userId, data }) => {
            const response = await axiosClient.post<Relative>(
                `/users/${userId}/relatives`,
                data
            );
            return response.data;
        },
        onSuccess: (newRelative, variables) => {
            console.log("Relative created successfully:", newRelative);
            queryClient.invalidateQueries({
                queryKey: ["relatives", variables.userId],
            });
        },
        onError: (error) => {
            console.error("Failed to create relative:", error);
            throw error;
        },
    });
};

// Hook to update an existing relative
export const useUpdateRelative = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Relative,
        Error,
        { userId: string; relativeId: string; data: UpdateRelativeData }
    >({
        mutationFn: async ({ userId, relativeId, data }) => {
            const response = await axiosClient.put<Relative>(
                `/users/${userId}/relatives/${relativeId}`,
                data
            );
            return response.data;
        },
        onSuccess: (updatedRelative, variables) => {
            console.log("Relative updated successfully:", updatedRelative);
            queryClient.invalidateQueries({
                queryKey: ["relatives", variables.userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["relative", variables.relativeId],
            }); // If you have a hook to fetch single relative
        },
        onError: (error) => {
            console.error("Failed to update relative:", error);
            throw error;
        },
    });
};

// Hook to delete a relative
export const useDeleteRelative = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { userId: string; relativeId: string }>({
        mutationFn: async ({ userId, relativeId }) => {
            await axiosClient.delete(
                `/users/${userId}/relatives/${relativeId}`
            );
        },
        onSuccess: (_, variables) => {
            console.log("Relative deleted successfully:", variables.relativeId);
            queryClient.invalidateQueries({
                queryKey: ["relatives", variables.userId],
            });
        },
        onError: (error) => {
            console.error("Failed to delete relative:", error);
            throw error;
        },
    });
};
