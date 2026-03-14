const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const db = require('../db/client');
const { transcribeAudio, parseBillFromTranscript } = require('../services/groq');
const { generatePaymentLink } = require('../services/razorpay');
const upload = multer({ dest: 'uploads/' });

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const { language } = req.body;
    const transcript = await transcribeAudio(req.file.path, language);
    fs.unlinkSync(req.file.path);
    res.json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

router.post('/parse', async (req, res) => {
  try {
    const { transcript, language } = req.body;
    const bill = await parseBillFromTranscript(transcript, language);
    res.json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Parsing failed' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { shop_id, customer_name, items, total_amount, voice_transcript } = req.body;
    const shopResult = await db.query('SELECT name FROM shops WHERE id=$1', [shop_id]);
    const shopName = shopResult.rows[0]?.name || 'Shop';
    const payment = await generatePaymentLink(total_amount, customer_name, shopName);
    const result = await db.query(
      `INSERT INTO bills (shop_id,customer_name,items,total_amount,voice_transcript,payment_link,razorpay_payment_link_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [shop_id, customer_name, JSON.stringify(items), total_amount,
       voice_transcript, payment.url, payment.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

router.get('/status/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT payment_status FROM bills WHERE id=$1', [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

router.get('/:shopId', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM bills WHERE shop_id=$1 ORDER BY created_at DESC',
      [req.params.shopId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

module.exports = router;