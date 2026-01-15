
import { NextResponse } from "next/server";
import { MockDBAccessor } from "@/lib/mock-db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = MockDBAccessor.getInstance();

        // Create a trip record from the confirmed receipt data
        const tripData = {
            type: body.tripType || "TRAIN",
            date: body.date,
            departure: body.departure,
            arrival: body.arrival,
            distance: body.distance,
            emission: body.emissions,
            hasReceipt: true, // This is the key difference
            receiptUrl: body.tempFilePath // storing the ref
        };

        const newTrip = db.addTrip(tripData);

        return NextResponse.json({
            success: true,
            data: newTrip
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to confirm receipt" },
            { status: 500 }
        );
    }
}
