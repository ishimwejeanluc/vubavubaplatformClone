#!/bin/bash

echo " Stopping VubaVuba Platform..."
pkill -f "node server.js"
echo "All services stopped."
echo "VubaVuba Platform has been stopped."