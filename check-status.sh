#!/bin/bash

echo "🔍 Checking BoloBill Services..."
echo ""

# Check Backend
if pgrep -f "node index.js" > /dev/null; then
    echo "✅ Backend (Port 8001): RUNNING"
else
    echo "❌ Backend (Port 8001): STOPPED"
fi

# Check Frontend
if pgrep -f "vite" > /dev/null; then
    echo "✅ Frontend (Port 3000): RUNNING"
else
    echo "❌ Frontend (Port 3000): STOPPED"
fi

echo ""
echo "📊 Process Details:"
ps aux | grep -E "(node index|vite)" | grep -v grep
