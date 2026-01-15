import { apiClient } from "../api/client";
import { MockDBAccessor } from "../mock-db";

export interface DashboardSummary {
    totalEmissions: number;
    previousMonthEmissions: number;
    trend: number;
    evRatio: number;
    participantCount: number;
    totalEmployees: number;
}

export interface VehicleEmissions {
    EV: number;
    Hybrid: number;
    ICE: number;
    total: number;
}

export interface FlightEmissions {
    domestic: number;
    international: number;
    total: number;
}

export interface LogisticsEmissions {
    taxi: number;
    quick: number;
    bike: number;
    total: number;
}

export interface DashboardOverview {
    summary: DashboardSummary;
    vehicleEmissions: VehicleEmissions;
    flightEmissions: FlightEmissions;
    logisticsEmissions: LogisticsEmissions;
    yearlyTrend?: YearlyTrendItem[];
    yearlyComparison?: YearlyComparison;
    monthlyCumulative?: MonthlyCumulativeItem[];
    recentActivities?: ActivityItem[];
}

export interface MonthlyTrendItem {
    month: string;
    commute: number;
    business: number;
    logistics: number;
    total: number;
}

export interface KakaoTRecord {
    id: string;
    date: string;
    type: string;
    vehicleType: string;
    distance: number;
    emissions: number;
    route: string;
    department: string;
}

export interface DepartmentStat {
    department: string;
    emissions: number;
    budget: number;
    utilizationRate: number;
    trend: number;
    trendDirection: 'up' | 'down';
}

export interface YearlyTrendItem {
    year: string;
    commute: number;
    businessType: number;
    logistics: number;
    target: number;
}

export interface YearlyComparison {
    baseYear: string;
    targetYear: string;
    reductionRate: number;
    baseEmission: number;
    targetEmission: number;
    savedEmission: number;
}

export interface MonthlyCumulativeItem {
    month: string;
    commute: number;
    businessType: number;
    logistics: number;
    target: number;
    cumulativeTarget: number;
    cumulativeLiteral: number;
}

export interface ActivityItem {
    id: string;
    employee: string;
    date: string;
    method: string;
    type: string;
    distance: string;
    emission: string;
    points: number;
    category?: 'commute' | 'business' | 'kakaoT'; // Added for filtering
}

// ... existing code ...
const recentActivities: ActivityItem[] = MockDBAccessor.getInstance().getActivities(20) as any;
export interface ReportItem {
    id: string;
    title: string;
    period: string;
    type: string;
    fileSize: string;
    status: 'READY' | 'GENERATING' | 'FAILED';
    createdAt: string;
    downloadUrl: string;
    expiresAt: string;
}

export const dashboardService = {
    // 4.1 Overview
    getOverview: async (period: string = 'month') => {
        const res = await apiClient.get<DashboardOverview>("/api/dashboard/overview", { params: { period } });

        // Enhance with Chart Data (Mocking here for UI dev)
        const summary = {
            ...res.summary,
            totalEmissions: 1570,
            previousMonthEmissions: 1715,
            trend: -8.5,           // 8.5% improvement
            evRatio: 27.9,         // EV Usage
            participantCount: 1247,// Participants
            totalEmployees: 1500
        };

        const yearlyTrend: YearlyTrendItem[] = [
            { year: '2019', commute: 12000, businessType: 8000, logistics: 5000, target: 26000 },
            { year: '2020', commute: 11000, businessType: 4000, logistics: 4800, target: 24500 },
            { year: '2021', commute: 10500, businessType: 4500, logistics: 5200, target: 23000 },
            { year: '2022', commute: 9800, businessType: 7000, logistics: 5500, target: 21500 },
            { year: '2023', commute: 9200, businessType: 7500, logistics: 5100, target: 20000 },
            { year: '2024', commute: 8500, businessType: 6000, logistics: 4800, target: 18500 },
            { year: '2025', commute: 7000, businessType: 5000, logistics: 4000, target: 17000 },
            { year: '2026', commute: 5500, businessType: 4000, logistics: 3500, target: 15500 }, // Current Year Projection
        ];

        const yearlyComparison: YearlyComparison = {
            baseYear: '2019년',
            targetYear: '2026년',
            reductionRate: 48.0, // Calculated roughly: (25000-13000)/25000 = 48%
            baseEmission: 25000,
            targetEmission: 13000,
            savedEmission: 12000
        };

        const monthlyCumulative: MonthlyCumulativeItem[] = [
            { month: '1월', commute: 200, businessType: 300, logistics: 100, target: 1000, cumulativeTarget: 1000, cumulativeLiteral: 600 },
            { month: '2월', commute: 400, businessType: 500, logistics: 200, target: 1000, cumulativeTarget: 2500, cumulativeLiteral: 1500 },
            { month: '3월', commute: 600, businessType: 800, logistics: 300, target: 1000, cumulativeTarget: 4000, cumulativeLiteral: 2800 },
            { month: '4월', commute: 850, businessType: 1100, logistics: 450, target: 1000, cumulativeTarget: 5500, cumulativeLiteral: 4000 },
            { month: '5월', commute: 1100, businessType: 1500, logistics: 600, target: 1000, cumulativeTarget: 7000, cumulativeLiteral: 5500 },
            { month: '6월', commute: 1300, businessType: 1800, logistics: 800, target: 1000, cumulativeTarget: 8500, cumulativeLiteral: 7200 },
            { month: '7월', commute: 1500, businessType: 2200, logistics: 1000, target: 1000, cumulativeTarget: 10000, cumulativeLiteral: 8900 },
            { month: '8월', commute: 1700, businessType: 2500, logistics: 1200, target: 1000, cumulativeTarget: 11500, cumulativeLiteral: 10500 },
            { month: '9월', commute: 1950, businessType: 2800, logistics: 1400, target: 1000, cumulativeTarget: 13000, cumulativeLiteral: 12100 },
            { month: '10월', commute: 2200, businessType: 3100, logistics: 1600, target: 1000, cumulativeTarget: 14500, cumulativeLiteral: 13800 },
            { month: '11월', commute: 2400, businessType: 3400, logistics: 1800, target: 1000, cumulativeTarget: 16000, cumulativeLiteral: 15400 },
            { month: '12월', commute: 2600, businessType: 3700, logistics: 2100, target: 1000, cumulativeTarget: 17500, cumulativeLiteral: 16900 },
        ];

        const recentActivities: ActivityItem[] = MockDBAccessor.getInstance().getActivities(30) as any;

        return {
            ...res,
            summary, // Override API summary with our enriched mock summary
            yearlyTrend,
            yearlyComparison,
            monthlyCumulative,
            recentActivities
        };
    },

    // 4.1 Overview Wrap for API consistency if needed, but we override above.
    getOverviewRaw: async (period: string = 'month') => {
        return apiClient.get<DashboardOverview>("/api/dashboard/overview", { params: { period } });
    },

    // 4.2 Monthly Trend
    getMonthlyTrend: async (startMonth?: string, endMonth?: string) => {
        return apiClient.get<{ data: MonthlyTrendItem[] }>("/api/dashboard/monthly-trend", {
            params: { startMonth, endMonth }
        });
    },

    // 4.4 Kakao T Data
    getKakaoTData: async (params?: { startDate?: string, endDate?: string, department?: string, limit?: number }) => {
        return apiClient.get<{ data: KakaoTRecord[], pagination: any }>("/api/dashboard/kakao-t-data", { params });
    },

    // 4.3 Sync Kakao T
    syncKakaoT: async () => {
        return apiClient.post<{ status: string, message: string }>("/api/dashboard/sync-kakao-t");
    },

    // 4.5 Department Stats
    getDepartmentStats: async (period: string = 'month') => {
        return apiClient.get<{ data: DepartmentStat[] }>("/api/dashboard/department-stats", { params: { period } });
    },

    // 5.1 Report List
    getReports: async (type?: string, status?: string) => {
        return apiClient.get<{ data: ReportItem[] }>("/api/reports/list", { params: { type, status } });
    }
};
