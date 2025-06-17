// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";
import {
    User,
    UpdateUserData,
    Notification,
    CreateNotificationData,
    UserRole,
} from "../types";

// Hook to fetch a single user by ID (assuming there's a GET /api/users/{userId} endpoint)
export const useUserById = (userId?: string) => {
    return useQuery<User, Error>({
        queryKey: ["user", userId],
        queryFn: async () => {
            if (!userId) throw new Error("User ID is required");
            const response = await axiosClient.get<User>(`/users/${userId}`);
            return response.data;
        },
        enabled: !!userId, // Only run query if userId is available
    });
};

// Hook to update a user's profile
export const updateDoctor = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queryClient = useQueryClient();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation<User, Error, { userId: string; data: UpdateUserData }>({
        mutationFn: async ({ userId, data }) => {
            const response = await axiosClient.post<User>(
                `/doctors/update/${userId}`,
                data
            );
            return response.data;
        },
        onSuccess: (updatedUser, variables) => {
            console.log("Doctor updated successfully:", updatedUser);
            queryClient.invalidateQueries({
                queryKey: ["doctor", variables.userId],
            });
            // Invalidate the user query as well
            queryClient.invalidateQueries({
                queryKey: ["user", variables.userId],
            });
        },
        onError: (error) => {
            console.error("Failed to update doctor:", error);
            throw error;
        },
    });
};
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<User, Error, { userId: string; data: UpdateUserData }>({
        mutationFn: async ({ userId, data }) => {
            const response = await axiosClient.patch<User>(
                `/users/${userId}`,
                data
            );
            return response.data;
        },
        onSuccess: (updatedUser, variables) => {
            console.log("User updated successfully:", updatedUser);
            queryClient.invalidateQueries({
                queryKey: ["user", variables.userId],
            });
            // If the updated user is a doctor, invalidate doctor-related queries too
            if (updatedUser.type === 1) {
                // UserRole.Doctor = 1
                queryClient.invalidateQueries({
                    queryKey: ["doctor", updatedUser.id],
                });
                queryClient.invalidateQueries({ queryKey: ["doctors"] });
            }
        },
        onError: (error) => {
            console.error("Failed to update user:", error);
            throw error;
        },
    });
};

// Hook to fetch user notifications
export const useNotifications = (userId?: string) => {
    return useQuery<Notification[], Error>({
        queryKey: ["notifications", userId],
        queryFn: async () => {
            if (!userId)
                throw new Error("User ID is required for notifications");
            const response = await axiosClient.get<Notification[]>(
                `/users/${userId}/notifications`
            );
            return response.data;
        },
        enabled: !!userId,
    });
};

// Hook to create a new user notification
export const useCreateNotification = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Notification,
        Error,
        { userId: string; data: CreateNotificationData }
    >({
        mutationFn: async ({ userId, data }) => {
            const response = await axiosClient.post<Notification>(
                `/users/${userId}/notifications`,
                data
            );
            return response.data;
        },
        onSuccess: (newNotification, variables) => {
            console.log("Notification created successfully:", newNotification);
            queryClient.invalidateQueries({
                queryKey: ["notifications", variables.userId],
            });
        },
        onError: (error) => {
            console.error("Failed to create notification:", error);
            throw error;
        },
    });
};

// Hook to mark a notification as read (assuming PATCH /users/{userId}/notifications/{notificationId} for this)
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Notification,
        Error,
        { userId: string; notificationId: string }
    >({
        mutationFn: async ({ userId, notificationId }) => {
            // Assuming backend supports PATCH to update notification status
            const response = await axiosClient.patch<Notification>(
                `/users/${userId}/notifications/${notificationId}`,
                { isRead: true } // Assuming 'isRead' is the field to update
            );
            return response.data;
        },
        onSuccess: (updatedNotification, variables) => {
            console.log("Notification marked as read:", updatedNotification);
            queryClient.invalidateQueries({
                queryKey: ["notifications", variables.userId],
            });
        },
        onError: (error) => {
            console.error("Failed to mark notification as read:", error);
            throw error;
        },
    });
};

// Hook to delete a notification
export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { userId: string; notificationId: string }>(
        {
            mutationFn: async ({ userId, notificationId }) => {
                await axiosClient.delete(
                    `/users/${userId}/notifications/${notificationId}`
                );
            },
            onSuccess: (_, variables) => {
                console.log(
                    "Notification deleted successfully:",
                    variables.notificationId
                );
                queryClient.invalidateQueries({
                    queryKey: ["notifications", variables.userId],
                });
            },
            onError: (error) => {
                console.error("Failed to delete notification:", error);
                throw error;
            },
        }
    );
};
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        // Input is just the userId
        mutationFn: async (userId) => {
            await axiosClient.delete(`/users/${userId}`); // Assuming DELETE /api/users/{userId}
        },
        onSuccess: (_, userId) => {
            console.log(`User with ID ${userId} deleted successfully.`);
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
            queryClient.invalidateQueries({ queryKey: ["doctors"] }); // If a doctor was deleted
            queryClient.invalidateQueries({ queryKey: ["patients"] }); // If a patient was deleted
            queryClient.invalidateQueries({ queryKey: ["users"] }); // If you have a general 'users' list
        },
        onError: (error) => {
            console.error("Failed to delete user:", error);
            throw error;
        },
    });
};
export const useUsersByRole = (role?: UserRole) => {
    return useQuery<User[], Error>({
        queryKey: ["users", { role }], // Query key includes the role to differentiate caches
        queryFn: async () => {
            const url = `/users/role/${role}`;
            const response = await axiosClient.get<User[]>(url);
            return response.data;
        },
        // Only enable if role is defined OR if you want to fetch all users when role is undefined
        // If you only want to fetch when a specific role is passed, change to: enabled: role !== undefined,
        // For now, it will fetch all users if role is undefined, and filtered if role is defined.
        enabled: true, // Always enabled, but if role is undefined, it fetches all.
    });
};
