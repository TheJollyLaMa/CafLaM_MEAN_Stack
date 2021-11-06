app.controller("TreasureChestController", ["$scope", "$route", "$routeParams", "$location", "BlockFactory", function ($scope, $route, $routeParams, $location, BlockFactory) {
  const init = async function () {
      $scope.loadTheBlock = async function () {
        const web3 = window.web3;
        $scope.AT_json = await BlockFactory.FetchTokenJSON();
        $scope.account = await web3.eth.getAccounts().then(function(accounts){return accounts[0];});
        $scope.display_account = $scope.account.toString().substring(0,4) + "   ....   " + $scope.account.toString().substring($scope.account.toString().length - 4);
        $scope.AT_Contract = await web3.eth.net.getId().then(function(net_id){
           if($scope.AT_json.networks[net_id]) { console.log("Angel Token Contract Address: " + $scope.AT_json.networks[net_id].address);
             var c = new web3.eth.Contract($scope.AT_json.abi,$scope.AT_json.networks[net_id].address);
            return c;
          }else{return $window.alert("Smart contract not connected to selected network.")}
         });
        $scope.blockNum = await web3.eth.getBlockNumber();console.log($scope.blockNum);
        $scope.totalAlms = await $scope.AT_Contract.methods.getAlmsLength().call().then((len) => {return len;});
        $scope.AngelTokens = await $scope.fetchAngelTokens();
        if($routeParams.sym && $routeParams.file){
          console.log($routeParams);
          $scope.specific_alm = await $scope.fetchSpecificAlm();
        }
        if($routeParams.sym){
          console.log($routeParams);
          $scope.sym = $routeParams.sym;
          $scope.AngelCollection = await $scope.fetchAngelCollection();
        }
        // console.log($scope.specific_alm.Angels_Balance);
        $scope.$digest();


       }
       $scope.fetchSpecificAlm = async function () {
             var alm = {};
             var id = parseInt($routeParams.file), sym = $routeParams.sym;
             console.log(id);
             return $scope.specific_alm = await $scope.AT_Contract.methods.map_id_to_Alm(id).call().then(async (alm) => {
                      return await $scope.balance(alm.owner,alm.id).then(async (bal) =>{
                           alm.Angels_Balance = parseInt(bal);
                           var mint_str = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], alm.mint_data);
                           var mint_date = String(mint_str[1].substring(0,10));
                           var uri_str = await web3.eth.abi.decodeParameters(['string', 'string', 'uint256', 'string'], alm.uri);
                           alm.uri = uri_str[0] + uri_str[1] + uri_str[2] + uri_str[3];
                           console.log(alm.uri);
                           alm.img = "./img/angels/" + uri_str[0] + "/" + uri_str[2] + "_tokenfront.gif";
                           console.log(alm.img);
                           alm.num_issued = mint_str[0];
                           alm.mint_date = mint_str[1];
                           alm.cost = mint_str[2];
                           alm.angel_coefficient = mint_str[3];
                           alm.status = mint_str[4];
                           alm.product = mint_str[5];
                           alm.owner_display = alm.owner.toString().substring(0,4) + "   ....   " + alm.owner.toString().substring(alm.owner.toString().length - 4);
                           if(alm.status == 1) {alm.status = "waiting...";
                           }else if(alm.status == 2) {alm.status = "executed...";
                           }else if(alm.status == 3) {alm.status = "shipped...";
                           }else if(alm.status == 4) {alm.status = "fulfilled...";
                           }else{alm.status = "no status";}
                           return alm;
                      });
            });
            $scope.$digest();

       }

       $scope.fetchAngelTokens = async function () {
         var alm = {};
         AngelTokens = [];
         for (var i = 1; i <= $scope.totalAlms; i++) {
             // load alms
             await $scope.AT_Contract.methods.alms(i-1).call().then(async (alm) => {
               await $scope.balance($scope.account,alm.id).then(async (bal) =>{
                 if(1){//bal > 0
                   await $scope.AT_Contract.methods.map_id_to_Alm(alm.id).call().then(async (alm) => {
                       alm.bal = bal;
                       // console.log(alm.bal);
                       var mint_str = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], alm.mint_data);
                       var mint_date = String(mint_str[1].substring(0,10));
                       var uri_str = await web3.eth.abi.decodeParameters(['string', 'string', 'uint256', 'string'], alm.uri);
                       alm.uri = uri_str[0] + uri_str[1] + uri_str[2] + uri_str[3];
                       alm.img = "./img/angels/" + uri_str[0] + "/" + uri_str[2] + "_tokenfront.gif";
                       alm.num_issued = mint_str[0];
                       alm.mint_date = mint_str[1];
                       alm.cost = mint_str[2];
                       alm.angel_coefficient = mint_str[3];
                       alm.status = mint_str[4];
                       alm.product = mint_str[5];
                       alm.owner_display = alm.owner.toString().substring(0,4) + "   ....   " + alm.owner.toString().substring(alm.owner.toString().length - 4);

                       if(alm.status == 1) {alm.status = "waiting...";
                       }else if(alm.status == 2) {alm.status = "executed...";
                       }else if(alm.status == 3) {alm.status = "shipped...";
                       }else if(alm.status == 4) {alm.status = "fulfilled...";
                       }else{alm.status = "no status";}
                       // console.log(alm.status);
                       AngelTokens[i-1] = alm;
                     });
                   }else{
                 //    console.log(bal);
                   }
                });
           });
          // console.log(AngelTokens);
         };
         return AngelTokens;
         $scope.$digest();

       }
       $scope.fetchAngelCollection = async function () {
         var alm = {};
         var sym = $routeParams.sym;
         AngelCollection = [];
         for (var i = 1; i <= $scope.totalAlms; i++) {
             // load alms
             await $scope.AT_Contract.methods.alms(i-1).call().then(async (alm) => {
               await $scope.balance($scope.account,alm.id).then(async (bal) =>{
                 console.log(sym);
                 console.log(alm.sym);
                 if(alm.sym === sym){//bal > 0
                   await $scope.AT_Contract.methods.map_id_to_Alm(alm.id).call().then(async (alm) => {
                       alm.bal = bal;
                       // console.log(alm.bal);
                       var mint_str = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], alm.mint_data);
                       var mint_date = String(mint_str[1].substring(0,10));
                       var uri_str = await web3.eth.abi.decodeParameters(['string', 'string', 'uint256', 'string'], alm.uri);
                       alm.uri = uri_str[0] + uri_str[1] + uri_str[2] + uri_str[3];
                       alm.img = "./img/angels/" + uri_str[0] + "/" + uri_str[2] + "_tokenfront.gif";
                       alm.num_issued = mint_str[0];
                       alm.mint_date = mint_str[1];
                       alm.cost = mint_str[2];
                       alm.angel_coefficient = mint_str[3];
                       alm.status = mint_str[4];
                       alm.product = mint_str[5];
                       alm.owner_display = alm.owner.toString().substring(0,4) + "   ....   " + alm.owner.toString().substring(alm.owner.toString().length - 4);

                       if(alm.status == 1) {alm.status = "waiting...";
                       }else if(alm.status == 2) {alm.status = "executed...";
                       }else if(alm.status == 3) {alm.status = "shipped...";
                       }else if(alm.status == 4) {alm.status = "fulfilled...";
                       }else{alm.status = "no status";}
                       // console.log(alm.status);
                       AngelCollection[i-1] = alm;
                     });
                   }else{
                 //    console.log(bal);
                   }
                });
           });
          console.log(AngelCollection);
         };
         return AngelCollection;
         $scope.$digest();

       }

  }
 init();
}]);
