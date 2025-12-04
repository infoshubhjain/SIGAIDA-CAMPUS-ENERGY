import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET() {
    return new Promise((resolve) => {
        // Adjust the path to your Python script for CO2 prediction
        exec('python ../path_to_predicting/predict_co2.py', (error, stdout, stderr) => {
            if (error) {
                console.error('Python error:', stderr);
                resolve(NextResponse.json({ error: stderr }, { status: 500 }));
                return;
            }
            try {
                // Assume your script prints a s    ingle float value
                const value = parseFloat(stdout);
                resolve(NextResponse.json({ predicted_co2: value }));
            } catch (err) {
                resolve(NextResponse.json({ error: err }, { status: 500 }));
            }
        });
    });
}
