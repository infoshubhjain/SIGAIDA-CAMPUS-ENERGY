import sqlite3
import pandas as pd
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
import numpy as np
import torch
import torch.nn as nn

#get last date
def get_last_date():
    conn = sqlite3.connect("../data_collection/campus_data.db")
    query = "SELECT MAX(timestamp) as last_date FROM air_quality_data"
    df = pd.read_sql(query, conn)
    conn.close()
    
    last_date = df['last_date'][0]  # This is the most recent timestamp in the table
    return last_date

# LSTM Model
class pm25_model(nn.Module):
    def __init__(self, input_size, hidden_size=64, num_layers=2, dropout=0.2):
        super(pm25_model, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 32),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(32, 1)
        )
    
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        out = self.fc(lstm_out[:, -1, :])
        return out


def predict_pm25():
    conn = sqlite3.connect("../data_collection/campus_data.db")


    FEATURES = ['pm10', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone', 'carbon_dioxide']
    
    latest_timestamp = pd.read_sql("SELECT MAX(timestamp) as latest FROM air_quality_data", conn)['latest'][0]
    if latest_timestamp is None:
        raise ValueError("No data available in database")
    end_date = pd.to_datetime(latest_timestamp)
    start_date = end_date - pd.Timedelta(days=7)
    
    #end_date = pd.to_datetime(latest_timestamp)
    #start_date = end_date - pd.Timedelta(days=7)

    
    end_date = datetime.now()
    start_date = end_date - timedelta(days = 7)

    query = f"""
    SELECT timestamp, {', '.join(FEATURES)}, pm2_5
    FROM air_quality_data
    WHERE timestamp >= '{start_date.strftime('%Y-%m-%d %H:%M:%S')}'
    ORDER BY timestamp ASC
    """
    df = pd.read_sql(query, conn)
    conn.close()

    if len(df) < 24:
        raise ValueError("Not enough data to make a sequence (need at least 24 records)")

    # Scale X and y
    scaler_X = StandardScaler()
    scaler_y = StandardScaler()

    X_scaled = scaler_X.fit_transform(df[FEATURES].values)
    y_scaled = scaler_y.fit_transform(df['pm2_5'].values.reshape(-1,1))

    # Create sequences
    sequence_length = 24
    X_sequences, y_sequences = [], []
    for i in range(len(X_scaled) - sequence_length):
        X_sequences.append(X_scaled[i:i+sequence_length])
        y_sequences.append(y_scaled[i+sequence_length])

    X_sequences = np.array(X_sequences)
    y_sequences = np.array(y_sequences)

    model = pm25_model(len(FEATURES))
    
    model.load_state_dict(torch.load("model1_pm25.pth"))
    last_seq = X_sequences[-1]  # shape (24, num_features)
    last_seq = torch.FloatTensor(last_seq).unsqueeze(0)  # shape (1, 24, num_features)

    with torch.no_grad():
        pred_scaled = model(last_seq).numpy()

    pred_pm25 = scaler_y.inverse_transform(pred_scaled)[0][0]
    return pred_pm25

if __name__ == "__main__":
    print(predict_pm25())
    

#add co2 class and predicting function here