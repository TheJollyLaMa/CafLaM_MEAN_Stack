const express = require('express');
const router = express.Router();
var path = require('path')
const braintree = require('braintree');
const db = require('../db');
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
  // console.log(req.body);
  // console.log(nonce);
  // console.log(amount);
  // console.log(devicedata);
  console.log("Transaction posting ...");
  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: 'fake-valid-nonce', //nonce
    deviceData: devicedata,
    options: {submitForSettlement: true}
  }, function (err, receipt) {
    console.log(receipt);
    if (!receipt.success) {
      console.log(receipt.success);
      res.json({msg: "transaction error", result: receipt});
    }else{
      /* --- Trigger backend serverside functions ---*/
          /* --- Send Order to Database --- */
          var receipt = receipt.transaction;
            // _id, _buyer, _email, _payment_status, _total, _cart
          receipt.customFields = {cart: "testing custom cart field. Should be a string of products and quantities ...."};
          var _id = receipt.paymentReceipt.id, _name = receipt.customer.firstName + " " + receipt.customer.lastName, _email = receipt.customer.email, _status = receipt.paymentReceipt.processorResponseText, _amount = receipt.paymentReceipt.amount, _cart = receipt.customFields;
          // console.log(_id,_name,_email,_status,_amount,_cart);
          // res.order_post_response = db.post_new_order(_id, _name, _email, _status, _amount, _cart);
          /* --- Update inventory --- */
          /* --- Tally Promocode Usage --- */
          /* --- send Confirmation Email --- */
          /* --- send to Shipstation --- */
          res.json({msg:'successfully charged your sandbox dashboard!', result: receipt});
    }
  })
})

module.exports = router;
