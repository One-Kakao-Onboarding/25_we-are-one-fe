
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response with high confidence data
    const mockAnalysis = {
        status: "success",
        data: {
            confidence: 0.98,
            extractedData: {
                date: "2024-03-20",
                departure: "서울역",
                arrival: "동대구역",
                distance: 293.1, // Approximate distance mockup
                transportationType: "TRAIN", // Matches the frontend type
                amount: 42500,
                merchantName: "코레일(KORAIL)"
            }
        }
    };

    return NextResponse.json(mockAnalysis);
}
