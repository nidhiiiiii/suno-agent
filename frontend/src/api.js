import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL;

export const transcribeAudio = async (audioBlob, language) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm');
  formData.append('language', language);
  const res = await axios.post(`${BASE}/api/bills/transcribe`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.transcript;
};

export const parseBill = async (transcript, language) => {
  const res = await axios.post(`${BASE}/api/bills/parse`, { transcript, language });
  return res.data;
};

export const saveBill = async (payload) => {
  const res = await axios.post(`${BASE}/api/bills`, payload);
  return res.data;
};

export const getBills = async (shopId) => {
  const res = await axios.get(`${BASE}/api/bills/${shopId}`);
  return res.data;
};

export const getBillStatus = async (billId) => {
  const res = await axios.get(`${BASE}/api/bills/status/${billId}`);
  return res.data;
};
