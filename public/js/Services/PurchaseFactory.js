app.factory('PurchaseFactory', ['$http', function ($http) {
    return {
          braintreeCreateNonce: braintreeCreateNonce,
          braintreePostPayment: braintreePostPayment,
          createPurchaseOrder: createPurchaseOrder,
          showPurchaseOrders: showPurchaseOrders
      }

      function braintreeCreateNonce(_instance) {
        var tokereq = {method: 'POST', url: '/checkout/braintree/client-token', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: _instance.fields};
        return $http(tokereq).then((res) => {console.log("Nonce Received from server...");return res.data;})
      }
      function braintreePostPayment (_payload, _amount, _deviceData, _customer, _promocode, _discountAmount, _cart) {
        var buyreq = {method: 'POST', url: '/checkout/braintree/buy', headers: {'Content-Type': 'application/json'}, data: {payment_method_nonce: _payload, payment_amount: _amount, device_data: _deviceData, customer: _customer, promocode: _promocode, discountAmount: _discountAmount, cart: _cart}};
        return $http(buyreq).then((res) => {return res.data;});
      }
      function createPurchaseOrder (data) {
          var request = {method: 'POST', url: '/orders/create', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: 'data='+data};
          return $http(request).then(function(response) {return response;});
      }
      function showPurchaseOrders () {
        var request = {method: 'GET', url: '/orders'};
        return $http(request).then(function(response) {return response.data.order_list;});
      }
}]);
