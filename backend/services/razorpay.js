const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generatePaymentLink = async (totalAmount, customerName, shopName) => {
  const link = await razorpay.paymentLink.create({
    amount: Math.round(totalAmount * 100),
    currency: 'INR',
    description: `Bill from ${shopName}`,
    customer: { name: customerName || 'Customer' },
    notify: { sms: false, email: false },
    reminder_enable: false,
    callback_url: `${process.env.BACKEND_URL}/payments/webhook`,
    callback_method: 'get',
  });
  return { url: link.short_url, id: link.id };
};

module.exports = { generatePaymentLink };