"""
SIGAIDA Campus Energy - FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

from database import db
from models import (
    HealthResponse,
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
    AirQualityData,
    OpenAQData,
    WeatherData,
    WeatherForecastData,
    NDVIGridCell,
    NDVITimeSeriesPoint,
    NDVIMonthlyAverage,
    TransitStop,
    TransitRoute
)

# Initialize FastAPI app
app = FastAPI(
    title="SIGAIDA Campus Energy API",
    description="Environmental data API for UIUC campus monitoring",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health Check

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.get_connection().close()
        database_connected = True
    except Exception:
        database_connected = False

    return {
        "status": "healthy" if database_connected else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "database_connected": database_connected,
        "version": "1.0.0"
    }


# Air Quality Endpoints

@app.get("/api/air-quality/current", response_model=CurrentAirQualityResponse)
async def get_current_air_quality():
    """Get the most recent air quality data"""
    try:
        data = db.get_current_air_quality()
        if not data:
            raise HTTPException(status_code=404, detail="No current air quality data available")

        return {
            "data": AirQualityData(**data),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching air quality data: {str(e)}")


@app.get("/api/air-quality/historical", response_model=HistoricalAirQualityResponse)
async def get_historical_air_quality(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(1000, ge=1, le=10000, description="Maximum number of records")
):
    """Get historical air quality data within a date range"""
    try:
        data = db.get_historical_air_quality(start_date, end_date, limit)

        return {
            "data": [AirQualityData(**item) for item in data],
            "count": len(data),
            "start_date": start_date,
            "end_date": end_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")


@app.get("/api/air-quality/openaq", response_model=OpenAQResponse)
async def get_openaq_data(
    hours: int = Query(24, ge=1, le=168, description="Number of hours of data to fetch")
):
    """Get recent OpenAQ sensor PM2.5 data"""
    try:
        data = db.get_openaq_data(hours)

        return {
            "data": [OpenAQData(**item) for item in data],
            "count": len(data),
            "sensor_id": "8706090"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching OpenAQ data: {str(e)}")


# Weather Endpoints

@app.get("/api/weather/forecast", response_model=WeatherForecastResponse)
async def get_weather_forecast():
    """Get 16-day weather forecast"""
    try:
        data = db.get_weather_forecast()

        return {
            "data": [WeatherForecastData(**item) for item in data],
            "count": len(data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather forecast: {str(e)}")


@app.get("/api/weather/historical", response_model=HistoricalWeatherResponse)
async def get_historical_weather(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(365, ge=1, le=10000, description="Maximum number of records")
):
    """Get historical daily weather data"""
    try:
        data = db.get_historical_weather(start_date, end_date, limit)

        return {
            "data": [WeatherData(**item) for item in data],
            "count": len(data),
            "start_date": start_date,
            "end_date": end_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical weather: {str(e)}")


@app.get("/api/weather/current")
async def get_current_weather():
    """Get current weather conditions (from latest historical data)"""
    try:
        data = db.get_historical_weather(limit=1)
        if not data:
            raise HTTPException(status_code=404, detail="No weather data available")

        return {
            "data": WeatherData(**data[0]),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching current weather: {str(e)}")


# NDVI/Vegetation Endpoints

@app.get("/api/ndvi/latest", response_model=LatestNDVIResponse)
async def get_latest_ndvi():
    """Get the most recent NDVI data for all grid cells"""
    try:
        data = db.get_latest_ndvi()
        if not data:
            raise HTTPException(status_code=404, detail="No NDVI data available")

        # Extract year and month from first record
        year = data[0]['year'] if data else None
        month = data[0]['month'] if data else None

        return {
            "data": [NDVIGridCell(**item) for item in data],
            "count": len(data),
            "year": year,
            "month": month
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching NDVI data: {str(e)}")


@app.get("/api/ndvi/timeseries", response_model=NDVITimeSeriesResponse)
async def get_ndvi_timeseries(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    tolerance: float = Query(0.001, description="Search tolerance for lat/lon")
):
    """Get NDVI time series for a specific location"""
    try:
        data = db.get_ndvi_timeseries(lat, lon, tolerance)
        if not data:
            raise HTTPException(status_code=404, detail="No NDVI data found for this location")

        # Add formatted date string
        for item in data:
            item['date'] = f"{item['year']}-{item['month']:02d}"

        return {
            "data": [NDVITimeSeriesPoint(**item) for item in data],
            "count": len(data),
            "location": {"lat": lat, "lon": lon}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching NDVI time series: {str(e)}")


@app.get("/api/ndvi/stats", response_model=NDVIStatsResponse)
async def get_ndvi_stats():
    """Get NDVI statistics including mean, min, max, and greenest areas"""
    try:
        stats_data = db.get_ndvi_stats()

        return {
            "statistics": stats_data["statistics"],
            "greenest_areas": [NDVIGridCell(**item) for item in stats_data["greenest_areas"]]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching NDVI statistics: {str(e)}")


@app.get("/api/ndvi/monthly-average", response_model=NDVIMonthlyAverageResponse)
async def get_ndvi_monthly_average():
    """Get campus-wide average NDVI over time"""
    try:
        data = db.get_ndvi_monthly_average()

        # Add formatted date string
        for item in data:
            item['date'] = f"{item['year']}-{item['month']:02d}"

        return {
            "data": [NDVIMonthlyAverage(**item) for item in data],
            "count": len(data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching monthly NDVI: {str(e)}")


# Transit Endpoints

@app.get("/api/transit/stops", response_model=TransitStopsResponse)
async def get_transit_stops():
    """Get all transit stops"""
    try:
        data = db.get_transit_stops()

        return {
            "data": [TransitStop(**item) for item in data],
            "count": len(data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching transit stops: {str(e)}")


@app.get("/api/transit/routes", response_model=TransitRoutesResponse)
async def get_transit_routes():
    """Get all transit routes"""
    try:
        data = db.get_transit_routes()

        return {
            "data": [TransitRoute(**item) for item in data],
            "count": len(data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching transit routes: {str(e)}")


# Dashboard Summary Endpoint

@app.get("/api/dashboard/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    """Get aggregated data for dashboard overview"""
    try:
        summary = db.get_dashboard_summary()
        return DashboardSummary(**summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard summary: {str(e)}")


# ML Prediction Endpoints

@app.get("/api/ml/air-quality-forecast")
async def get_air_quality_forecast(days: int = Query(7, ge=1, le=30, description="Number of days to forecast")):
    """Get ML-based air quality forecast (placeholder implementation)"""
    try:
        from ml.predict import ml_predictor
        predictions = ml_predictor.predict_air_quality(days)
        return {
            "predictions": predictions,
            "days": days,
            "note": "This is a placeholder. Implement actual ML model for production."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")


@app.get("/api/ml/anomalies")
async def detect_anomalies(data_type: str = Query("air_quality", description="Type of data to analyze")):
    """Detect anomalies in environmental data (placeholder implementation)"""
    try:
        from ml.predict import ml_predictor
        anomalies = ml_predictor.detect_anomalies(data_type)
        return anomalies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")


@app.get("/api/ml/model-info")
async def get_model_info():
    """Get information about loaded ML models"""
    try:
        from ml.predict import ml_predictor
        return ml_predictor.get_model_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching model info: {str(e)}")


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SIGAIDA Campus Energy API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
