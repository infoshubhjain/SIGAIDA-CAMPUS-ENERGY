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
        resolve(NextResponse.json({ error: 'Prediction failed' }, { status: 500 }));
        return;
      }
      try {
        const value = parseFloat(stdout.trim());
        resolve(NextResponse.json({ predicted_pm25: value }));
      } catch (err) {
        resolve(NextResponse.json({ error: 'Invalid prediction output' }, { status: 500 }));
      }
    });
  });
}
