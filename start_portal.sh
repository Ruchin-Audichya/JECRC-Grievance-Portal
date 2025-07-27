#!/bin/bash

echo "====================================="
echo "JECRC GRIEVANCE PORTAL LAUNCHER"
echo "By: Ruchin Audichya (23BCON0208)"
echo "====================================="
echo

echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "Node.js found!"
echo

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies for first time..."
    echo "This may take 2-3 minutes..."
    npm install
    echo
fi

echo "Starting JECRC Grievance Portal..."
echo
echo "Portal will open at: http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo

npm run dev