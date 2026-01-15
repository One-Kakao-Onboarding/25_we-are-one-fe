import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({
        data: [
            {
                id: "1",
                title: "2026년 1월 탄소 배출 종합 보고서",
                period: "2026.01.01 - 2026.01.31",
                type: "MONTHLY",
                fileSize: "2.4 MB",
                status: "READY",
                createdAt: "2026-01-14",
                downloadUrl: "#",
                expiresAt: "2026-02-14"
            },
            {
                id: "2",
                title: "2025년 연간 ESG 성과 보고서",
                period: "2025.01.01 - 2025.12.31",
                type: "ANNUAL",
                fileSize: "15.8 MB",
                status: "READY",
                createdAt: "2026-01-10",
                downloadUrl: "#",
                expiresAt: "2026-02-10"
            }
        ]
    });
}
