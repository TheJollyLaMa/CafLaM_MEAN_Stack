const express = require('express');
const router = express.Router();
var path = require('path')
const braintree = require('braintree');
require('dotenv').config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  // Use your own credentials from the sandbox Control Panel here
  merchantId: process.env.BRAINTREE_SANDBOX_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_SANDBOX_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_SANDBOX_PRIVATE
});
// console.log(gateway);

router.post('/braintree/client-token', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    if (err || !response || !response.clientToken) {
      if (err.name === 'authenticationError') {
        console.error('Please fill in examples/server.js with your credentials from Account->API Keys in your Sandbox dashboard: https://sandbox.braintreegateway.com/')
        console.error('Using a dummy client token... this may or may not work')
        res.send(dummyClientToken)
      } else {
        console.error(err)
        res.send(err)
      }
    } else {
      var clientToken = response.clientToken
      // console.log(clientToken);
      res.send(clientToken)
      // console.log(clientToken);
    }
  })
})

router.post('/braintree/buy', function (req, res) {
  var nonce = req.body.payment_method_nonce;
  var amount = req.body.payment_amount;
  var devicedata = req.body.device_data;
  console.log(req.body);
  console.log(nonce);
  console.log(amount);
  console.log(devicedata);
  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: 'fake-valid-nonce', //nonce
    deviceData: devicedata,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    // console.log(result);
    if (!result.success) {
      console.log(result.errors);
      res.json({error: result.message});
    } else {
      res.json({msg:'successfully charged your sandbox dashboard!', result: result});
    }
  })
})

module.exports = router;
