#!/bin/bash

echo "Starting Auth Service..."
(cd auth-service && npm i && node server.js &)

echo "Starting API Gateway..."
(cd api-gateway && npm i && node server.js &)

echo "All services started!"
echo "Auth-Service:  http://localhost:4000"
echo "API-Gateway:   http://localhost:3000"
wait
