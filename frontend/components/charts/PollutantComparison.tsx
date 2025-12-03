'use client';

import dynamic from 'next/dynamic';
import { AirQualityData } from '@/lib/types';
import { getPollutantLabel } from '@/lib/utils';
import { useState } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PollutantComparisonProps {
  data: AirQualityData[];
}

const pollutants = [
  'pm2_5',
  'pm10',
  'carbon_monoxide',
  'nitrogen_dioxide',
  'sulphur_dioxide',
  'ozone',
] as const;

export function PollutantComparison({ data }: PollutantComparisonProps) {
  const [selectedPollutants, setSelectedPollutants] = useState<string[]>(['pm2_5', 'pm10']);

  const times = data.map((d) => d.time).reverse();

  const traces = selectedPollutants.map((pollutant, idx) => {
    const values = data.map((d) => d[pollutant as keyof AirQualityData] as number || 0).reverse();
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    return {
      x: times,
      y: values,
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: getPollutantLabel(pollutant),
      line: { color: colors[idx % colors.length], width: 2 },
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {pollutants.map((pollutant) => (
          <button
            key={pollutant}
            onClick={() => {
              if (selectedPollutants.includes(pollutant)) {
                setSelectedPollutants(selectedPollutants.filter((p) => p !== pollutant));
              } else {
                setSelectedPollutants([...selectedPollutants, pollutant]);
              }
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedPollutants.includes(pollutant)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {getPollutantLabel(pollutant)}
          </button>
        ))}
      </div>
      <div className="w-full h-[400px]">
        <Plot
          data={traces}
          layout={{
            autosize: true,
            title: 'Pollutant Comparison',
            xaxis: { title: 'Date/Time' },
            yaxis: { title: 'Concentration (μg/m³)' },
            hovermode: 'x unified',
            showlegend: true,
            legend: { x: 0, y: 1, orientation: 'h' },
            margin: { l: 50, r: 30, t: 80, b: 50 },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
