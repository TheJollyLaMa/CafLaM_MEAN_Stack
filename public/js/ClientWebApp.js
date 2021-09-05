var app = angular.module("ClientWebApp", ["ngRoute"]);
app.config([
  "$routeProvider",
  function($routeProvider) {
    $routeProvider

    .when("/", {
      controller: "StoreFrontController",
      templateUrl: "index.html"
    })
    .when("/StoreFront", {
      controller: "StoreFrontController",
      templateUrl: "StoreFront/store_front.html"
    })
    .when("/BehindTheCounter", {
      controller: "BehindTheCounterController",
      templateUrl: "BehindTheCounter/behind_the_counter.html"
    })
    .otherwise({redirectTo: "/"})
  }
]);
