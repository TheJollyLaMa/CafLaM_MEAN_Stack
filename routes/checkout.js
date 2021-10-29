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
  var _nonce = req.body.payment_method_nonce;
  var _amount = req.body.payment_amount;
  var _devicedata = req.body.device_data;
  var _billingAddress = req.body.customer.billing;
  var _shippingAddress = req.body.customer.shipping;
  var _customer = req.body.customer;
  var _cart = req.body.cart;
  var _discountAmount = req.body.discountAmount;
  var _promo_code = req.body.promocode;
console.log(typeof _discountAmount);
  // console.log(_customer);
  // console.log(_cart);
  console.log("Transaction posting ...");

  gateway.transaction.sale({
    amount: _amount,
    customFields: {promocode: JSON.stringify(_promo_code), discountamount: JSON.stringify(String(_discountAmount)), cart: JSON.stringify(_cart)},
    deviceData: _devicedata,
    options: {submitForSettlement: true},
    paymentMethodNonce: 'fake-valid-nonce', //nonce
    customer: {
      firstName: _customer.profile.first_name,
      lastName: _customer.profile.last_name,
      email: _customer.profile.email
    },
    billing: {
      firstName: _customer.billing.first_name,
      lastName: _customer.billing.last_name,
      streetAddress: _customer.billing.street,
      extendedAddress: _customer.billing.street2,
      locality: _customer.billing.city,
      region: _customer.billing.state,
      postalCode: _customer.billing.zipcode,
      countryCodeAlpha2: "US"
    },
    shipping: {
      firstName: _customer.shipping.first_name,
      lastName: _customer.shipping.last_name,
      streetAddress: _customer.shipping.street,
      extendedAddress: _customer.shipping.street2,
      locality: _customer.shipping.city,
      region: _customer.shipping.state,
      postalCode: _customer.shipping.zipcode,
      countryCodeAlpha2: "US"
    }
  }, function (err, receipt) {
    // console.log(receipt);
    if (!receipt.success) {
      console.log(receipt.success);
      res.json({msg: "transaction error", result: receipt});
    }else{

      /* --- Trigger backend serverside functions ---*/

          /* --- Send Order to Database --- */
            var _id = receipt.transaction.paymentReceipt.id,
                _name = receipt.transaction.customer.firstName + " " + receipt.transaction.customer.lastName,
                _email = receipt.transaction.customer.email,
                _status = receipt.transaction.paymentReceipt.processorResponseText,
                _amount = receipt.transaction.paymentReceipt.amount,
                _cart = JSON.parse(receipt.transaction.customFields.cart),
                _promocode = JSON.parse(receipt.transaction.customFields.promocode),
                _discountamount = JSON.parse(receipt.transaction.customFields.discountamount);

            console.log('Posting order to CafLam Orders database...');
            console.log(_id,_name,_email,_status,_amount,_cart);
            receipt.order_post_response = db.post_new_order(_id, _name, _email, _status, _amount, _cart);

          /* --- Add Customer to Database --- */
          // res.add_customer = db.add_customer();

          /* --- Update Inventory --- */
            console.log('Updating Inventory ...');
            receipt.update_inventory_after_purchase = db.update_inventory_after_purchase(_cart);

          /* --- Tally Promocode Usage --- */
            console.log('Tallying Promocode usage ...');
            console.log(_promo_code);
            console.log(_discountamount);
            receipt.tally_promo_code = db.tally_promo_code(_discountamount, _promo_code);

          /* --- send Confirmation Email --- */


          /* --- send to Shipstation --- */

            // send order to shipstation route to be served up in xml for integration with shipstation api

            // console.log(receipt.update_inventory_after_purchase);

          res.json({msg:'successfully charged your sandbox dashboard!', result: receipt});
    }
  })
})

module.exports = router;
