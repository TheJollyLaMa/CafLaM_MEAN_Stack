'use strict';

app.factory('PromoCodeFactory', ['$http', 'ShoppingCartFactory', function($http, ShoppingCartFactory) {
    return {showPromoCodes: showPromoCodes, checkPromoCode: checkPromoCode, runPromotional: runPromotional}
      function showPromoCodes() {
          var request = {method: 'GET', url: '/promocode'};
          var total = ShoppingCartFactory.cart.getTotalPrice();
          return $http(request).then(function(response){
                var promo_discount_rate = 0;
                var promo_discount_amount = 0;
                for (var i=0; i < response.data.length; i++){
                    //console.log($scope.promo_code_data[i].promo_code);
                    if (promo_code == response.data[i].promo_code) {
                        promo_discount_rate = response.data[i].discount_rate;
                        promo_discount_rate = Number(promo_discount_rate);
                        promo_discount_amount = promo_discount_rate * total;
                        console.log(promo_discount_amount);
                    }
                }return promo_discount_amount;
        });
      }
      function checkPromoCode(_promo_code) {
          _promo_code = _promo_code.substring(1);
          var request = {method: 'GET', url: '/promocode/check/' + _promo_code, headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
          var total = ShoppingCartFactory.cart.getTotalPrice();
          return $http(request).then(function(res){
            console.log(res.data.promocode[0].discount_rate);
            console.log(total);
                var promo_discount_rate = res.data.promocode[0].discount_rate;
                var promo_discount_amount = 0;
                promo_discount_amount = Number(promo_discount_rate) * total;
                console.log(promo_discount_amount);
                return promo_discount_amount;
        });
      }

      function runPromotional(promo_code) {
        var request = {method: 'GET', url: '/promocode'};
        return $http(request).then(function(response){
              var uses = 0, limit = 0;
              for (var i=0; i < response.data.length; i++){
                  if (promo_code == response.data[i].promo_code) {
                      uses = response.data[i].uses;
                      uses = Number(uses);
                      limit = response.data[i].limit_on_uses;
                      limit = Number(limit);
                  }
              }return {uses: uses, limit: limit};
      });
    }
}]);
