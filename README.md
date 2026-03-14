# 🎤 BoloBill - Voice-Based Billing App

> **Revolutionary billing app for Indian kirana stores** - Just speak in Hindi or Kannada, and AI creates your bill with payment links!

## 🚀 **What's Built**

### ✅ **Backend (Express.js)** - Port 8001
- Voice transcription (Groq Whisper-large-v3)
- AI bill parsing (LLaMA 3.3-70b)
- Razorpay payment links
- PostgreSQL database (Neon.tech)
- Real-time payment tracking

### ✅ **Web App (React + Vite)** - Port 3000
- Material You (Material Design 3) design
- Voice recording with Web Audio API
- 4 screens: Home, Bill Preview, Payment, History
- Hindi & Kannada language support
- Real-time payment status polling

### ✅ **Mobile App (Coming Soon)**
- Expo/React Native version
- Same features as web
- Native audio recording

## 🎯 **Features**

1. **Voice Recording** - Hold and speak in Hindi/Kannada
2. **AI Transcription** - Groq Whisper converts speech to text
3. **Smart Parsing** - AI extracts items, quantities, prices
4. **Bill Preview** - Edit items before confirming
5. **Payment Links** - Razorpay UPI QR code generation
6. **Payment Tracking** - Real-time status updates
7. **Bill History** - View all bills with sales summary

## 🔑 **API Keys Configured**

- ✅ Groq API (Whisper + LLaMA)
- ✅ Razorpay (Test Mode)
- ✅ Neon.tech PostgreSQL
- ✅ Test Shop Created: `e2bcefed-eeb4-4182-b869-5f35914fcf07`

## 📱 **How to Use (Web App)**

1. **Select Language**: Choose Hindi (हिन्दी) or Kannada (ಕನ್ನಡ)
2. **Record Voice**: Hold the microphone button and speak
   - Example: "Raju ko do kilo aata, ek litre tel, teen sow rupay"
3. **Review Bill**: AI will show extracted items
4. **Edit if needed**: Adjust prices or customer name
5. **Confirm**: Generate payment link with QR code
6. **Track Payment**: App polls for payment status
7. **View History**: See all bills and daily sales

## 🛠️ **Tech Stack**

**Backend:**
- Express.js
- Groq SDK (Whisper + LLaMA 3.3)
- Razorpay
- PostgreSQL (pg)
- Multer (file uploads)

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Axios
- React QR Code
- Web Audio API

**Design:**
- Material You (Material Design 3)
- Purple seed color (#6750A4)
- Tonal surfaces, pill buttons
- Roboto font

## 📊 **Database Schema**

```sql
shops:
  - id (UUID)
  - name (TEXT)
  - phone (TEXT, unique)
  - language (TEXT)
  
bills:
  - id (UUID)
  - shop_id (UUID)
  - customer_name (TEXT)
  - items (JSONB)
  - total_amount (NUMERIC)
  - voice_transcript (TEXT)
  - payment_link (TEXT)
  - payment_status (TEXT)
```

## 🧪 **Testing**

Test the AI parsing:
```bash
curl -X POST http://localhost:8001/api/bills/parse \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Raju ko do kilo aata aur ek litre tel, teen sow rupay","language":"hindi"}'
```

## 🎨 **Design System (Material You)**

- **Colors**: Purple primary, tonal surfaces
- **Buttons**: Pill-shaped (rounded-full)
- **Cards**: Large radius (24px)
- **Shadows**: Subtle elevation
- **Typography**: Roboto (400, 500, 700)

## 📝 **API Endpoints**

- `POST /api/bills/transcribe` - Transcribe audio
- `POST /api/bills/parse` - Parse transcript to bill
- `POST /api/bills` - Create bill with payment link
- `GET /api/bills/status/:id` - Get payment status
- `GET /api/bills/:shopId` - Get all bills
- `POST /api/payments/webhook` - Razorpay webhook

## 🚀 **Services Running**

- **Backend**: http://localhost:8001
- **Frontend**: http://localhost:3000
- **Database**: Neon.tech (cloud)

## 🎬 **For Your Loom Demo**

The web app is PERFECT for your laptop demo! It has:
- ✅ Beautiful Material You design
- ✅ Smooth animations
- ✅ Voice recording (works in browser)
- ✅ Real-time AI processing
- ✅ Payment QR codes
- ✅ Bill history

Just open http://localhost:3000 in your browser and start recording!

## 📦 **Next Steps**

1. ✅ Backend API ready
2. ✅ Web app ready for demo
3. 🔄 Mobile app (Expo) - Optional
4. 🔄 Voice summary feature - Bonus

---

**Built with ❤️ for Indian kirana stores**
