#!/bin/bash

# Niche Pulse - Quick Deploy Script

echo "=== Niche Pulse Deployment Script ==="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create .env file from .env.example and configure all variables."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed!"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed!"
    echo "Please install Docker Compose first."
    exit 1
fi

echo "1. Stopping existing containers..."
docker-compose down

echo ""
echo "2. Building Docker images..."
docker-compose build

echo ""
echo "3. Starting services..."
docker-compose up -d

echo ""
echo "4. Waiting for services to be ready..."
sleep 10

echo ""
echo "5. Checking service status..."
docker-compose ps

echo ""
echo "=== Deployment Complete! ==="
echo ""
echo "Your application should be running at:"
echo "- HTTP: http://localhost (port 80)"
echo "- Application: http://localhost:3000 (direct access)"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
