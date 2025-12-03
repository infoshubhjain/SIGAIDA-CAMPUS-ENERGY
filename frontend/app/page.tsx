'use client';

import { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/lib/api';
import { DashboardSummary } from '@/lib/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, Cloud, Leaf, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { getAQICategory, formatTemperature, formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const aqiInfo = summary?.current_air_quality?.us_aqi
    ? getAQICategory(summary.current_air_quality.us_aqi)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Campus Energy Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Real-time environmental monitoring for UIUC campus
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Air Quality Index"
          value={summary?.current_air_quality?.us_aqi || 'N/A'}
          subtitle={aqiInfo?.category || 'No data'}
          icon={Wind}
        />
        <StatCard
          title="PM2.5"
          value={
            summary?.current_air_quality?.pm2_5
              ? `${formatNumber(summary.current_air_quality.pm2_5)} μg/m³`
              : 'N/A'
          }
          subtitle="Fine particulate matter"
          icon={Activity}
        />
        <StatCard
          title="Temperature"
          value={
            summary?.latest_weather?.temperature_2m_max
              ? formatTemperature(summary.latest_weather.temperature_2m_max)
              : 'N/A'
          }
          subtitle="Max temperature today"
          icon={Cloud}
        />
        <StatCard
          title="Average NDVI"
          value={
            summary?.ndvi_statistics?.mean_ndvi
              ? formatNumber(summary.ndvi_statistics.mean_ndvi, 3)
              : 'N/A'
          }
          subtitle="Vegetation health index"
          icon={Leaf}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Current Air Quality Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="mr-2 h-5 w-5" />
              Current Air Quality
            </CardTitle>
            <CardDescription>Latest pollutant measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {summary?.current_air_quality ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">PM2.5</span>
                  <span className="text-sm">
                    {formatNumber(summary.current_air_quality.pm2_5 || 0)} μg/m³
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">PM10</span>
                  <span className="text-sm">
                    {formatNumber(summary.current_air_quality.pm10 || 0)} μg/m³
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ozone (O₃)</span>
                  <span className="text-sm">
                    {formatNumber(summary.current_air_quality.ozone || 0)} μg/m³
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">NO₂</span>
                  <span className="text-sm">
                    {formatNumber(summary.current_air_quality.nitrogen_dioxide || 0)} μg/m³
                  </span>
                </div>
                {aqiInfo && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className={`text-sm font-semibold ${aqiInfo.color}`}>
                      {aqiInfo.category}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{aqiInfo.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Weather Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="mr-2 h-5 w-5" />
              Latest Weather
            </CardTitle>
            <CardDescription>Today's weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            {summary?.latest_weather ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Max Temperature</span>
                  <span className="text-sm">
                    {formatTemperature(summary.latest_weather.temperature_2m_max || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Min Temperature</span>
                  <span className="text-sm">
                    {formatTemperature(summary.latest_weather.temperature_2m_min || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Precipitation</span>
                  <span className="text-sm">
                    {formatNumber(summary.latest_weather.precipitation_sum || 0)} in
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Wind Speed</span>
                  <span className="text-sm">
                    {formatNumber(summary.latest_weather.wind_speed_10m_max || 0)} mph
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Trends & Greenest Areas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              7-Day Average Trends
            </CardTitle>
            <CardDescription>Air quality averages over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            {summary?.recent_trends ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg PM2.5</span>
                  <span className="text-sm">
                    {formatNumber(summary.recent_trends.avg_pm25 || 0)} μg/m³
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg PM10</span>
                  <span className="text-sm">
                    {formatNumber(summary.recent_trends.avg_pm10 || 0)} μg/m³
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg AQI</span>
                  <span className="text-sm">
                    {formatNumber(summary.recent_trends.avg_aqi || 0, 0)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No trend data available</p>
            )}
          </CardContent>
        </Card>

        {/* Greenest Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="mr-2 h-5 w-5" />
              Greenest Campus Areas
            </CardTitle>
            <CardDescription>Top locations by vegetation index</CardDescription>
          </CardHeader>
          <CardContent>
            {summary?.greenest_areas && summary.greenest_areas.length > 0 ? (
              <div className="space-y-2">
                {summary.greenest_areas.map((area: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium">
                      {area.lat.toFixed(4)}, {area.lon.toFixed(4)}
                    </span>
                    <span className="text-green-600 font-semibold">
                      NDVI: {formatNumber(area.ndvi, 3)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No NDVI data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
