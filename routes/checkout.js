const express = require('express');
const router = express.Router();
const braintree = require('braintree');

router.post('/braintree', (req, res, next) => {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 'kmwtscn7dfptvwqj',
    publicKey: 'yxrhpm6s575hbw6w',
    privateKey: '686e53905a892a16d58554fbcc7cc70f'
  });
  console.log(gateway);

  // Use the payment method nonce here
  console.log(req.body.paymentMethodNonce);
  const nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  const newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, (error, result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

module.exports = router;
