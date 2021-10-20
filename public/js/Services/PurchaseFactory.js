app.factory('PurchaseFactory', ['$http', function ($http) {
    return {
          braintreeCreateNonce: braintreeCreateNonce,
          braintreePostPayment: braintreePostPayment,
          createPurchaseOrder: createPurchaseOrder,
          showPurchaseOrders: showPurchaseOrders
      }

      function braintreeCreateNonce(_instance) {
        var tokereq = {method: 'POST', url: '/checkout/braintree/client-token', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: _instance.fields};
        return $http(tokereq).then((res) => {console.log(res.data);return res.data;})
      }
      function braintreePostPayment (_payload, _amount, _deviceData) {
        // console.log(_payload);
        console.log(_amount);
        var buyreq = {method: 'POST', url: '/checkout/braintree/buy', headers: {'Content-Type': 'application/json'}, data: {payment_method_nonce: _payload, payment_amount: _amount, device_data: _deviceData}};
        return $http(buyreq).then((res) => {console.log(res.data);return res.data;});
      }
      function createPurchaseOrder (data) {
          var request = {method: 'POST', url: 'https://www.caffeinelamanna.com/php/create_purchase_order.php', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: 'data='+data};
          return $http(request).then(function(response) {
            return response;
          });
      }
      function showPurchaseOrders () {
        var request = {method: 'GET', url: 'https://www.caffeinelamanna.com/php/get_purchase_orders.php'};
        return $http(request).then(function(response) {
          return response.data;
        });
      }
}]);
