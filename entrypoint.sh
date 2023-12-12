#!/bin/bash
set -e


service postgresql start
npm run dev
