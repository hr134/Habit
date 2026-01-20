#!/bin/bash
# Initialize DB
echo "Initializing database..."
python -c "from app import app, db; with app.app_context(): db.create_all()"

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn -w 4 -b 0.0.0.0:$PORT app:app
