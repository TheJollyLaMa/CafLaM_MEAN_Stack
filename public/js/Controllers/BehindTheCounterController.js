'use strict';

/*global app*/
app.controller('BehindTheCounterController', ['$scope', '$filter', '$window', 'InventoryFactory', 'PurchaseFactory', 'BlockFactory', function($scope, $filter, $window, InventoryFactory, PurchaseFactory, BlockFactory){
  var init = function() {
      $scope.title = 'Behind The Counter';
      $scope.backend_category =[{name: "Receiving", text: "Log new Bean Shipment"}, {name: "Packaging", text: "Log Package Dates on Fresh Roasted Beans"}, {name: "Discounted", text: "Inventory not sold after two weeks is moved at a discount!"}, {name: "Merchandise", text: "Other Merchandise"}, {name: "PurchaseOrders", text: "View Purchase Orders"}];
      $scope.useful_links = [{name: "ShipStation", url: "https://ss.shipstation.com"},{name: "Paypal", url: "https://www.paypal.com/us/signin"},{name: "SonoFresco", url: "https://sonofresco.com/my-account/"},{name: "ClearBags", url: "https://www.clearbags.com/customer/account/login/"},{name: "USPS", url: "https://store.usps.com/store/product/shipping-supplies/priority-mail-medium-flat-rate-box-1-P_O_FRB1"}]
      $scope.dev_links = [{name: "Manifest_Tokens", url: "#!/BehindTheCounter/Manifest_Tokens"},{name: "Sandbox", url: "https://www.caffeinelamanna.com/#!/Sandbox"},{name: "Braintree", url: "https://www.caffeinelamanna.com/#!/Braintree"},{name: "SmartHome", url: "#!/SmartHome", text:"SmartHome Console"}];
      $scope.origin = "";
      $scope.roast_type_cats = ['1st crack', '2nd crack', 'Dark'];
      $scope.roast_type = "";
      $scope.newtoken = "";$scope.ids = {};$scope.uris = {};$scope.AngelTokens = [];$scope.token_ids_owned = [];$scope.mintDataArray = [];$scope.new_alm = {};

      $scope.loadTheBlock = async function () {
        // const web3 = window.web3;
        const web3 = new Web3(window.ethereum);
        try {
           // Request account access if needed
           window.ethereum.enable();
           // Acccounts now exposed
           resolve(web3);
         } catch (error) {
           // User denied account access...
           alert('Please allow access for the app to work');
         }
        $scope.AT_Xjson = await BlockFactory.FetchTokenJSON();
        $scope.account = await web3.eth.getAccounts().then(function(accounts){return accounts[0];});
        $scope.display_account = $scope.account.toString().substring(0,4) + "   ....   " + $scope.account.toString().substring($scope.account.toString().length - 4);
        $scope.AT_XContract = await web3.eth.net.getId().then(function(net_id){
           if($scope.AT_Xjson.networks[net_id]) { console.log("Angel Token Contract Address: " + $scope.AT_Xjson.networks[net_id].address);
             var c = new web3.eth.Contract($scope.AT_Xjson.abi,$scope.AT_Xjson.networks[net_id].address);
            return c;
          }else{return $window.alert("Smart contract not connected to selected network.")}
         });
        $scope.blockNum = await web3.eth.getBlockNumber();
        $scope.totalAlms = await $scope.AT_XContract.methods.getAlmsLength().call().then((len) => {return len;});
        $scope.AngelTokens = await $scope.fetchAlms();
        $scope.$digest();
       }

       $scope.fetchAlms = async function () {
         var alm = {};
         var AngelTokens = [];
         console.log("Total Angel Tokens Created: " + $scope.totalAlms);
         for (var i = 1; i <= $scope.totalAlms; i++) {
           // load alms
           await $scope.AT_XContract.methods.alms(i-1).call().then(async (alm) => {
             await $scope.AT_XContract.methods.map_id_to_Alm(alm.id).call().then(async (alm) => {
             console.log(alm.owner);
               var uri_str = await web3.eth.abi.decodeParameters(['string', 'uint256', 'string'], alm.uri);
               alm.uri = uri_str[0] + uri_str[1] + uri_str[2];
               console.log(alm.uri);
               // console.log(alm.mint_data);
               var mint_str = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], alm.mint_data);
               console.log(mint_str);
               alm.num_issued = mint_str[0];
               alm.mint_date = mint_str[1];
               alm.cost = mint_str[2];
               alm.angel_coefficient = mint_str[3];
               alm.status = mint_str[4];
               alm.product = mint_str[5];
               console.log(alm.id);
               console.log($scope.account);
               alm.bal = await $scope.AT_XContract.methods.balanceOf($scope.account,alm.id).call();
               console.log(alm.bal);
               if(alm.status == 1) {alm.status = "waiting...";
               }else if(alm.status == 2) {alm.status = "executed...";
               }else if(alm.status == 3) {alm.status = "shipped...";
               }else if(alm.status == 4) {alm.status = "fulfilled...";
               }else{alm.status = "no status";}
               AngelTokens[i-1] = alm;
             });
           });
         };
         return AngelTokens;
       }
      $scope.manifest_angel_token = function (new_alm) {
         var today = new Date();
         today = String(today.getDate()).padStart(2, '0') + String(today.getMonth() + 1).padStart(2, '0') + today.getFullYear();
         //need an error catch for instance when contract rejects a previously minted ID
         // as in : ID is not Unique! Use a slightly different name! (add a number to it if your endeavor mints frequently)
         $scope.AT_XContract.methods
         .tokenGenesis(new_alm.ename, new_alm.esym, new_alm.issue_num, today, new_alm.cost, new_alm.angel_coefficient, new_alm.product)
         .send({ from: $scope.account })
         .once('receipt', async function(receipt) {
           var ManifestEvent = receipt.events.ManifestedAngelToken.returnValues;
           var post_uri = 'http://localhost:3000/public/#!/treasure_chest/token_manifest.html';
           console.log(ManifestEvent);
           $scope.new_token_uri = ManifestEvent[1];
           var escan_url = "https://etherscan.io/tx/" . receipt.transactionHash;
           alert("You're transaction is being mined.  You can view it here: " + escan_url)
           // console.log($scope.new_token_uri);
           // $scope.lastmintData = await web3.eth.abi.decodeParameters('string',MintDataEvent[0]);
           // console.log($scope.lastmintData);
           // $http.post(uri, ManifestEvent[0]);
           $scope.$digest();
         });
       }
      $scope.StatusShipped = async function (id) {
        await $scope.AT_XContract.methods.map_id_to_Alm(id).call().then(async (alm) => {
          if($scope.account == alm.owner){
              var mint_str = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], alm.mint_data);
              alm.status = mint_str[4];
              if(alm.status == 2){
                await $scope.AT_XContract.methods.change_status_s(id).send({from:$scope.account});
                $scope.StatusShippedmsg = "Token Status changed to shipped.";
              }else{
                $scope.StatusShippedmsg = "Cannot ship if token not yet executed.";
              }
          }else{
            $scope.StatusShippedmsg = "Cannot change status of tokens not owned.";
          }
          console.log($scope.StatusShippedmsg);
          $scope.$digest();

        });
      }
      $scope.getBalance = function () {
          var address, wei, balance;
          address = document.getElementById("address").value;
          console.log(address);
          $scope.address = address;
          try {
              web3.eth.getBalance(address, function (error, wei) {
                  if (!error) {
                      var balance = web3.utils.fromWei(wei, 'ether');
                      console.log(balance);
                      document.getElementById("output").innerHTML = balance + " ETH";
                  }
              });
          } catch (err) {
              document.getElementById("output").innerHTML = err;
          }
      }

      $scope.greenInventoryTotals = function () {
        $scope.greenInventoryTotalWeight = 0;$scope.greenInventoryTotalCost = 0;$scope.greenInventoryTotalRetailValue = 0;
        for (var i=0; i <= $scope.green_inventory.length; i++) {
          $scope.greenInventoryTotalWeight += parseInt($scope.green_inventory[i].weight);
          $scope.greenInventoryTotalCost += $scope.green_inventory[i].weight * $scope.green_inventory[i].cost_per_lb;
          $scope.greenInventoryTotalRetailValue +=  ($scope.green_inventory[i].price_per_lb * ($scope.green_inventory[i].weight - ($scope.green_inventory[i].weight * 0.2)))-($scope.green_inventory[i].price_per_lb * 0.2); /*waterloss and time duration loss for discounted product*/
        };
      };
      $scope.packagedInventoryTotals = function () {
        $scope.packagedInventoryTotalWeight = 0;$scope.packagedInventoryTotalCost = 0;
        for (var i=0; i <= $scope.packaged_inventory.length; i++) {
          $scope.packagedInventoryTotalWeight += parseInt($scope.packaged_inventory[i].weight);
          $scope.packagedInventoryTotalCost += $scope.packaged_inventory[i].weight * $scope.packaged_inventory[i].cost_per_lb;
        };
      };
      $scope.discountedInventoryTotals = function () {
        $scope.discountedInventoryTotalWeight = 0;$scope.discountedInventoryTotalCost = 0;
        for (var i=0; i <= $scope.discounted_inventory.length; i++) {
          $scope.discountedInventoryTotalWeight += parseInt($scope.discounted_inventory[i].weight);
          $scope.discountedInventoryTotalCost += $scope.discounted_inventory[i].weight * $scope.discounted_inventory[i].cost_per_lb;
        };
      };
      $scope.merchandiseInventoryTotals = function () {
        $scope.merchandiseInventoryTotalCost = 0;
        for (var i=0; i <= $scope.merchandise_inventory.length; i++) {
          console.log(parseInt($scope.merchandise_inventory[i]));
          $scope.merchandiseInventoryTotalCost += $scope.merchandise_inventory[i].quantity * $scope.merchandise_inventory[i].cost;
        };
      };
      $scope.Range = function(start, end) {var result = [];for (var i = start; i <= end; i++) {result.push(i);}return result;};
      $scope.fillWeight = function() {var key = $scope.green_inventory.indexOf($scope.origin);console.log(key);if(key>=0){$scope.inventory_weight = $scope.green_inventory[key].weight;}else{$scope.inventory_weight = $scope.green_inventory[0].weight;};};
      $scope.fetchusername = function() {var val = JSON.parse($window.localStorage.getItem('login'));$scope.username = val.username;};
      $scope.showGreenInventory = function() {InventoryFactory.showGreenInventory().then(function(data){$scope.green_inventory = data;$scope.greenInventoryTotals();});};
      $scope.showPackagedInventory = function() {InventoryFactory.showPackagedInventory().then(function(data){$scope.packaged_inventory = data;$scope.packagedInventoryTotals();});};
      $scope.showDiscountedInventory = function() {InventoryFactory.showDiscountedInventory().then(function(data){$scope.discounted_inventory = data;$scope.discountedInventoryTotals();});};
      $scope.showMerchandiseInventory = function() {InventoryFactory.showMerchandiseInventory().then(function(data){$scope.merchandise_inventory = data;$scope.merchandiseInventoryTotals();});};
      $scope.showPurchaseOrders = function() {
        PurchaseFactory.showPurchaseOrders()
        .then(function(data){
          $scope.purchase_orders = data;
          console.log(data);
          angular.forEach($scope.purchase_orders, function(value, key){
              $scope.purchase_orders[key].promo_code = $scope.purchase_orders[key].cart.split('~')[0];
              var n = $scope.purchase_orders[key].cart.indexOf('~');
              var l = $scope.purchase_orders[key].cart.lastIndexOf('~');
              $scope.purchase_orders[key].cart = $scope.purchase_orders[key].cart.substring(n+1,l);
              var cart_items = $scope.purchase_orders[key].cart.split('~');
              $scope.purchase_orders[key].cart = {};
              var res = $scope.purchase_orders[key].cart;
              var $total = $scope.purchase_orders[key].total;
              angular.forEach(cart_items, function(value, key){
                    var sku = cart_items[key].split(',')[0],
                        origin = cart_items[key].split(',')[1],
                        roast_type = cart_items[key].split(',')[2],
                        quantity = cart_items[key].split(',')[3];
                    if(!roast_type) {
                      sku = "Subscription";
                      origin = "Subscription";
                      roast_type = "Subscription";
                      quantity = Math.floor($total/10);
                    }
                    res[value] = {
                      "sku": sku,
                      "origin": origin,
                      "roast_type": roast_type,
                      "quantity": quantity
                    }
              });
          });
        });
      };

      var newInventoryForm = {origin: '', reception_date: '', weight: '', cost_per_lb: ''},
          newPackagedForm = {origin: '', weight: '', packaged_date: '', roast_type: ''},
          newMerchandiseForm = {sku: '', name: '', description: '', price: '', quantity: ''};

      $scope.newInventoryForm =  angular.copy(newInventoryForm);
      $scope.addGreenInventory = function() {
          var reception_date = $filter('date')($scope.dt, "yyyy-MM-dd");
          $scope.newInventoryForm ={origin: $scope.origin, reception_date: reception_date, weight: $scope.weight, cost_per_lb: $scope.cost_per_lb};
          InventoryFactory.addGreenInventory($scope.newInventoryForm)
          .then(function(data){
              if(data.status==200){
                  $scope.showGreenInventory();
                  $scope.newInventoryForm = {};
                  window.location.reload();
                }else {
                  $scope.error="Something went wrong while adding inventory ...";
                }
          });
      };

      $scope.newPackagedForm =  angular.copy(newPackagedForm);
      $scope.addPackagedInventory = function() {
          var packaged_date = $filter('date')($scope.dt, "yyyy-MM-dd");
          $scope.newPackagedForm ={origin: $scope.origin.origin, weight: $scope.weight, packaged_date: packaged_date, roast_type: $scope.roast_type};
          InventoryFactory.addPackagedInventory($scope.newPackagedForm)
          .then(function(data){
              if(data.status==200) {
                  $scope.showPackagedInventory();
                  $scope.showGreenInventory();
                  $scope.newPackagedForm = {};
                  window.location.reload();
                } else {
                  $scope.error = "Something went wrong while logging packaged inventory ...";
                }
          });
      };

      $scope.newMerchandiseForm =  angular.copy(newMerchandiseForm);
      $scope.addMerchandiseInventory = function() {
          $scope.newMerchandiseForm ={sku: $scope.sku, name: $scope.name, description: $scope.description, price: $scope.price, quantity: $scope.quantity, cost: $scope.cost };
          InventoryFactory.addMerchandiseInventory($scope.newMerchandiseForm)
          .then(function(data){
              if(data.status==200){
                  $scope.showMerchandiseInventory();
                  $scope.newMerchandiseForm = {};
                  window.location.reload();
                }else {
                  $scope.error="Something went wrong while adding inventory ...";
                }
          });
      };
      $scope.discount_date = new Date();
      $scope.discount_date.setDate($scope.discount_date.getDate()+14);

      $scope.today = function() {$scope.dt = new Date();};
      $scope.today();

      $scope.clear = function() {
        $scope.dt = null;
      };

      $scope.inlineOptions = {customClass: getDayClass,minDate: new Date(),showWeeks: true};
      $scope.dateOptions = {formatYear: 'yy',maxDate: new Date(2020, 5, 22),minDate: new Date(),startingDay: 1};

      $scope.toggleMin = function() {$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();$scope.dateOptions.minDate = $scope.inlineOptions.minDate;};
      $scope.toggleMin();
      $scope.open1 = function() {$scope.popup1.opened = true;};
      $scope.setDate = function(year, month, day) {$scope.dt = new Date(year, month, day);};
      $scope.formats = ['yyyy-MM-dd', 'dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.popup1 = {opened: false};
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [{date: tomorrow,status: 'full'},{date: afterTomorrow,status: 'partially'}];
      function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);
          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
            if (dayToCheck === currentDay) {return $scope.events[i].status;}}}
            return '';
      }
  }

  init();

}]);
app.directive("followme",function(){
  return{
    data:{stock:"=",action:"&"},
    controller:"BehindTheCounterController",
    replace:!0,
    restrict:"E",
    templateUrl:"BehindTheCounter/followme.html"
  };});
