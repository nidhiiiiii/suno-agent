const Groq = require('groq-sdk');
const fs = require('fs');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const transcribeAudio = async (audioFilePath, language) => {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-large-v3',
    language: language === 'hindi' ? 'hi' : 'kn',
    response_format: 'text',
  });
  return transcription;
};

const parseBillFromTranscript = async (transcript, language) => {
  const langName = language === 'hindi' ? 'Hindi' : 'Kannada';
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a billing assistant for Indian small shops.
Extract bill items from ${langName} voice transcripts.
Return ONLY valid JSON, no markdown, nothing else.
Convert spoken numbers: ek=1, do=2, teen=3, char=4, paanch=5,
das=10, bees=20, pachaas=50, sau=100, teen sow=300, teen sow pachaas=350.
Kannada: ondu=1, eradu=2, mooru=3, hattu=10, nooru=100.
If price not mentioned set to 0. If customer name not mentioned set to null.
Guess unit: flour/rice/dal/sugar=kg, oil/milk=litre, soap/biscuit=piece.`,
      },
      {
        role: 'user',
        content: `Extract bill from: "${transcript}"
Return:
{
  "customer_name": "string or null",
  "items": [{"name":"English","name_local":"as spoken","qty":2,"unit":"kg","price":80}],
  "total": 350
}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 600,
  });
  const raw = completion.choices[0].message.content;
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
};

module.exports = { transcribeAudio, parseBillFromTranscript };