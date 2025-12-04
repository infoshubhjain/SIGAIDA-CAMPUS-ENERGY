import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
    try {
        // Call your Python script and get the last date
        const result = execSync('python3 path/to/predicting.py --get-last-date', { encoding: 'utf-8' });
        const lastDate = result.trim(); // e.g., "2025-12-04"

        return NextResponse.json({ last_date: lastDate });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ last_date: null, error: 'Failed to fetch last date' }, { status: 500 });
    }
}
