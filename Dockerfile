FROM python:3.10-slim

# Install System Dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libtesseract-dev \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn psycopg2-binary

COPY . .

# Make start script executable
RUN chmod +x start.sh

EXPOSE 5000

# Set default port if not provided by Render
ENV PORT=5000

CMD ["./start.sh"]
