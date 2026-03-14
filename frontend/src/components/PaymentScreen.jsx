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
    <div className="min-h-screen bg-md-bg p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-md-on-surface">{s.paymentTitle}</h2>
        <p className="text-sm text-md-border mt-1">{s.scanSub}</p>
      </div>

      {/* Amount Badge */}
      <div className="bg-md-surface border border-md-border rounded-xl p-6 text-center mb-10">
        <p className="text-sm text-md-border">{paid ? s.paid : 'Baaki amount'}</p>
        <p className="text-4xl font-semibold text-md-on-surface mt-2">
          ₹{Number(bill.total_amount).toLocaleString('en-IN')}
        </p>
      </div>

      {/* QR Code or Success State */}
      {paid ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <p className="text-green-600 text-2xl font-semibold">{s.paid}</p>
          <p className="text-md-border text-sm mt-2">
            {bill.customer_name || 'Customer'} ne pay kiya
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <QRCode value={bill.payment_link} size={200} />
          </div>

          {/* UPI Apps */}
          <div className="flex gap-2 mb-6">
            {['GPay', 'PhonePe', 'Paytm'].map((app) => (
              <div
                key={app}
                className="bg-md-surface border border-md-border rounded-lg px-4 py-2 text-sm text-md-border"
              >
                {app}
              </div>
            ))}
          </div>

          {/* Waiting Badge */}
          <div className="flex items-center gap-3 bg-md-surface border border-md-border rounded-full px-5 py-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-md-border">{s.waiting}</span>
          </div>
        </div>
      )}
    </div>
  );
}
