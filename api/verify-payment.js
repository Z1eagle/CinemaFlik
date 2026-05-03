// api/verify-payment.js
const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { transactionId, amount, network } = req.body;
  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'Transaction ID required' });
  }

  try {
    // Replace with the actual MoneyUnify verification endpoint they give you
    const response = await axios.post('https://api.moneyunify.com/v1/verify', {
      auth_id: process.env.MONEYUNIFY_AUTH_ID,
      transaction_id: transactionId,
      amount: amount,
      operator: network.toUpperCase()
    });

    const data = response.data;
    if (data.status === 'SUCCESS' || data.success === true) {
      return res.json({
        success: true,
        videoUrl: process.env.PRIVATE_VIDEO_URL  // secret link only revealed here
      });
    } else {
      return res.json({ success: false, message: 'Payment not found. Check your transaction ID.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification failed. Try again.' });
  }
}
