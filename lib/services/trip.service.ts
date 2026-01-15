import { apiClient } from "../api/client";

export interface TripRecord {
    id?: string;
    type: "TRAIN" | "FLIGHT" | "BUS";
    date: string;
    departure: string;
    arrival: string;
    distance: number;
    emission: number;
    hasReceipt?: boolean;
}

export interface TripStats {
    totalDistance: number;
    totalEmissions: number;
    tripCount: number;
}

export interface TripResponse {
    id: string;
    status: string;
    message: string;
}

export const tripService = {
    // Register a new trip
    register: async (data: TripRecord) => {
        return apiClient.post<TripResponse>("/api/trip/register", data);
    },

    // Get trip history
    getHistory: async (limit: number = 5) => {
        return apiClient.get<TripRecord[]>("/api/trip/history", {
            params: { limit }
        });
    },

    // Get statistics
    getStats: async (period: 'month' | 'year' = 'month') => {
        return apiClient.get<TripStats>("/api/trip/statistics", {
            params: { period }
        });
    },

    // Analyze receipt (Upload)
    analyzeReceipt: async (file: File) => {
        const formData = new FormData();
        formData.append("receipt", file);

        // Use raw fetch or client that supports FormData correctly
        return apiClient.upload<any>("/api/receipt/upload", formData);
    },

    // Confirm receipt data
    confirmReceipt: async (data: any) => {
        return apiClient.post<any>("/api/receipt/confirm", data);
    }
};
