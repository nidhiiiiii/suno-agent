#!/bin/bash
echo "🚀 Starting Frontend..."
cd /app/frontend

# Kill existing frontend
pkill -f "vite" 2>/dev/null

# Start frontend
nohup npm run dev > /var/log/frontend.log 2>&1 &

sleep 3

if pgrep -f "vite" > /dev/null; then
    echo "✅ Frontend started on port 3000"
    echo "📝 Logs: tail -f /var/log/frontend.log"
else
    echo "❌ Frontend failed to start"
    echo "Check logs: tail -20 /var/log/frontend.log"
fi