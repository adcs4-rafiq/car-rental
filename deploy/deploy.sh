#!/bin/bash
set -e

echo "==> Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

echo "==> Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "==> Waiting for health check..."
sleep 10

STATUS=$(curl -s http://localhost:5000/api/status | grep -o '"status":"ok"' || true)
if [ -n "$STATUS" ]; then
  echo "✅ Deployment successful! DriveEasy is live."
else
  echo "❌ Health check failed. Check logs: docker compose logs"
  exit 1
fi

echo "==> Running containers:"
docker ps
