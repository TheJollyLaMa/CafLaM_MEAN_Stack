var app = angular.module("ClientWebApp", ["ngRoute"]);
app.config([
  "$routeProvider",
  function($routeProvider) {
    $routeProvider

    .when("/", {controller: "StoreFrontController", templateUrl: "StoreFront/store_front.html"})

    /* --- Front End Store Front Routes---*/
    .when("/StoreFront", {
      controller: "StoreFrontController",
      templateUrl: "StoreFront/store_front.html"
    })
    .when("/StoreFront/about_store_front", {
      controller: "StoreFrontController",
      templateUrl: "StoreFront/about_store_front.html"
    })
    .when("/StoreFront/OrderBeans", {
      controller: "StoreFrontController",
      templateUrl: "StoreFront/OrderBeans.html"
    })
    .when("/StoreFront/Subscription", {
      controller: "StoreFrontController",
      templateUrl: "StoreFront/Subscription.html"
    })
    .when("/StoreFront/Discount", {
      controller: "StoreFrontController",
      templateUrl: "StoreFront/Discount.html"
    })

    /* --- Front End AngelsRoom Routes---*/
    .when("/AngelsRoom", {
      controller: "StoreFrontController",
      templateUrl: "AngelsRoom/angels_room.html"
    })
    .when("/AngelsRoom/last_round", {
      controller: "StoreFrontController",
      templateUrl: "AngelsRoom/last_round.html"
    })
    .when("/AngelsRoom/this_round", {
      controller: "StoreFrontController",
      templateUrl: "AngelsRoom/this_round.html"
    })
    .when("/AngelsRoom/next_round", {
      controller: "StoreFrontController",
      templateUrl: "AngelsRoom/next_round.html"
    })

    /* --- Front End Treasure Chest Routes---*/
    .when("/TreasureChest", {
      controller: "TreasureChestController",
      templateUrl: "TreasureChest/treasure_chest.html"
    })
    .when("/TreasureChest/:sym", {
      controller: "TreasureChestController",
      templateUrl: "TreasureChest/token.html"
    })
    .when("/TreasureChest/:sym/:file", {
      controller: "TreasureChestController",
      templateUrl: "TreasureChest/token.html"
    })

    /* --- Login Routes---*/
    .when("/Login", {controller: "AuthController",templateUrl: "Login.html"})
    .when("/Logout", {resolve: {deadResolve: function ($location, AuthFactory) {AuthFactory.clearData(); $location.path('/Login'); } }})

    /* --- Behind The Counter Authorized Routes---*/
    .when("/BehindTheCounter", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller : "BehindTheCounterController",
      templateUrl : "BehindTheCounter/behind_the_counter.html"
    })
    // .when("/Behind_The_Counter/about", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller : "BehindTheCounterController", templateUrl : "Behind_The_Counter/about_behind_the_counter.html"})
    // .when("/Behind_The_Counter/Receiving", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "BehindTheCounterController", templateUrl : "Behind_The_Counter/Receiving.html"})
    // .when("/Behind_The_Counter/Packaging", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "BehindTheCounterController", templateUrl : "Behind_The_Counter/Packaging.html"})
    // .when("/Behind_The_Counter/Discounted", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "BehindTheCounterController", templateUrl : "Behind_The_Counter/Discounted.html"})
    // .when("/Behind_The_Counter/Merchandise", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "BehindTheCounterController", templateUrl : "Behind_The_Counter/Merchandise.html"})
    // .when("/Behind_The_Counter/PurchaseOrders", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "BehindTheCounterController", templateUrl : "Behind_The_Counter/Purchase_Orders.html"})
    // .when("/Behind_The_Counter/RoastList", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "BehindTheCounterController", templateUrl : "Behind_The_Counter/RoastList.html"})
    // .when("/Behind_The_Counter/SolarSystem", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "BehindTheCounterController",templateUrl: "Behind_The_Counter/solar_system.html"})
    /* --- Behind the Counter Treasure Chest---*/
    // .when("/Behind_The_Counter/TreasureChest", {resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Store_Front/RoastMeister'); } }}, controller: "TreasureChestController",templateUrl: "Behind_The_Counter/treasure_chest.html"})

    /* --- SmartHome Routes---*/
    .when("/SmartHome", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/home.html"
    })
    .when("/SmartHome/about", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/about.html"
    })
    .when("/SmartHome/home", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/home.html"
    })
    .when("/SmartHome/power", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/power.html"
    })
    .when("/SmartHome/water", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/water.html"
    })
    .when("/SmartHome/dashboard", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/dashboard.html"
    })
    .when("/SmartHome/brewery", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/brewery.html"
    })
    .when("/SmartHome/shroomery", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/shroomery.html"
    })
    .when("/SmartHome/greenhouse", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/greenhouse.html"
    })
    .when("/SmartHome/coop", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/coop.html"
    })
    .when("/SmartHome/ledger", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/ledger.html"
    })
    .when("/SmartHome/video", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/video.html"
    })
    .when("/SmartHome/charts", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/charts.html"
    })
    .when("/SmartHome/weather", {
      resolve: {check: function ($location, AuthFactory) {if (!AuthFactory.isUserLoggedIn()) {$location.path('/Login');}}},
      controller: "SmartHomeController",
      templateUrl: "SmartHome/weather.html"
    })
    .otherwise({redirectTo: "/"})
  }
]);
app.directive('toggleButton', function() {
  return {
    require: 'ngModel',
    scope: {
      activeText: '@activeText',
      inactiveText: '@inactiveText',
      lightState: '=ngModel'
    },
    replace: true,
    transclude: true,
    template: '<div>' +
              '<span ng-transclude></span> ' +
              '<button class="btn" ng-class="{\'btn-primary\': state.value}" ng-click="state.toggle()">{{activeText}}</button>' +
              '<button class="btn" ng-class="{\'btn-primary\': !state.value}" ng-click="state.toggle()">{{inactiveText}}</button>' +
              '</div>',
    link: function postLink(scope) {
      scope.lightState = scope.inactiveText;

      scope.state = {
        value: false,
        toggle: function() {
          this.value = !this.value;
          scope.lightState = this.value ? scope.activeText : scope.inactiveText;
          if (scope.lightState = "Off") {
            $('.datadisplay').get('/data/put/Light/0');
            console.log(scope.lightState);
            $('.datadisplay').get('/data/put/Water/0');
          }else if (scope.lightState = "On") {
            $('.datadisplay').get('/data/put/Light/1');
            console.log(scope.lightState);
            $('.datadisplay').load('/data/put/Water/1');
          }
        }
      };
    }
  }
});
app.directive('smarthomeNavbar', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'SmartHome/navbar.html',
        controller: 'SmartHomeController'
    };
});
app.directive("shoppingcart",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"StoreFrontController",
    replace:!0,
    restrict:"E",
    templateUrl:"StoreFront/ShoppingCart.html"
  };});
app.directive("addressformflow",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"StoreFrontController",
    replace:!0,
    restrict:"E",
    templateUrl:"StoreFront/AddressForm.html"
  };});
app.directive("promocodeflow",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"StoreFrontController",
    replace:!0,
    restrict:"E",
    templateUrl:"StoreFront/PromoCodeForm.html"
  };});
app.directive("checkoutflow",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"StoreFrontController",
    replace:!0,
    restrict:"E",
    templateUrl:"StoreFront/Checkout.html"
  };});
app.directive("atnavbarstorefront",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"StoreFrontController",
    replace:!0,
    restrict:"E",
    templateUrl:"StoreFront/ATNavbarStoreFront.html"
  };});
app.directive("atnavbarstorefrontangelsroom",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"StoreFrontController",
    replace:!0,
    restrict:"E",
    templateUrl:"AngelsRoom/ATNavbarStoreFrontAngelsRoom.html"
  };});
app.directive("atnavbarbehindthecounter",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"BehindTheCounterController",
    replace:!0,
    restrict:"E",
    templateUrl:"BehindTheCounter/ATNavbarBehindTheCounter.html"
  };});
app.directive("atnavbarbehindthecountermanifest",function(){
    return{
      data:{stock:"=",action:"&"},
      controller:"BehindTheCounterController",
      replace:!0,
      restrict:"E",
      templateUrl:"BehindTheCounter/ATNavbarBehindTheCounterManifest.html"
};});
