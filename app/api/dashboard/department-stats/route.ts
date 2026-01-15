import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({
        data: [
            {
                department: "영업팀",
                emissions: 2340,
                budget: 3000,
                utilizationRate: 78,
                trend: -12,
                trendDirection: "down"
            },
            {
                department: "개발팀",
                emissions: 1890,
                budget: 3000,
                utilizationRate: 63,
                trend: 5,
                trendDirection: "up"
            },
            {
                department: "인사팀",
                emissions: 850,
                budget: 1200,
                utilizationRate: 71,
                trend: -2,
                trendDirection: "down"
            },
            {
                department: "마케팅팀",
                emissions: 1450,
                budget: 2000,
                utilizationRate: 72,
                trend: 8,
                trendDirection: "up"
            }
        ]
    });
}
