
export const mockTrips = [
    {
        id: "1",
        type: "TRAIN",
        date: "2024-03-15",
        departure: "서울역",
        arrival: "부산역",
        distance: 325.0,
        emission: 9.8,
        hasReceipt: true,
    },
    {
        id: "2",
        type: "BUS",
        date: "2024-03-12",
        departure: "강남터미널",
        arrival: "세종청사",
        distance: 120.5,
        emission: 7.2,
        hasReceipt: false,
    },
    {
        id: "3",
        type: "FLIGHT",
        date: "2024-02-28",
        departure: "김포공항",
        arrival: "제주공항",
        distance: 450.0,
        emission: 94.5,
        hasReceipt: true,
    },
    {
        id: "4",
        type: "TRAIN",
        date: "2024-02-10",
        departure: "수서역",
        arrival: "동대구역",
        distance: 237.0,
        emission: 7.1,
        hasReceipt: true,
    },
    {
        id: "5",
        type: "BUS",
        date: "2024-01-25",
        departure: "동서울",
        arrival: "강릉",
        distance: 180.0,
        emission: 10.8,
        hasReceipt: false,
    },
];

export const mockActivities = [
    // Commute (5 items as requested)
    { id: 'CM-001', employee: '김철수', date: '2026-01-14', method: '친환경', type: '대중교통', distance: '-', emission: '0', points: 300, category: 'commute' },
    { id: 'CM-002', employee: '이영희', date: '2026-01-14', method: '자가용', type: '하이브리드', distance: '15.2 km', emission: '2.1', points: 0, category: 'commute' },
    { id: 'CM-003', employee: '박민수', date: '2026-01-13', method: '친환경', type: '전기차', distance: '12.0 km', emission: '0', points: 300, category: 'commute' },
    { id: 'CM-004', employee: '최지은', date: '2026-01-13', method: '자가용', type: '내연기관', distance: '18.5 km', emission: '3.1', points: 0, category: 'commute' },
    { id: 'CM-005', employee: '정수현', date: '2026-01-12', method: '친환경', type: '도보', distance: '-', emission: '0', points: 300, category: 'commute' },

    // Business (10 items)
    { id: 'TR-001', employee: '정수현', date: '2026-01-12', method: '비행기', type: '국내선', distance: '350 km', emission: '45.0', points: 0, category: 'business' },
    { id: 'TR-002', employee: '강동원', date: '2026-01-11', method: '기차', type: 'KTX', distance: '325 km', emission: '12.5', points: 0, category: 'business' },
    { id: 'TR-003', employee: '김고은', date: '2026-01-10', method: '비행기', type: '국제선', distance: '1200 km', emission: '150.2', points: 0, category: 'business' },
    { id: 'TR-004', employee: '공유', date: '2026-01-09', method: '법인차', type: '전기차', distance: '45 km', emission: '0', points: 0, category: 'business' },
    { id: 'TR-005', employee: '유재석', date: '2026-01-08', method: '기차', type: 'SRT', distance: '280 km', emission: '10.8', points: 0, category: 'business' },

    // Kakao T (10 items)
    { id: 'KT-001', employee: '최지은', date: '2026-01-12', method: '카카오T', type: '택시', distance: '12.5 km', emission: '3.8', points: 0, category: 'kakaoT' },
    { id: 'KT-002', employee: '김철수', date: '2026-01-11', method: '카카오T', type: '퀵', distance: '8.0 km', emission: '1.2', points: 0, category: 'kakaoT' },
    { id: 'KT-003', employee: '이영희', date: '2026-01-11', method: '카카오T', type: '블루', distance: '15.0 km', emission: '4.5', points: 0, category: 'kakaoT' },
    { id: 'KT-004', employee: '박민수', date: '2026-01-10', method: '카카오T', type: '대리', distance: '22.0 km', emission: '6.2', points: 0, category: 'kakaoT' },
    { id: 'KT-005', employee: '한지민', date: '2026-01-09', method: '카카오T', type: '벤티', distance: '30.0 km', emission: '8.5', points: 0, category: 'kakaoT' },
];

// In-memory store logic
export class MockDB {
    private trips: any[] = [];
    private activities: any[] = [];

    constructor() {
        this.trips = [...mockTrips];
        this.activities = [...mockActivities];
    }

    public getTrips(limit?: number) {
        // Return sorted by date/id descending by default for "recent"
        const sorted = [...this.trips].reverse();
        if (limit) return sorted.slice(0, limit);
        return sorted;
    }

    public getActivities(limit?: number) {
        // Sort by date descending
        const sorted = [...this.activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (limit) return sorted.slice(0, limit);
        return sorted;
    }

    public addTrip(trip: any) {
        const newTrip = {
            ...trip,
            id: Math.random().toString(36).substr(2, 9),
        };
        // Add to end, but getTrips reverses it
        this.trips.push(newTrip);
        return newTrip;
    }

    public getStats() {
        const totalDistance = this.trips.reduce((acc, curr) => acc + (curr.distance || 0), 0);
        const totalEmissions = this.trips.reduce((acc, curr) => acc + (curr.emission || 0), 0);
        return {
            totalDistance,
            totalEmissions,
            tripCount: this.trips.length,
        };
    }
}

// Global declaration for TypeScript
const globalForMockDB = globalThis as unknown as {
    mockDB_v2: MockDB | undefined
}

export const dbInstance = globalForMockDB.mockDB_v2 ?? new MockDB()

if (process.env.NODE_ENV !== 'production') {
    globalForMockDB.mockDB_v2 = dbInstance
}

// Wrapper to maintain similar API usage but pointing to global instance
export const MockDBAccessor = {
    getInstance: () => dbInstance
}

// Deprecated: use MockDBAccessor
export const MockDBStatic = {
    getInstance: () => dbInstance
}
