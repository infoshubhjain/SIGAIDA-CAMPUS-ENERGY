'use client';

import dynamic from 'next/dynamic';
import { AirQualityData } from '@/lib/types';
import { getPollutantLabel } from '@/lib/utils';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface AirQualityChartProps {
  data: AirQualityData[];
  pollutant?: 'pm2_5' | 'pm10' | 'carbon_monoxide' | 'nitrogen_dioxide' | 'sulphur_dioxide' | 'ozone';
}

export function AirQualityChart({ data, pollutant = 'pm2_5' }: AirQualityChartProps) {
  const times = data.map((d) => d.time).reverse();
  const values = data.map((d) => d[pollutant] || 0).reverse();

  return (
    <div className="w-full h-[400px]">
      <Plot
        data={[
          {
            x: times,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: '#3b82f6', size: 4 },
            line: { color: '#3b82f6', width: 2 },
            name: getPollutantLabel(pollutant),
          },
        ]}
        layout={{
          autosize: true,
          title: `${getPollutantLabel(pollutant)} Over Time`,
          xaxis: { title: 'Date/Time' },
          yaxis: { title: `Concentration (μg/m³)` },
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
