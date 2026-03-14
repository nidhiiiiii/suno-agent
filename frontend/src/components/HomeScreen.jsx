import { useState, useRef } from 'react';
import { getStrings } from '../i18n';
import { transcribeAudio, parseBill } from '../api';

const SHOP_ID = import.meta.env.VITE_SHOP_ID;

export default function HomeScreen({ onBillCreated, onShowHistory }) {
  const [lang, setLang] = useState('hindi');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const s = getStrings(lang);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (err) {
      alert('Could not access microphone: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    setLoading(true);
    try {
      console.log('Processing audio...', audioBlob.size, 'bytes');
      const transcript = await transcribeAudio(audioBlob, lang);
      console.log('Transcript:', transcript);
      const billData = await parseBill(transcript, lang);
      console.log('Bill data:', billData);
      onBillCreated({ billData, transcript, language: lang, shopId: SHOP_ID });
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error processing audio';
      alert('Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {s.appName}
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Raju Kirana Store</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-inner"></div>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex gap-2 mb-8">
        {['hindi', 'kannada'].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm ${
              lang === l
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {l === 'hindi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
          </button>
        ))}
      </div>

      {/* Voice Recording Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-8">
          <p className="text-sm text-purple-700 font-medium">{s.voiceHeading}</p>
        </div>

        {loading ? (
          <div className="relative">
            <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping opacity-20"></div>
            <div className="w-36 h-36 rounded-full bg-white border-4 border-purple-100 flex items-center justify-center shadow-xl">
              <div className="animate-spin w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : (
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-2xl hover:shadow-purple-200 ${
              recording
                ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse'
                : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105'
            }`}
          >
            <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"></div>
            <div className="relative z-10 w-28 h-28 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <span className="text-4xl">{recording ? '🎙️' : '🎤'}</span>
            </div>
            {recording && (
              <div className="absolute -inset-4 rounded-full border-4 border-red-300 animate-ping opacity-30"></div>
            )}
          </button>
        )}

        <p className="text-gray-800 font-semibold text-lg mt-8">
          {loading ? s.processing : recording ? s.recording : s.holdToSpeak}
        </p>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-2xl mt-4 max-w-xs">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            {s.hint}
          </p>
        </div>
      </div>

      {/* History Button */}
      <button
        onClick={onShowHistory}
        className="w-full flex items-center justify-between bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-5 transition-all duration-300 active:scale-98 shadow-sm hover:shadow-md group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">{s.viewHistory}</span>
        </div>
        <span className="text-purple-500 text-2xl group-hover:translate-x-1 transition-transform">›</span>
      </button>
    </div>
  );
}
