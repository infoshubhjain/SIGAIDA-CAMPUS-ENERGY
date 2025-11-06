import pandas as pd
import sqlite3
import glob
import os

# Folder where you downloaded the exported CSVs from Google Drive
csv_folder = "sigaida_ndvi_data"

# Get all CSV files
csv_files = glob.glob(os.path.join(csv_folder, "*.csv"))

# Read and concatenate
df = pd.concat([pd.read_csv(f) for f in csv_files], ignore_index=True)

# Optional: ensure correct column order
columns = ['year', 'month', 'lon', 'lat', 'ndvi']
df = df[columns]

# Save to SQLite
sqlite_path = "campus_data.db"
table_name = "vegetation_data"
conn = sqlite3.connect(sqlite_path)
df.to_sql(table_name, conn, if_exists="replace", index=False)
conn.close()

print(f"Saved {len(df)} rows to {sqlite_path}")
