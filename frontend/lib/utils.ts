import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// AQI category helper
export function getAQICategory(aqi: number): {
  category: string;
  color: string;
  description: string;
} {
  if (aqi <= 50) {
    return {
      category: "Good",
      color: "text-green-600",
      description: "Air quality is satisfactory",
    };
  } else if (aqi <= 100) {
    return {
      category: "Moderate",
      color: "text-yellow-600",
      description: "Acceptable for most people",
    };
  } else if (aqi <= 150) {
    return {
      category: "Unhealthy for Sensitive Groups",
      color: "text-orange-600",
      description: "Sensitive groups may experience health effects",
    };
  } else if (aqi <= 200) {
    return {
      category: "Unhealthy",
      color: "text-red-600",
      description: "Everyone may experience health effects",
    };
  } else if (aqi <= 300) {
    return {
      category: "Very Unhealthy",
      color: "text-purple-600",
      description: "Health alert: everyone may experience serious effects",
    };
  } else {
    return {
      category: "Hazardous",
      color: "text-red-900",
      description: "Health warning of emergency conditions",
    };
  }
}

// Format date helpers
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// NDVI color helper
export function getNDVIColor(ndvi: number): string {
  if (ndvi < 0.2) return "#e5e7eb"; // Very low vegetation
  if (ndvi < 0.3) return "#d1fae5"; // Low vegetation
  if (ndvi < 0.4) return "#6ee7b7"; // Moderate vegetation
  if (ndvi < 0.5) return "#34d399"; // Good vegetation
  if (ndvi < 0.6) return "#10b981"; // Very good vegetation
  return "#059669"; // Excellent vegetation
}

// Number formatting
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}

// Percentage formatting
export function formatPercentage(num: number): string {
  return `${num.toFixed(0)}%`;
}

// Temperature formatting
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°F`;
}

// Weather code descriptions
export function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown";
}

// Pollutant name mapping
export function getPollutantLabel(key: string): string {
  const labels: { [key: string]: string } = {
    pm2_5: "PM2.5",
    pm10: "PM10",
    carbon_monoxide: "CO",
    nitrogen_dioxide: "NO₂",
    sulphur_dioxide: "SO₂",
    ozone: "O₃",
    us_aqi: "AQI",
  };
  return labels[key] || key;
}

// Calculate date ranges
export function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}
