'use client';

import dynamic from 'next/dynamic';
import { AirQualityData } from '@/lib/types';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PollutantBarChartProps {
  data: AirQualityData;
}

const pollutants = [
  { key: 'pm10', label: 'PM10', color: '#3b82f6' },
  { key: 'pm2_5', label: 'PM2.5', color: '#ef4444' },
  { key: 'carbon_monoxide', label: 'CO', color: '#10b981' },
  { key: 'nitrogen_dioxide', label: 'NO₂', color: '#f59e0b' },
  { key: 'sulphur_dioxide', label: 'SO₂', color: '#8b5cf6' },
  { key: 'ozone', label: 'O₃', color: '#ec4899' },
] as const;

export function PollutantBarChart({ data }: PollutantBarChartProps) {
  const labels = pollutants.map((p) => p.label);
  const values = pollutants.map((p) => data[p.key as keyof AirQualityData] as number || 0);
  const colors = pollutants.map((p) => p.color);

  return (
    <div className="w-full h-[400px]">
      <Plot
        data={[
          {
            x: labels,
            y: values,
            type: 'bar',
            marker: {
              color: colors,
              line: {
                color: '#1f2937',
                width: 1,
              },
            },
            text: values.map((v) => v.toFixed(1)),
            textposition: 'outside',
            hovertemplate: '<b>%{x}</b><br>Level: %{y:.2f} μg/m³<extra></extra>',
          },
        ]}
        layout={{
          autosize: true,
          title: {
            text: 'Latest Pollutant Levels Snapshot',
            font: { size: 18, weight: 'bold' as any },
          },
          xaxis: {
            title: 'Pollutant',
            showgrid: false,
          },
          yaxis: {
            title: 'Pollutant Level (μg/m³)',
            showgrid: true,
            gridcolor: '#e5e7eb',
          },
          plot_bgcolor: '#ffffff',
          paper_bgcolor: '#ffffff',
          margin: { l: 60, r: 30, t: 60, b: 50 },
        }}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
