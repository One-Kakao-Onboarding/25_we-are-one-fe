
import { NextResponse } from "next/server";
import { MockDBAccessor } from "@/lib/mock-db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = MockDBAccessor.getInstance();

        // Simple validation could go here

        const newTrip = db.addTrip(body);

        return NextResponse.json({
            success: true,
            data: newTrip
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to register trip" },
            { status: 500 }
        );
    }
}
