import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock Data based on Spec
    return NextResponse.json({
        summary: {
            totalEmissions: 7610,
            previousMonthEmissions: 8230,
            trend: -8.5,
            evRatio: 27.6,
            participantCount: 1247,
            totalEmployees: 1500
        },
        vehicleEmissions: {
            EV: 1250,
            Hybrid: 890,
            ICE: 2340,
            total: 4480
        },
        flightEmissions: {
            domestic: 2150,
            international: 1890,
            total: 4040
        },
        logisticsEmissions: {
            taxi: 450,
            quick: 230,
            bike: 0,
            total: 680
        }
    });
}
