'use strict';

/*global app*/
app.factory('InventoryFactory', ['$http', function ($http) {
    return {
        showGreenInventory: showGreenInventory,
        showPackagedInventory: showPackagedInventory,
        showDiscountedInventory: showDiscountedInventory,
        showMerchandiseInventory: showMerchandiseInventory,
        addGreenInventory: addGreenInventory,
        addPackagedInventory: addPackagedInventory,
        addMerchandiseInventory: addMerchandiseInventory
        // updateInventoryAfterPurchase: updateInventoryAfterPurchase
    }
    function showGreenInventory () {
        var request = {method: 'GET', url: '/inventory/Green'};
        return $http(request).then(function(response) {
          // console.log(response.data.greenInventory);
          return response.data.greenInventory;
        });
    }
    function showPackagedInventory () {
      var request = {method: 'GET', url: '/inventory/Packaged'};
      return $http(request).then(function(response) {
        return response.data.packagedInventory;
      });
    }
    function showDiscountedInventory () {
      var request = {method: 'GET', url: '/inventory/Discounted'};
      return $http(request).then(function(response) {
        return response.data.discountedInventory;
      });
    }
    function showMerchandiseInventory () {
      var request = {method: 'GET', url: '/inventory/Merchandise'};
      return $http(request).then(function(response) {
        console.log(response.data.merchandiseInventory);
        return response.data.merchandiseInventory;
      });
    }
    function addGreenInventory (newInventoryForm) {
      console.log(newInventoryForm.origin);
      var request = {method: 'POST', url: '/inventory/Green', headers: {'Content-Type': 'application/json'}, data: newInventoryForm };
      return $http(request).then(function(response) {
        //console.log(response.data);
        return response;
      });
    }
    function addPackagedInventory (newPackagedForm) {
      var request = {method: 'POST', url: '/inventory/Packaged', headers: {'Content-Type': 'application/json'}, data: newPackagedForm };
      return $http(request).then(function(response) {
        return response;
      });
    }
    function addMerchandiseInventory (newMerchandiseForm) {
      var request = {method: 'POST', url: '/inventory/Merchandise', headers: {'Content-Type': 'application/json'}, data: newMerchandiseForm };
      return $http(request).then(function(response) {
        return response;
      });
    }

    // handled in backend
    // function updateInventoryAfterPurchase (cart) {
    //   console.log(cart);
    //   var request = {method: 'POST', url: 'https://www.caffeinelamanna.com/php/update_inventory_after_purchase.php', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: 'cart='+cart};
    //   return $http(request).then(function(response) {
    //     return response;
    //   });
    // }

}]);
