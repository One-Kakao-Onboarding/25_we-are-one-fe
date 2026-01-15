import { apiClient } from "../api/client";

export interface CommuteRecord {
    date: string;
    usedCar: boolean;
    vehicleType: "EV" | "HYBRID" | "ICE" | null;
    distance: number;
    emissions: number;
}

export interface CommuteResponse {
    id: string;
    status: string;
    message: string;
    createdAt: string;
    totalEmissions: number;
}

export interface CommuteStats {
    carDays: number;
    totalDays: number;
    carPercentage: number;
    totalEmissions: number;
    avgEmissions: number;
    trend: number;
}

export const commuteService = {
    checkIn: async (data: CommuteRecord) => {
        return apiClient.post<CommuteResponse>("/api/commute/check-in", data);
    },

    getHistory: async (startDate?: string, endDate?: string, limit?: number) => {
        return apiClient.get<{ data: CommuteRecord[]; stats: any }>("/api/commute/history", {
            params: { startDate, endDate, limit },
        });
    },

    getStats: async (period: 'month' | 'year' = 'month') => {
        return apiClient.get<CommuteStats>("/api/commute/statistics", {
            params: { period },
        });
    },
};
