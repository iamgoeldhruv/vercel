#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Check if GITHUB_URL is set
if [ -z "$GITHUB_URL" ]; then
    echo "Error: GITHUB_URL is not set in .env"
    exit 1
fi

# Remove existing directory if it exists
if [ -d "/home/app/output" ]; then
    echo "Removing existing output directory..."
    rm -rf /home/app/output
fi

# Clone the repository into /home/app/output
git clone "$GITHUB_URL" /home/app/output

# Navigate to the cloned repository
cd /home/app/output || exit

# Run script.js
node script.js



