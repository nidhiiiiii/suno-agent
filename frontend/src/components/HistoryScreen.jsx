import { useEffect, useState } from 'react';
import { getStrings } from '../i18n';
import { getBills } from '../api';

export default function HistoryScreen({ shopId, language, onBack }) {
  const s = getStrings(language);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBills(shopId)
      .then(setBills)
      .finally(() => setLoading(false));
  }, [shopId]);

  const today = new Date().toDateString();
  const todayTotal = bills
    .filter((b) => new Date(b.created_at).toDateString() === today)
    .reduce((sum, b) => sum + Number(b.total_amount), 0);
  const pendingTotal = bills
    .filter((b) => b.payment_status === 'pending')
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-white p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl text-purple-600 hover:bg-gray-50 hover:scale-105 transition-all shadow-sm"
        >
          ‹
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{s.history}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Aaj {bills.length} bills bane</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-2xl font-bold text-green-600">
              ₹{todayTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-xs font-medium text-green-700">{s.todaySales}</p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <p className="text-2xl font-bold text-orange-600">
              ₹{pendingTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-xs font-medium text-orange-700">{s.pending}</p>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Recent Bills</h3>
        <span className="text-xs text-gray-400">{bills.length} total</span>
      </div>

      {/* Bills List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      ) : bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <p className="text-gray-500 font-medium">No bills yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first bill to see it here</p>
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          {bills.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-200 hover:shadow-md transition-all duration-300 active:scale-98"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-sm font-bold text-purple-600">
                  {(item.customer_name || '?').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.customer_name || 'Customer'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(item.created_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  · <span className="font-medium">{JSON.parse(item.items).length} items</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">
                  ₹{Number(item.total_amount).toLocaleString('en-IN')}
                </p>
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-1.5 ${
                    item.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    item.payment_status === 'paid' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  {item.payment_status === 'paid' ? s.statusPaid : s.statusPending}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
