#!/bin/bash
# Automated data collection script for SIGAIDA Campus Energy
# This script updates air quality and weather data in the database

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Log file
LOG_FILE="$SCRIPT_DIR/update_data.log"

echo "======================================" >> "$LOG_FILE"
echo "Data update started at: $(date)" >> "$LOG_FILE"
echo "======================================" >> "$LOG_FILE"

# Update air quality data
echo "Updating air quality data..." >> "$LOG_FILE"
python3 historical_and_current_air_quality_data.py >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Air quality data updated successfully" >> "$LOG_FILE"
else
    echo "✗ Failed to update air quality data" >> "$LOG_FILE"
fi

# Update weather data
echo "Updating weather data..." >> "$LOG_FILE"
python3 historical_weather_data.py >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Weather data updated successfully" >> "$LOG_FILE"
else
    echo "✗ Failed to update weather data" >> "$LOG_FILE"
fi

# Update weather forecast data
echo "Updating weather forecast data..." >> "$LOG_FILE"
python3 weather_forecast.py >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Weather forecast data updated successfully" >> "$LOG_FILE"
else
    echo "✗ Failed to update weather forecast data" >> "$LOG_FILE"
fi

echo "Data update completed at: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
