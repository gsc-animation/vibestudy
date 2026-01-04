#!/bin/bash

# Navigate to the backend directory to ensure relative paths work
cd "$(dirname "$0")/.."

# Load .env variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo ".env file not found in backend directory"
  exit 1
fi

# Check if MONGO_URI is set
if [ -z "$MONGO_URI" ]; then
  echo "MONGO_URI is not set in .env"
  exit 1
fi

# Create backups directory if it doesn't exist
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

echo "Starting backup of $MONGO_URI to $BACKUP_PATH..."

# Perform backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_PATH"

if [ $? -eq 0 ]; then
  echo "Backup completed successfully at $BACKUP_PATH"
else
  echo "Backup failed"
  exit 1
fi