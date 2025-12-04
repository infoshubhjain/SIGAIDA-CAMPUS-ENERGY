'use client';

import dynamic from 'next/dynamic';
import { WeatherData, WeatherForecastData } from '@/lib/types';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface WeatherChartProps {
  data: WeatherData[] | WeatherForecastData[];
  type?: 'historical' | 'forecast';
}

export function WeatherChart({ data, type = 'historical' }: WeatherChartProps) {
  const times = data.map((d) => d.time);

  if (type === 'historical') {
    const historicalData = data as WeatherData[];
    const tempMax = historicalData.map((d) => d.temperature_2m_max || 0);
    const tempMin = historicalData.map((d) => d.temperature_2m_min || 0);
    const precipitation = historicalData.map((d) => d.precipitation_sum || 0);

    return (
      <div className="w-full h-[400px]">
        <Plot
          data={[
            {
              x: times,
              y: tempMax,
              type: 'scatter',
              mode: 'lines',
              name: 'Max Temp',
              line: { color: '#ef4444', width: 2 },
            },
            {
              x: times,
              y: tempMin,
              type: 'scatter',
              mode: 'lines',
              name: 'Min Temp',
              line: { color: '#3b82f6', width: 2 },
            },
            {
              x: times,
              y: precipitation,
              type: 'bar',
              name: 'Precipitation',
              yaxis: 'y2',
              marker: { color: '#10b981', opacity: 0.6 },
            },
          ]}
          layout={{
            autosize: true,
            title: 'Temperature & Precipitation',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Temperature (°F)' },
            yaxis2: {
              title: 'Precipitation (inches)',
              overlaying: 'y',
              side: 'right',
            },
            hovermode: 'x unified',
            showlegend: true,
            legend: { x: 0, y: 1, orientation: 'h' },
            margin: { l: 50, r: 50, t: 50, b: 50 },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  } else {
    const forecastData = data as WeatherForecastData[];
    const temp = forecastData.map((d) => d.temperature_2m || 0);
    const humidity = forecastData.map((d) => d.relative_humidity_2m || 0);

    return (
      <div className="w-full h-[400px]">
        <Plot
          data={[
            {
              x: times,
              y: temp,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Temperature',
              line: { color: '#ef4444', width: 2 },
              marker: { size: 4 },
            },
            {
              x: times,
              y: humidity,
              type: 'scatter',
              mode: 'lines',
              name: 'Humidity',
              yaxis: 'y2',
              line: { color: '#3b82f6', width: 2 },
            },
          ]}
          layout={{
            autosize: true,
            title: '16-Day Weather Forecast',
            xaxis: { title: 'Date/Time' },
            yaxis: { title: 'Temperature (°F)' },
            yaxis2: {
              title: 'Humidity (%)',
              overlaying: 'y',
              side: 'right',
            },
            hovermode: 'x unified',
            showlegend: true,
            legend: { x: 0, y: 1, orientation: 'h' },
            margin: { l: 50, r: 50, t: 50, b: 50 },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }
}
