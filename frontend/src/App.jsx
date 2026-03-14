import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import BillPreviewScreen from './components/BillPreviewScreen';
import PaymentScreen from './components/PaymentScreen';
import HistoryScreen from './components/HistoryScreen';

function App() {
  const [screen, setScreen] = useState('home');
  const [billContext, setBillContext] = useState(null);
  const [savedBill, setSavedBill] = useState(null);

  const handleBillCreated = (context) => {
    setBillContext(context);
    setScreen('preview');
  };

  const handleBillSaved = (bill) => {
    setSavedBill(bill);
    setScreen('payment');
  };

  const handleShowHistory = () => {
    setScreen('history');
  };

  const handleBack = () => {
    setScreen('home');
    setBillContext(null);
    setSavedBill(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
      {screen === 'home' && (
        <HomeScreen onBillCreated={handleBillCreated} onShowHistory={handleShowHistory} />
      )}
      {screen === 'preview' && billContext && (
        <BillPreviewScreen
          billData={billContext.billData}
          transcript={billContext.transcript}
          language={billContext.language}
          shopId={billContext.shopId}
          onBack={handleBack}
          onSaved={handleBillSaved}
        />
      )}
      {screen === 'payment' && savedBill && (
        <PaymentScreen bill={savedBill} language={billContext?.language || 'hindi'} />
      )}
      {screen === 'history' && (
        <HistoryScreen
          shopId={import.meta.env.VITE_SHOP_ID}
          language={'hindi'}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
