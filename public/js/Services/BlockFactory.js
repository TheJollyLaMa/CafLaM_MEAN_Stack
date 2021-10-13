app.factory('BlockFactory', ["$http", function ($http) {
    return {
          FetchTokenJSON: FetchTokenJSON,
          FetchAT_X_JSON: FetchAT_X_JSON
      }
      function FetchTokenJSON () {
          return $http.get('abis/AngelToken.json')// ../../../abis/AngelToken.json needs to change to hardlink (https://ipfs.io/ipfs/QmckjBCtjqQRUSB1dxqpwa9gLhLryhba2aynHmDWTdCqK6/AngelToken.json) to ipfs file containing token ABI
                      .then(function(atjson) {
                        return atjson.data;
                      });
      }
      function FetchAT_X_JSON () {
          return $http.get('abis/AT_X.json')// ../../../abis/AT_X.json change to IPFS token execution abi (https://ipfs.io/ipfs/QmckjBCtjqQRUSB1dxqpwa9gLhLryhba2aynHmDWTdCqK6/AT_X.json)
                      .then(function(atcfjson) {
                        return atcfjson.data;
                      });
      }

}]);
