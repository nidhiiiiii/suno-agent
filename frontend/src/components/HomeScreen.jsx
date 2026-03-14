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
      const transcript = await transcribeAudio(audioBlob, lang);
      const billData = await parseBill(transcript, lang);
      onBillCreated({ billData, transcript, language: lang, shopId: SHOP_ID });
    } catch (err) {
      alert('Error processing audio. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-md-bg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-medium text-md-on-surface">{s.appName}</h1>
          <p className="text-xs text-md-border mt-1">Raju Kirana Store</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-md-surface flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-md-primary"></div>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex gap-2 mb-12">
        {['hindi', 'kannada'].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`flex-1 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
              lang === l
                ? 'bg-md-primary text-white shadow-md'
                : 'bg-md-surface text-md-border hover:bg-md-surface-low'
            }`}
          >
            {l === 'hindi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
          </button>
        ))}
      </div>

      {/* Voice Recording Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <p className="text-sm text-md-border mb-6">{s.voiceHeading}</p>
        
        {loading ? (
          <div className="w-32 h-32 rounded-full bg-md-surface border-2 border-md-border flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-md-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-300 active:scale-95 ${
              recording
                ? 'bg-red-600 border-red-700 animate-pulse shadow-lg'
                : 'bg-md-surface border-md-border hover:shadow-md'
            }`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              recording ? 'bg-red-700' : 'bg-md-primary'
            }`}>
              <span className="text-3xl">{recording ? '🎙️' : '🎤'}</span>
            </div>
          </button>
        )}
        
        <p className="text-md-on-surface font-medium mt-4">
          {loading ? s.processing : recording ? s.recording : s.holdToSpeak}
        </p>
        <p className="text-xs text-md-border text-center mt-2 px-8 leading-relaxed">
          {s.hint}
        </p>
      </div>

      {/* History Button */}
      <button
        onClick={onShowHistory}
        className="w-full flex items-center justify-between bg-md-surface hover:bg-md-surface-low border border-md-border rounded-xl p-4 transition-all duration-300 active:scale-95"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-md-border rounded-md flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-md-primary rounded-full"></div>
          </div>
          <span className="text-sm text-md-on-surface">{s.viewHistory}</span>
        </div>
        <span className="text-md-primary text-xl">›</span>
      </button>
    </div>
  );
}
