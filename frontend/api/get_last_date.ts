import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';

export async function GET() {
    return new Promise((resolve) => {
        const pythonPath = join(process.cwd(), '..', 'ml_models', 'predicting.py');
        const python = spawn('python3', [pythonPath]);

        let stdout = '';
        let stderr = '';

        python.stdout?.on('data', (data) => {
            stdout += data.toString();
        });

        python.stderr?.on('data', (data) => {
            stderr += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                console.error('Python error:', stderr);
                resolve(NextResponse.json({ last_date: null, error: 'Failed to fetch last date' }, { status: 500 }));
                return;
            }
            try {
                const lastDate = stdout.trim();
                resolve(NextResponse.json({ last_date: lastDate }));
            } catch (err) {
                resolve(NextResponse.json({ last_date: null, error: 'Invalid output format' }, { status: 500 }));
            }
        });
    });
}
