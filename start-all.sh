#!/bin/bash
echo "🚀 Starting BoloBill Services..."
echo ""

# Start Backend
echo "1️⃣ Starting Backend..."
cd /app/backend
pkill -f "node index.js" 2>/dev/null
nohup node index.js > /var/log/backend.log 2>&1 &
sleep 2

if pgrep -f "node index.js" > /dev/null; then
    echo "   ✅ Backend running on port 8001"
else
    echo "   ❌ Backend failed"
fi

echo ""

# Start Frontend
echo "2️⃣ Starting Frontend..."
cd /app/frontend
pkill -f "vite" 2>/dev/null
nohup npm run dev > /var/log/frontend.log 2>&1 &
sleep 3

if pgrep -f "vite" > /dev/null; then
    echo "   ✅ Frontend running on port 3000"
else
    echo "   ❌ Frontend failed"
fi

echo ""
echo "🎉 BoloBill is ready!"
echo "📱 Access: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8001/api/health"
echo ""
echo "📊 Check status: /app/check-status.sh"
echo "📝 Backend logs: tail -f /var/log/backend.log"
echo "📝 Frontend logs: tail -f /var/log/frontend.log"