import { apiClient } from "../api/client";

export interface User {
    id: number;
    username: string;
    name: string;
    role: "EMPLOYEE" | "CONSULTANT";
    employeeId?: string;
    department?: string;
    companyId?: string | null;
}

interface LoginResponse {
    status: string;
    message: string;
    user: User;
}

interface UserResponse {
    status?: string;
    message?: string;
    // API returns user fields directly for /me endpoint
    id?: number;
    username?: string;
    name?: string;
    role?: "EMPLOYEE" | "CONSULTANT";
    employeeId?: string;
    department?: string;
    companyId?: string | null;
}


export const authService = {
    login: async (username: string, password: string) => {
        return apiClient.post<LoginResponse>("/api/auth/login", { username, password });
    },

    logout: async () => {
        return apiClient.post<{ status: string; message: string }>("/api/auth/logout");
    },

    getMe: async () => {
        // The API spec says /me returns the user object directly, or an error object.
        return apiClient.get<User>("/api/auth/me");
    },
};
