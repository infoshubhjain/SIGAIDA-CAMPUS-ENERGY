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

all_results = []
results = True
page_num = 1
# earlist possible datetime_from is 2024-01-04
while results:
    try:
        response = client.measurements.list(8706090,datetime_from='2025-07-04',page=page_num)
    except Exception as e:
        print(e)  # results in http read time out - probably API throttling? Log the error but still save whatever data we got
        break
    data = response.dict()['results']
    if len(data) == 0:
        results = False
    else:
        all_results.extend(data)
        page_num += 1

client.close()

df = json_normalize(all_results)  # value

# Open (or create) SQLite DB and insert data
conn = sqlite3.connect("campus_data.db")

df = df[['value', 'parameter.name', 'coverage.datetime_from.utc']]
df.columns = ['value', 'parameter_name', 'datetime_utc']  # rename columns

df.to_sql('air_quality_all', conn, if_exists='append', index=False)  # save to database

conn.commit()
conn.close()
