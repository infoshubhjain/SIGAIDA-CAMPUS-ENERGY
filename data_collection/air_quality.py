import sqlite3
from openaq import OpenAQ
from pandas import json_normalize
from dotenv import load_dotenv
import os
load_dotenv()
key = os.getenv("OPENAQ_KEY")

# lat, lon = 40.1164, -88.2434
# locations = client.locations.list(coordinates=[lat, lon], radius=10000, limit=50)  # gets location id at those coordinates
# Champaign id=2697596
# sensor = client.locations.latest(2697596)  # gets latest info from certain location, including sensor IDs from that location
# the only sensor in Urbana-Champaign has ID 8706090

client = OpenAQ(api_key=f"{key}")
response = client.measurements.list(8706090,datetime_from='2025-10-16')
client.close()
data = response.dict()
df = json_normalize(data['results'])  # value

# Open (or create) SQLite DB and insert data
conn = sqlite3.connect("campus_data.db")

df = df[['value', 'parameter.name', 'coverage.datetime_from.utc']]
df.columns = ['value', 'parameter_name', 'datetime_utc']  # rename columns

df.to_sql('air_quality', conn, if_exists='replace', index=False)  # save to database

conn.commit()
conn.close()
