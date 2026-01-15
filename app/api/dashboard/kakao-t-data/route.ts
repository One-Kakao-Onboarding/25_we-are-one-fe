import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({
        data: [
            {
                id: "KT-1",
                date: "2026-01-14 09:23",
                type: "TAXI",
                vehicleType: "EV",
                distance: 12.4,
                emissions: 0,
                route: "강남역 → 판교테크노밸리",
                department: "영업팀"
            },
            {
                id: "KT-2",
                date: "2026-01-14 14:30",
                type: "QUICK",
                vehicleType: "Motorcycle",
                distance: 8.2,
                emissions: 1.2,
                route: "본사 → 파트너사(역삼)",
                department: "개발팀"
            },
            {
                id: "KT-3",
                date: "2026-01-13 18:45",
                type: "TAXI",
                vehicleType: "ICE",
                distance: 15.6,
                emissions: 2.8,
                route: "판교 → 잠실광역환승센터",
                department: "마케팅팀"
            }
        ],
        pagination: {
            total: 3,
            limit: 50,
            offset: 0
        }
    });
}
