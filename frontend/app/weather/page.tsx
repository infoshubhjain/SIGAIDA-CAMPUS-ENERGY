'use client';

import { useEffect, useState } from 'react';
import { getCurrentWeather, getHistoricalWeather, getWeatherForecast } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherChart } from '@/components/charts/WeatherChart';
import { WeatherData, WeatherForecastData } from '@/lib/types';
import { formatTemperature, formatNumber, getDateRange } from '@/lib/utils';
import { Cloud, Droplet, Wind, Sun, CloudRain } from 'lucide-react';

export default function WeatherPage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [historicalWeather, setHistoricalWeather] = useState<WeatherData[]>([]);
  const [forecast, setForecast] = useState<WeatherForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { start, end } = getDateRange(dateRange);

        const [current, historical, forecastData] = await Promise.all([
          getCurrentWeather(),
          getHistoricalWeather(start, end, dateRange),
          getWeatherForecast(),
        ]);

        setCurrentWeather(current.data);
        setHistoricalWeather(historical.data);
        setForecast(forecastData.data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center">
          <Cloud className="mr-3 h-10 w-10" />
          Weather Monitoring
        </h1>
        <p className="text-gray-600 mt-2">
          Current conditions, forecasts, and historical weather data
        </p>
      </div>

      {/* Current Weather */}
      {currentWeather && (
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Sun className="mr-2 h-4 w-4" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatTemperature(currentWeather.temperature_2m_max || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Low: {formatTemperature(currentWeather.temperature_2m_min || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CloudRain className="mr-2 h-4 w-4" />
                Precipitation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatNumber(currentWeather.precipitation_sum || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">inches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Wind className="mr-2 h-4 w-4" />
                Wind Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatNumber(currentWeather.wind_speed_10m_max || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">mph</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Droplet className="mr-2 h-4 w-4" />
                Evapotranspiration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatNumber(currentWeather.et0_fao_evapotranspiration || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">mm</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Date Range Selector */}
      <div className="mb-6 flex gap-2">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setDateRange(days)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === days
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {days} Days
          </button>
        ))}
      </div>

      {/* Historical Weather Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Historical Weather</CardTitle>
          <CardDescription>Temperature and precipitation trends</CardDescription>
        </CardHeader>
        <CardContent>
          {historicalWeather.length > 0 ? (
            <WeatherChart data={historicalWeather} type="historical" />
          ) : (
            <p className="text-sm text-gray-500">No historical data available</p>
          )}
        </CardContent>
      </Card>

      {/* 16-Day Forecast Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>16-Day Weather Forecast</CardTitle>
          <CardDescription>Hourly forecast data</CardDescription>
        </CardHeader>
        <CardContent>
          {forecast.length > 0 ? (
            <WeatherChart data={forecast} type="forecast" />
          ) : (
            <p className="text-sm text-gray-500">No forecast data available</p>
          )}
        </CardContent>
      </Card>

      {/* Forecast Cards */}
      {forecast.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Forecast Highlights</CardTitle>
            <CardDescription>Next 5 days preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {forecast.slice(0, 5 * 24, 24).map((item, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    {new Date(item.time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="text-3xl font-bold my-2">
                    {formatTemperature(item.temperature_2m || 0)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Humidity: {Math.round(item.relative_humidity_2m || 0)}%
                  </p>
                  {item.precipitation !== undefined && item.precipitation > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      Rain: {formatNumber(item.precipitation)} in
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
