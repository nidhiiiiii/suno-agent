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
    <div className="min-h-screen bg-md-bg p-6">
      {/* Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-3xl text-md-primary leading-none">
          ‹
        </button>
        <div>
          <h2 className="text-lg font-medium text-md-on-surface">{s.billPreview}</h2>
          <p className="text-xs text-md-border mt-0.5">{s.confirmSub}</p>
        </div>
      </div>

      {/* Voice Transcript Badge */}
      <div className="flex items-start gap-2 bg-md-surface border border-md-border rounded-xl p-3 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
        <p className="text-xs text-md-border flex-1 leading-relaxed">{transcript}</p>
      </div>

      {/* Customer Name Input */}
      <input
        type="text"
        placeholder={s.customer}
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        className="w-full bg-md-surface border border-md-border rounded-xl px-4 py-3 text-sm text-md-on-surface placeholder-md-border mb-4 focus:outline-none focus:ring-2 focus:ring-md-primary"
      />

      {/* Items Card */}
      <div className="bg-md-surface border border-md-border rounded-xl overflow-hidden mb-6">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-3 ${
              i > 0 ? 'border-t border-md-border' : ''
            }`}
          >
            <div className="flex-1">
              <p className="text-sm text-md-on-surface">{item.name}</p>
              <p className="text-xs text-md-border mt-0.5">
                {item.qty} {item.unit}
              </p>
            </div>
            <input
              type="number"
              value={item.price}
              onChange={(e) => updatePrice(i, e.target.value)}
              className="w-20 bg-md-surface-low rounded-lg px-3 py-2 text-sm text-md-on-surface font-medium text-right focus:outline-none focus:ring-2 focus:ring-md-primary"
            />
          </div>
        ))}
        
        {/* Total Row */}
        <div className="flex justify-between items-center px-4 py-3.5 bg-md-surface-low border-t border-md-border">
          <span className="text-sm text-md-border">{s.total}</span>
          <span className="text-2xl font-semibold text-md-primary">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 bg-md-surface border border-md-border rounded-full text-sm font-medium text-md-border hover:bg-md-surface-low transition-all duration-300 active:scale-95"
        >
          ✎ {s.edit}
        </button>
        <button
          onClick={confirmBill}
          disabled={saving}
          className="flex-2 py-3.5 bg-md-primary rounded-full text-sm font-semibold text-white hover:bg-md-primary/90 transition-all duration-300 active:scale-95 disabled:opacity-50 px-8"
        >
          {saving ? '...' : `✓ ${s.confirm}`}
        </button>
      </div>
    </div>
  );
}
