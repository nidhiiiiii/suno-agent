#!/bin/bash
echo "🚀 Starting Backend..."
cd /app/backend

# Kill existing backend
pkill -f "node index.js" 2>/dev/null

# Start backend
nohup node index.js > /var/log/backend.log 2>&1 &

sleep 2

if pgrep -f "node index.js" > /dev/null; then
    echo "✅ Backend started on port 8001"
    echo "📝 Logs: tail -f /var/log/backend.log"
else
    echo "❌ Backend failed to start"
    echo "Check logs: tail -20 /var/log/backend.log"
fi