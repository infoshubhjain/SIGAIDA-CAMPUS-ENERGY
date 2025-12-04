import requests, zipfile, io, csv, sqlite3

# Download MTD GTFS zip
gtfs_url = "https://developer.mtd.org/gtfs/google_transit.zip"
resp = requests.get(gtfs_url)
resp.raise_for_status()
z = zipfile.ZipFile(io.BytesIO(resp.content))

# Parse stops.txt from GTFS
stops_csv = csv.reader(io.TextIOWrapper(z.open("stops.txt"), encoding="utf-8"))
headers = next(stops_csv)  # header row
conn = sqlite3.connect("campus_data.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS transit_stops (
    stop_id TEXT PRIMARY KEY, stop_name TEXT, stop_lat REAL, stop_lon REAL
)
""")
for row in stops_csv:
    stop_id, stop_name, stop_lat, stop_lon = row[0], row[2], row[4], row[5]
    cursor.execute("INSERT OR IGNORE INTO transit_stops VALUES (?, ?, ?, ?)",
                   (stop_id, stop_name, stop_lat, stop_lon))  # TODO: other values?

# Parse routes.txt from GTFS
routes_csv = csv.reader(io.TextIOWrapper(z.open("routes.txt"), encoding="utf-8"))
next(routes_csv)
cursor.execute("""
CREATE TABLE IF NOT EXISTS transit_routes (
    route_id TEXT PRIMARY KEY, route_short_name TEXT, route_long_name TEXT
)
""")
for row in routes_csv:
    route_id, short_name, long_name = row[0], row[2], row[3]
    cursor.execute("INSERT OR IGNORE INTO transit_routes VALUES (?, ?, ?)",
                   (route_id, short_name, long_name))

conn.commit()
conn.close()
