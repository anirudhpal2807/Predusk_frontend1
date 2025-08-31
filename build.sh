#!/bin/bash
set -e

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Make vite executable
echo "Setting permissions..."
chmod +x node_modules/.bin/vite

# Run build
echo "Running build..."
npx vite build

echo "Build completed successfully!"
