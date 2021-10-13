'use strict';

app.factory('ShoppingCartFactory', function() {
    var cart = new shoppingCart("shopping_cart");
    return {
        cart: cart
    };
});
