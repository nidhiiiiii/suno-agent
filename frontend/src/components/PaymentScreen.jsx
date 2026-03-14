import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { getStrings } from '../i18n';
import { getBillStatus } from '../api';

export default function PaymentScreen({ bill, language }) {
  const s = getStrings(language);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getBillStatus(bill.id);
        if (data.payment_status === 'paid') {
          setPaid(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to check payment status:', err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [bill.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{s.paymentTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">{s.scanSub}</p>
      </div>

      {/* Amount Badge */}
      <div className="relative bg-white border border-gray-200 rounded-3xl p-6 text-center mb-8 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full opacity-50"></div>
        <div className="relative z-10">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {paid ? 'Payment Status' : 'Baaki amount'}
          </p>
          <p className={`text-5xl font-bold mt-3 ${
            paid 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
          }`}>
            ₹{Number(bill.total_amount).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* QR Code or Success State */}
      {paid ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl">
              <span className="text-5xl text-white">✓</span>
            </div>
          </div>
          <p className="text-green-600 text-2xl font-bold">{s.paid}</p>
          <p className="text-gray-500 text-sm mt-3 text-center">
            {bill.customer_name || 'Customer'} ne pay kiya
          </p>
          <div className="mt-8 flex gap-2">
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              ✓ Verified
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          {/* QR Code */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <QRCode value={bill.payment_link} size={220} />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 rounded-full shadow-lg">
                <span className="text-xs font-bold text-white">Scan to Pay</span>
              </div>
            </div>
          </div>

          {/* UPI Apps */}
          <div className="flex gap-2 mt-8 mb-6">
            {['GPay', 'PhonePe', 'Paytm'].map((app) => (
              <div
                key={app}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-default"
              >
                {app}
              </div>
            ))}
          </div>

          {/* Waiting Badge */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{s.waiting}</span>
          </div>
        </div>
      )}
    </div>
  );
}
