#!/bin/bash
set -e

# Start PostgreSQL service
service postgresql start

# Execute your application
npm run dev
