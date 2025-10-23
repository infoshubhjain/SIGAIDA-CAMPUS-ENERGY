import requests, sqlite3
import pandas as pd

lat, lon = 40.1164, -88.2434
meteo_url = "https://api.open-meteo.com/v1/forecast"

# Fetch Hourly Forcecasts as JSON
hourly = [
    "temperature_2m", "relative_humidity_2m", "dew_point_2m", "apparent_temperature", "pressure_msl",
    "surface_pressure", "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high", "wind_speed_10m",
    "wind_speed_80m", "wind_speed_120m", "wind_speed_180m", "wind_direction_10m", "wind_direction_80m", "wind_direction_120m", 
    "wind_direction_180m", "wind_gusts_10m", "shortwave_radiation", "direct_radiation", "direct_normal_irradiance", 
    "diffuse_radiation", "global_tilted_irradiance", "vapour_pressure_deficit", "cape", "evapotranspiration","et0_fao_evapotranspiration", 
    "precipitation", "snowfall", "precipitation_probability", "rain", "showers", "weather_code", "snow_depth", "freezing_level_height", 
    "visibility", "soil_temperature_0cm", "soil_temperature_6cm", "soil_temperature_18cm", "soil_temperature_54cm", "soil_moisture_0_to_1cm", 
    "soil_moisture_1_to_3cm", "soil_moisture_3_to_9cm", "soil_moisture_9_to_27cm", "soil_moisture_27_to_81cm", "is_day"
    ]
params = {
    "latitude": lat,
    "longitude": lon,
    "hourly": hourly,
    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "mph",
    "preciptation_unit": "inch",
    "timezone": "America/Chicago",
    "forcecast_days": 16
}
response = requests.get(meteo_url, params=params)
response.raise_for_status()
data = response.json()

# Extract hourly data
hourly_data = data["hourly"]
columns = hourly_data.keys()
rows = list(zip(*hourly_data.values()))  # transpose from lists of columns → list of rows

# Create SQLite Table
connection = sqlite3.connect("./data_collection/campus_data.db")
cursor = connection.cursor()

# Create table dynamically based on variables
col_defs = ", ".join([f'"{col}" REAL' if col != "time" else '"time" TEXT' for col in columns])
cursor.execute(f"CREATE TABLE IF NOT EXISTS weather_data ({col_defs});")

# Insert data into the table
placeholders = ", ".join(["?"] * len(columns))
cursor.executemany(
    f"INSERT OR REPLACE INTO weather_data ({', '.join(columns)}) VALUES ({placeholders});",
    rows
)


