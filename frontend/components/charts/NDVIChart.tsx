'use client';

import dynamic from 'next/dynamic';
import { NDVIMonthlyAverage } from '@/lib/types';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface NDVIChartProps {
  data: NDVIMonthlyAverage[];
}

export function NDVIChart({ data }: NDVIChartProps) {
  const dates = data.map((d) => d.date || `${d.year}-${d.month.toString().padStart(2, '0')}`);
  const ndviValues = data.map((d) => d.avg_ndvi);

  return (
    <div className="w-full h-[400px]">
      <Plot
        data={[
          {
            x: dates,
            y: ndviValues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: '#10b981', size: 6 },
            line: { color: '#10b981', width: 3 },
            fill: 'tozeroy',
            fillcolor: 'rgba(16, 185, 129, 0.2)',
            name: 'Average NDVI',
          },
        ]}
        layout={{
          autosize: true,
          title: 'Campus-Wide Average NDVI Over Time',
          xaxis: { title: 'Date' },
          yaxis: {
            title: 'NDVI',
            range: [0, 0.8],
          },
          hovermode: 'closest',
          showlegend: false,
          margin: { l: 50, r: 30, t: 50, b: 50 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
