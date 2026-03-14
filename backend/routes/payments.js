const express = require('express');
const router = express.Router();
const db = require('../db/client');

router.post('/webhook', async (req, res) => {
  try {
    const { razorpay_payment_link_id, razorpay_payment_id } = req.body;
    await db.query(
      `UPDATE bills SET payment_status='paid', razorpay_payment_link_id=$1
      WHERE razorpay_payment_link_id=$2`,
      [razorpay_payment_id, razorpay_payment_link_id]
    );
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: 'Webhook failed' });
  }
});

router.get('/webhook', async (req, res) => {
  try {
    const { razorpay_payment_link_id, razorpay_payment_id } = req.query;
    await db.query(
      `UPDATE bills SET payment_status='paid'
      WHERE razorpay_payment_link_id=$1`,
      [razorpay_payment_link_id]
    );
    res.send('<h1>Payment Successful!</h1><p>Thank you for your payment.</p>');
  } catch (err) {
    res.status(500).send('<h1>Error</h1><p>Payment processing failed.</p>');
  }
});

module.exports = router;