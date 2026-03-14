import { useState } from 'react';
import { getStrings } from '../i18n';
import { saveBill } from '../api';

export default function BillPreviewScreen({ billData, transcript, language, shopId, onBack, onSaved }) {
  const s = getStrings(language);
  const [items, setItems] = useState(billData.items);
  const [customer, setCustomer] = useState(billData.customer_name || '');
  const [saving, setSaving] = useState(false);

  const total = items.reduce((sum, i) => sum + (Number(i.qty) * Number(i.price)), 0);

  const updatePrice = (index, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], price: Number(value) || 0 };
    setItems(updated);
  };

  const confirmBill = async () => {
    setSaving(true);
    try {
      const saved = await saveBill({
        shop_id: shopId,
        customer_name: customer || null,
        items,
        total_amount: total,
        voice_transcript: transcript,
      });
      onSaved(saved);
    } catch (e) {
      alert('Failed to save bill');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-white p-6">
      {/* Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl text-purple-600 hover:bg-gray-50 hover:scale-105 transition-all shadow-sm"
        >
          ‹
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{s.billPreview}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{s.confirmSub}</p>
        </div>
      </div>

      {/* Voice Transcript Badge */}
      <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full mt-0.5 flex-shrink-0 shadow-sm"></div>
        <p className="text-xs text-gray-600 flex-1 leading-relaxed">{transcript}</p>
      </div>

      {/* Customer Name Input */}
      <input
        type="text"
        placeholder={s.customer}
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
      />

      {/* Items Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Items</p>
        </div>
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-3.5 ${
              i > 0 ? 'border-t border-gray-100' : ''
            } hover:bg-gray-50 transition-colors`}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.qty} {item.unit}
              </p>
            </div>
            <input
              type="number"
              value={item.price}
              onChange={(e) => updatePrice(i, e.target.value)}
              className="w-24 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-800 font-semibold text-right focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500"
            />
          </div>
        ))}

        {/* Total Row */}
        <div className="flex justify-between items-center px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t-2 border-purple-100">
          <span className="text-sm font-semibold text-purple-700">{s.total}</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 active:scale-95 shadow-sm"
        >
          ✎ {s.edit}
        </button>
        <button
          onClick={confirmBill}
          disabled={saving}
          className="flex-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-sm font-bold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 active:scale-95 disabled:opacity-50 shadow-lg shadow-purple-200 px-8"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </span>
          ) : (
            `✓ ${s.confirm}`
          )}
        </button>
      </div>
    </div>
  );
}
