// API client for backend communication
import axios from 'axios';
import type {
  CurrentAirQualityResponse,
  HistoricalAirQualityResponse,
  OpenAQResponse,
  HistoricalWeatherResponse,
  WeatherForecastResponse,
  LatestNDVIResponse,
  NDVITimeSeriesResponse,
  NDVIStatsResponse,
  NDVIMonthlyAverageResponse,
  TransitStopsResponse,
  TransitRoutesResponse,
  DashboardSummary,
  HealthResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health Check
export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/api/health');
  return response.data;
};

// Air Quality APIs
export const getCurrentAirQuality = async (): Promise<CurrentAirQualityResponse> => {
  const response = await api.get<CurrentAirQualityResponse>('/api/air-quality/current');
  return response.data;
};

export const getHistoricalAirQuality = async (
  startDate?: string,
  endDate?: string,
  limit: number = 1000
): Promise<HistoricalAirQualityResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  params.append('limit', limit.toString());

  const response = await api.get<HistoricalAirQualityResponse>(
    `/api/air-quality/historical?${params.toString()}`
  );
  return response.data;
};

export const getOpenAQData = async (hours: number = 24): Promise<OpenAQResponse> => {
  const response = await api.get<OpenAQResponse>(`/api/air-quality/openaq?hours=${hours}`);
  return response.data;
};

// Weather APIs
export const getCurrentWeather = async () => {
  const response = await api.get('/api/weather/current');
  return response.data;
};

export const getHistoricalWeather = async (
  startDate?: string,
  endDate?: string,
  limit: number = 365
): Promise<HistoricalWeatherResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  params.append('limit', limit.toString());

  const response = await api.get<HistoricalWeatherResponse>(
    `/api/weather/historical?${params.toString()}`
  );
  return response.data;
};

export const getWeatherForecast = async (): Promise<WeatherForecastResponse> => {
  const response = await api.get<WeatherForecastResponse>('/api/weather/forecast');
  return response.data;
};

// NDVI APIs
export const getLatestNDVI = async (): Promise<LatestNDVIResponse> => {
  const response = await api.get<LatestNDVIResponse>('/api/ndvi/latest');
  return response.data;
};

export const getNDVITimeSeries = async (
  lat: number,
  lon: number,
  tolerance: number = 0.001
): Promise<NDVITimeSeriesResponse> => {
  const response = await api.get<NDVITimeSeriesResponse>(
    `/api/ndvi/timeseries?lat=${lat}&lon=${lon}&tolerance=${tolerance}`
  );
  return response.data;
};

export const getNDVIStats = async (): Promise<NDVIStatsResponse> => {
  const response = await api.get<NDVIStatsResponse>('/api/ndvi/stats');
  return response.data;
};

export const getNDVIMonthlyAverage = async (): Promise<NDVIMonthlyAverageResponse> => {
  const response = await api.get<NDVIMonthlyAverageResponse>('/api/ndvi/monthly-average');
  return response.data;
};

// Transit APIs
export const getTransitStops = async (): Promise<TransitStopsResponse> => {
  const response = await api.get<TransitStopsResponse>('/api/transit/stops');
  return response.data;
};

export const getTransitRoutes = async (): Promise<TransitRoutesResponse> => {
  const response = await api.get<TransitRoutesResponse>('/api/transit/routes');
  return response.data;
};

// Dashboard API
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>('/api/dashboard/summary');
  return response.data;
};

export default api;
