# Root Dockerfile - For Render deployment
# This file deploys the backend service

FROM python:3.11-slim as builder

WORKDIR /app

# Copy requirements first
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy backend application
COPY backend/ .

# Copy data directory
COPY data_collection/ ../data_collection/

# Create data directory
RUN mkdir -p /app/data_collection

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/api/health')" || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
