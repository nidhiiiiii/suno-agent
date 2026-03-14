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
    <div className="min-h-screen bg-md-bg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-3xl text-md-primary leading-none">
          ‹
        </button>
        <div>
          <h2 className="text-xl font-medium text-md-on-surface">{s.history}</h2>
          <p className="text-xs text-md-border mt-0.5">Aaj {bills.length} bills bane</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-md-surface border border-md-border rounded-xl p-4">
          <p className="text-2xl font-semibold text-green-600">
            ₹{todayTotal.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-md-border mt-1">{s.todaySales}</p>
        </div>
        <div className="flex-1 bg-md-surface border border-md-border rounded-xl p-4">
          <p className="text-2xl font-semibold text-orange-600">
            ₹{pendingTotal.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-md-border mt-1">{s.pending}</p>
        </div>
      </div>

      {/* Bills List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-md-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-md-surface border border-md-border rounded-xl p-4"
            >
              <div className="w-10 h-10 rounded-full bg-md-surface-low flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-md-border">
                  {(item.customer_name || '?').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-md-on-surface">
                  {item.customer_name || 'Customer'}
                </p>
                <p className="text-xs text-md-border mt-0.5">
                  {new Date(item.created_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  · {JSON.parse(item.items).length} items
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-md-on-surface">
                  ₹{Number(item.total_amount).toLocaleString('en-IN')}
                </p>
                <div
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    item.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
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
