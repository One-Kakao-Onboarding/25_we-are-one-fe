
import { NextResponse } from "next/server";
import { MockDBAccessor } from "@/lib/mock-db";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    const db = MockDBAccessor.getInstance();
    const trips = db.getTrips(limit);

    return NextResponse.json(trips);
}
