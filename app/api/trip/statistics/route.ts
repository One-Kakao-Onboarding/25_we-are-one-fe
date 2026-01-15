
import { NextResponse } from "next/server";
import { MockDBAccessor } from "@/lib/mock-db";

export const dynamic = 'force-dynamic';

export async function GET() {
    const db = MockDBAccessor.getInstance();
    const stats = db.getStats();

    return NextResponse.json(stats);
}
