#!/bin/bash

DEBUG_MODE=${1:-false}

if [ "$DEBUG_MODE" = "debug" ]; then
    echo " Starting in DEBUG mode..."
    export NODE_ENV=development
    export DEBUG=*
else
    echo "Starting in NORMAL mode..."
fi

echo "Starting VUBA Platform..."
echo "========================"

# Kill existing processes
pkill -f "node.*server.js" 2>/dev/null || true
sleep 2

echo ""
echo " Starting services..."

# Start Auth Service
echo " Starting Auth Service..."
cd auth-service
if [ "$DEBUG_MODE" = "debug" ]; then
    echo "   Debug Port: 9229"
    node --inspect=0.0.0.0:9229 --trace-warnings server.js &
else
    node server.js &
fi
AUTH_PID=$!
sleep 2

# Start Merchant Service  
echo " Starting Merchant Service..."
cd ../merchant-service
if [ "$DEBUG_MODE" = "debug" ]; then
    echo "   Debug Port: 9230"
    node --inspect=0.0.0.0:9230 --trace-warnings server.js &
else
    node server.js &
fi
MERCHANT_PID=$!
sleep 2

# Start Order Service
echo " Starting Order Service..."
cd ../order-service
if [ "$DEBUG_MODE" = "debug" ]; then
    echo "   Debug Port: 9231"
    node --inspect=0.0.0.0:9231 --trace-warnings server.js &
else
    node server.js &
fi
ORDER_PID=$!
sleep 2

# Start Rider Service
echo " Starting Rider Service..."
cd ../rider-service
if [ "$DEBUG_MODE" = "debug" ]; then
    echo "   Debug Port: 9232"
    node --inspect=0.0.0.0:9232 --trace-warnings server.js &
else
    node server.js &
fi
RIDER_PID=$!
sleep 2

# Start API Gateway
echo " Starting API Gateway..."
cd ../api-gateway
if [ "$DEBUG_MODE" = "debug" ]; then
    echo "   Debug Port: 9234"
    node --inspect=0.0.0.0:9234 --trace-warnings server.js &
else
    node server.js &
fi
GATEWAY_PID=$!
sleep 3

echo ""
echo " All services started!"
echo "========================"
echo "Process IDs:"
echo "  Auth Service:     PID $AUTH_PID"
echo "  Merchant Service: PID $MERCHANT_PID"
echo "  Order Service:    PID $ORDER_PID"
echo "  API Gateway:      PID $GATEWAY_PID"

if [ "$DEBUG_MODE" = "debug" ]; then
    echo ""
    echo " DEBUG PORTS:"
    echo "  Auth Service:     chrome://inspect -> localhost:9229"
    echo "   Merchant Service: chrome://inspect -> localhost:9230"
    echo "  Order Service:   chrome://inspect -> localhost:9231"
    echo "  API Gateway:      chrome://inspect -> localhost:9232"
fi

echo ""
echo " SERVICE URLS:"
echo "  API Gateway:      http://localhost:3000"
echo "  Auth Service:     http://localhost:4000"
echo "  Merchant Service: http://localhost:5000"
echo "  Order Service:    http://localhost:6000"
echo ""
echo "All service logs will appear in this console"
echo "Press Ctrl+C to stop all services"
echo "=========================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo " Stopping all services..."
    kill $AUTH_PID $MERCHANT_PID $ORDER_PID $RIDER_PID $GATEWAY_PID 2>/dev/null
    pkill -f "node.*server.js" 2>/dev/null
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait