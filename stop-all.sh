#!/bin/bash
echo "🛑 Stopping BoloBill Services..."

# Stop Backend
pkill -f "node index.js" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend stopped"
else
    echo "⚠️  Backend was not running"
fi

# Stop Frontend
pkill -f "vite" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend stopped"
else
    echo "⚠️  Frontend was not running"
fi

echo ""
echo "🛑 All services stopped"