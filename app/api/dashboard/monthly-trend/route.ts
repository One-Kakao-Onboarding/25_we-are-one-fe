import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({
        data: [
            {
                month: "2025-08",
                commute: 3050,
                business: 1900,
                logistics: 700,
                total: 5650
            },
            {
                month: "2025-09",
                commute: 3100,
                business: 1850,
                logistics: 680,
                total: 5630
            },
            {
                month: "2025-10",
                commute: 3200,
                business: 1800,
                logistics: 650,
                total: 5650
            },
            {
                month: "2025-11",
                commute: 3100,
                business: 2000,
                logistics: 600,
                total: 5700
            },
            {
                month: "2025-12",
                commute: 2900,
                business: 2200,
                logistics: 800,
                total: 5900
            },
            {
                month: "2026-01",
                commute: 2800,
                business: 2100,
                logistics: 750,
                total: 5650
            }
        ]
    });
}
