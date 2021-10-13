app.factory('PurchaseFactory', ['$http', function ($http) {
    return {
          createPurchaseOrder: createPurchaseOrder,
          showPurchaseOrders: showPurchaseOrders

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
