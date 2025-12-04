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
    "precipitation_unit": "inch",
    "timezone": "America/Chicago",
    "forecast_days": 16
}
response = requests.get(meteo_url, params=params)
response.raise_for_status()
data = response.json()

# Extract hourly data
hourly_data = data["hourly"]
columns = hourly_data.keys()
rows = list(zip(*hourly_data.values()))  # transpose from lists of columns → list of rows

# Create SQLite Table
connection = sqlite3.connect("campus_data.db")
cursor = connection.cursor()

# Drop existing table to ensure fresh forecast data
cursor.execute("DROP TABLE IF EXISTS weather_forecast")
connection.commit()

# Create table with proper columns
quoted_cols = ", ".join([f'"{c}"' for c in columns])
create_sql = f"CREATE TABLE weather_forecast ({quoted_cols})"
cursor.execute(create_sql)
connection.commit()

# Prepare insert statement (quote column names)
placeholders = ", ".join(["?"] * len(columns))
insert_sql = f"INSERT INTO weather_forecast ({quoted_cols}) VALUES ({placeholders});"

# Convert DataFrame rows to list of tuples for executemany
param_rows = [tuple(row) for row in rows]

# Insert rows in a transaction
cursor.executemany(insert_sql, param_rows)
connection.commit()

# Clean up
cursor.close()
connection.close()


