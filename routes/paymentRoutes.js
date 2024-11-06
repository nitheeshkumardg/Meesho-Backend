const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Q67t5FjBO2aKAV34zABWY9ZqkGKFJWoiRdJAeUEpOm5nzDvfplflQ1Y5jru4ckmTlzLyJwK3WDvnEoiV95hJsPu001yU2S90J'); 


router.post('/create-payment', async (req, res) => {
  const { amount, currency, paymentMethodId } = req.body;

  try {
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });

    
    if (paymentIntent.status === 'succeeded') {
     
      return res.status(200).json({ success: true, message: 'Payment successful', paymentIntent });
    } else if (paymentIntent.status === 'requires_action') {
      
      return res.status(200).json({
        success: false,
        requiresAction: true,
        paymentIntentId: paymentIntent.id,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error });
  }
});

module.exports = router;
