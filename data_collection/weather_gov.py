import requests, sqlite3

USER_AGENT = "UIUCEnvApp (timkhaiet@gmail.com)"  # per NWS API rules
lat, lon = 40.1164, -88.2434
points_url = f"https://api.weather.gov/points/{lat},{lon}"

# Get forecast endpoints for UIUC point
resp = requests.get(points_url, headers={"User-Agent": USER_AGENT})
resp.raise_for_status()
point_data = resp.json()
forecast_url = point_data["properties"]["forecastHourly"]

# Fetch hourly forecast JSON
resp2 = requests.get(forecast_url, headers={"User-Agent": USER_AGENT})
resp2.raise_for_status()
weather_data = resp2.json()

# Create SQLite table for weather (timestamp, temperature, etc.)
conn = sqlite3.connect("campus_data.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS weather_gov (
    timestamp TEXT, temperature REAL, wind TEXT, conditions TEXT
)
""")
for period in weather_data.get("properties", {}).get("periods", []):
    dt = period.get("startTime")  # ISO UTC
    temp = period.get("temperature")  # in °F
    wind = period.get("windSpeed")
    cond = period.get("shortForecast")
    cursor.execute("""
        INSERT OR IGNORE INTO weather_gov (timestamp, temperature, wind, conditions)
        VALUES (?, ?, ?, ?)
    """, (dt, temp, wind, cond))
conn.commit()
conn.close()