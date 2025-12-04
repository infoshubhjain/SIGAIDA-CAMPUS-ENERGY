import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET() {
  return new Promise((resolve) => {
    exec('python ../path_to_predicting/predicting.py', (error, stdout, stderr) => {
      if (error) {
        console.error('Python error:', stderr);
        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
        return;
      }
      try {
        const value = parseFloat(stdout);
        resolve(NextResponse.json({ predicted_pm25: value }));
      } catch (err) {
        resolve(NextResponse.json({ error: err }, { status: 500 }));
      }
    });
  });
}
