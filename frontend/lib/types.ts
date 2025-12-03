// TypeScript types for API responses

export interface AirQualityData {
  time?: string;
  pm2_5?: number;
  pm10?: number;
  carbon_monoxide?: number;
  nitrogen_dioxide?: number;
  sulphur_dioxide?: number;
  ozone?: number;
  us_aqi?: number;
  us_aqi_pm2_5?: number;
  us_aqi_pm10?: number;
  us_aqi_carbon_monoxide?: number;
  us_aqi_nitrogen_dioxide?: number;
  us_aqi_sulphur_dioxide?: number;
  us_aqi_ozone?: number;
}

export interface CurrentAirQualityResponse {
  data: AirQualityData;
  timestamp: string;
}

export interface HistoricalAirQualityResponse {
  data: AirQualityData[];
  count: number;
  start_date?: string;
  end_date?: string;
}

export interface OpenAQData {
  datetime: string;
  value: number;
  parameter?: string;
  unit?: string;
}

export interface OpenAQResponse {
  data: OpenAQData[];
  count: number;
  sensor_id: string;
}

export interface WeatherData {
  time: string;
  temperature_2m_max?: number;
  temperature_2m_min?: number;
  apparent_temperature_max?: number;
  apparent_temperature_min?: number;
  precipitation_sum?: number;
  rain_sum?: number;
  snowfall_sum?: number;
  wind_speed_10m_max?: number;
  wind_gusts_10m_max?: number;
  wind_direction_10m_dominant?: number;
  shortwave_radiation_sum?: number;
  et0_fao_evapotranspiration?: number;
}

export interface WeatherForecastData {
  time: string;
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  precipitation?: number;
  rain?: number;
  snowfall?: number;
  weather_code?: number;
  cloud_cover?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
}

export interface HistoricalWeatherResponse {
  data: WeatherData[];
  count: number;
  start_date?: string;
  end_date?: string;
}

export interface WeatherForecastResponse {
  data: WeatherForecastData[];
  count: number;
}

export interface NDVIGridCell {
  lat: number;
  lon: number;
  ndvi: number;
  year: number;
  month: number;
}

export interface NDVITimeSeriesPoint {
  year: number;
  month: number;
  ndvi: number;
  date?: string;
}

export interface LatestNDVIResponse {
  data: NDVIGridCell[];
  count: number;
  year: number;
  month: number;
}

export interface NDVITimeSeriesResponse {
  data: NDVITimeSeriesPoint[];
  count: number;
  location: { lat: number; lon: number };
}

export interface NDVIStatistics {
  mean_ndvi: number;
  min_ndvi: number;
  max_ndvi: number;
  total_cells: number;
}

export interface NDVIStatsResponse {
  statistics: NDVIStatistics;
  greenest_areas: NDVIGridCell[];
}

export interface NDVIMonthlyAverage {
  year: number;
  month: number;
  avg_ndvi: number;
  cell_count: number;
  date?: string;
}

export interface NDVIMonthlyAverageResponse {
  data: NDVIMonthlyAverage[];
  count: number;
}

export interface TransitStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
}

export interface TransitRoute {
  route_id: string;
  route_short_name?: string;
  route_long_name?: string;
}

export interface TransitStopsResponse {
  data: TransitStop[];
  count: number;
}

export interface TransitRoutesResponse {
  data: TransitRoute[];
  count: number;
}

export interface DashboardSummary {
  current_air_quality?: any;
  latest_weather?: any;
  ndvi_statistics?: any;
  recent_trends?: any;
  greenest_areas?: any[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  database_connected: boolean;
  version: string;
}
