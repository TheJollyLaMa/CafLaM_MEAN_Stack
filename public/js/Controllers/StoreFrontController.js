"use strict";
app.controller("StoreFrontController", ["$scope", "$route", "$filter", "$routeParams", "InventoryFactory", "ShoppingCartFactory", "CustomerFactory", "PromoCodeFactory", "BlockFactory", function($scope, $route, $filter, $routeParams, InventoryFactory, ShoppingCartFactory, CustomerFactory, PromoCodeFactory, BlockFactory) {
  var init = function() {
    $scope.title = 'Order Fresh Beans to your Door!';
    $scope.last_round_test = "testing last round data binding";
    $scope.next_round_test = "testing next round data binding";
    $scope.checkoutFlowProgress = {showAddressFlow: false, showPromoCodeFlow : false, showCheckoutFlow : false}
    $scope.sales_category = [
                             {name: "OrderBeans", text: "Roast Me Some New Beans ", icon: "glyphicon glyphicon-list-alt"},
                             /*{name: "Sampler", text: "A pot per day for the workweek", icon: "glyphicon glyphicon-tag"},*/
                             {name: "Subscription", text: "Automatic Frequent and Fresh!", icon: "glyphicon glyphicon-list-alt"},
                             /*{name: "Merchandise", text: "Merchandise", icon: "glyphicon glyphicon-tag"},*/
                             /*{name: "Regular", text: "This Week's Unreserved Roasts", icon: "glyphicon glyphicon-tint"},*/
                             {name: "Discount", text: "Last Week's Leftover Beans", icon: "glyphicon glyphicon-tag"}];
    $scope.special_cats = [{name: "Sampler", text: "A pot per day for the workweek", icon: "glyphicon glyphicon-tag"},
                           {name: "Subscription", text: "Automatic Frequent and Fresh!", icon: "glyphicon glyphicon-list-alt"}
                         ];
    $scope.roast_type_cats = ['1st crack (light)', '2nd crack (medium)', 'Dark (Dark)'];
    $scope.Samplers = [{sku: "S0001", name: "Sampler", msg: "A variety Pack - an economical pot a day for the workweek. Variety of roast types, Variety of origins.", price: 10.10 }];
    $scope.subscription_inventory = [{sku: "SUB001", duration: "weekly", name: "Weekly Subscription", msg: "Fresh roasted by the pound to perfection and delivered weekly!" },
                                     {sku: "SUB002", duration: "monthly", name: "Monthly Subscription", msg: "Fresh roasted by the pound to perfection and delivered monthly!" }]
    $scope.cur_alm = {};
    $scope.amt_to_buy = 10;
    $scope.loadTheBlock = async function () {
       const web3 = window.web3;
       $scope.AT_json = await BlockFactory.FetchTokenJSON();
       $scope.AT_X_json = await BlockFactory.FetchAT_X_JSON();
       $scope.account = await web3.eth.getAccounts().then(function(accounts){return accounts[0];});
       $scope.display_account = $scope.account.toString().substring(0,4) + "   ....   " + $scope.account.toString().substring($scope.account.toString().length - 4);
       $scope.AT_Contract = await web3.eth.net.getId().then(function(net_id){
          if($scope.AT_json.networks[net_id]) {
            $scope.AT_ContractAddress = $scope.AT_json.networks[net_id].address;
            var c = new web3.eth.Contract($scope.AT_json.abi, $scope.AT_ContractAddress);
           return c;
         }else{return $window.alert("Smart contract not connected to selected network.")}
       });
       $scope.AT_X_Contract = await web3.eth.net.getId().then(function(net_id){
         if($scope.AT_X_json.networks[net_id]) {
           $scope.AT_X_ContractAddress = $scope.AT_X_json.networks[net_id].address;
           var c = new web3.eth.Contract($scope.AT_X_json.abi, $scope.AT_X_ContractAddress);
          return c;
        }else{return $window.alert("Smart contract not connected to selected network.")}
       });
       $scope.blockNum = await web3.eth.getBlockNumber();
       $scope.totalAlms = await $scope.AT_Contract.methods.getAlmsLength().call().then((len) => {return len;});
       // console.log($scope.totalAlms);
       $scope.cur_alm = await $scope.fetchCurrentAlm();//console.log($scope.cur_alm);
       document.getElementById("progress").style.width = $scope.cur_alm.progress + '%';
       document.getElementById("progress").innerHTML = $scope.cur_alm.tokens_sold + ' tokens sold';
       $scope.$digest();
       $scope.AngelTokens = await $scope.fetchConnectedAccountsAlms();//console.log($scope.AngelTokens);
    }
    $scope.fetchLastAlm = async function () {
      var alm = {};
      $scope.last_alm.mint_date = new Date("01/01/2000").toLocaleDateString('en-US', {day: '2-digit',month: '2-digit',year: 'numeric'});
      for (var i = 1; i <= $scope.totalAlms; i++) {
        await $scope.AT_Contract.methods.alms(i-1).call().then(async (alm) => {
          var mint_str = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], alm.mint_data);
          var mint_date = new Date(mint_str[1].substring(0,2)+"/"+mint_str[1].substring(2,4)+"/"+mint_str[1].substring(4,8)).toLocaleDateString('en-US', {day: '2-digit',month: '2-digit',year: 'numeric'});
          // console.log(mint_date);
          // console.log($scope.last_alm.mint_date);
          if(mint_date >= $scope.last_alm.mint_date){
            $scope.last_alm = alm;
            // console.log($scope.last_alm);
            $scope.last_alm.mint_date = mint_date;
            $scope.last_alm.img = "./css/tokenfront.png";
            var last_alm_uri_str = await web3.eth.abi.decodeParameters(['string', 'string', 'uint256', 'string'], alm.uri);
            $scope.last_alm.uri = last_alm_uri_str[0] + last_alm_uri_str[1] + last_alm_uri_str[2];
            $scope.last_alm.num_issued = mint_str[0];
            $scope.last_alm.mint_data = alm.mint_data;
            $scope.last_alm.cost = mint_str[2];
            $scope.last_alm.angel_coefficient = mint_str[3];
            $scope.last_alm.status = mint_str[4];
            if(alm.status == 1) {alm.status = "waiting...";
            }else if(alm.status == 2) {alm.status = "executed...";
            }else if(alm.status == 3) {alm.status = "shipped...";
            }else if(alm.status == 4) {alm.status = "fulfilled...";
            }else{alm.status = "no status";}
            $scope.last_alm.product = mint_str[5];
            $scope.last_alm.Angels_Balance = await $scope.AT_Contract.methods.balanceOf($scope.last_alm.owner, $scope.last_alm.id).call();
            $scope.last_alm.tokens_sold = $scope.last_alm.num_issued - $scope.last_alm.Angels_Balance;
            $scope.last_alm.progress = $scope.last_alm.tokens_sold/$scope.last_alm.num_issued * 100 ;
            $scope.last_alm.owner_display = $scope.last_alm.owner.toString().substring(0,4) + "   ....   " + $scope.last_alm.owner.toString().substring($scope.last_alm.owner.toString().length - 4);
          }else{$scope.last_alm = alm;$scope.last_alm.img = "./ATEth_Logo_white.png";}
        });
      }
    }
    $scope.fetchCurrentAlm = async function () {
      var this_alm = {};
      var cur_alm = {};
      // console.log($scope.totalAlms);
      cur_alm.mint_date = new Date("01/18/2000").toLocaleDateString('en-US', {day: '2-digit',month: '2-digit',year: 'numeric'});

      for (var i = 1; i <= $scope.totalAlms; i++) {
        await $scope.AT_Contract.methods.alms(i-1).call().then(async (alm) => {
          // console.log(alm.owner);
          // console.log(alm.mint_data);
          await $scope.balance(alm.owner,alm.id).then(async (bal) =>{
            cur_alm.Angels_Balance = 0;
            if(bal > 0){
              // console.log(alm.id);
              await $scope.AT_Contract.methods.map_id_to_Alm(alm.id).call()
                .then(async (this_alm) => {
                    cur_alm.Angels_Balance = bal;
                    var mint_str = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], this_alm.mint_data);
                    var this_alms_mint_date = new Date(mint_str[1]).toLocaleDateString('en-US', {day: '2-digit',month: '2-digit',year: 'numeric'});
                    //load this_alm offering
                    // console.log(this_alms_mint_date);
                    // console.log(cur_alm.mint_date);
                    // console.log(this_alms_mint_date > cur_alm.mint_date);
                    var this_alm_date = new Date(mint_str[1].substring(6,10),mint_str[1].substring(0,2),mint_str[1].substring(3,5));
                    var cur_alm_date = new Date(cur_alm.mint_date.substring(6,10),cur_alm.mint_date.substring(0,2),cur_alm.mint_date.substring(3,5));
                    // console.log(this_alm_date);
                    // console.log(cur_alm_date);
                    // console.log(this_alm_date>cur_alm_date);
                    if(this_alm_date >= cur_alm_date){
                      cur_alm = this_alm;
                      cur_alm.Angels_Balance = bal;
                      cur_alm.id = this_alm.id
                      cur_alm.mint_date = this_alms_mint_date;
                      cur_alm.img = "./css/tokenfront.png";
                      var cur_alm_uri_str = await web3.eth.abi.decodeParameters(['string', 'string', 'uint256', 'string'], this_alm.uri);
                      cur_alm.uri = cur_alm_uri_str[0] + cur_alm_uri_str[1] + cur_alm_uri_str[2]  + cur_alm_uri_str[3];
                      cur_alm.num_issued = mint_str[0];
                      cur_alm.mint_data = this_alm.mint_data;
                      cur_alm.cost = mint_str[2];
                      cur_alm.angel_coefficient = mint_str[3];
                      // cur_alm.status = mint_str[4];
                      if(mint_str[4] == 1) {cur_alm.status = "waiting...";
                      }else if(mint_str[4] == 2) {cur_alm.status = "executed...";
                      }else if(mint_str[4] == 3) {cur_alm.status = "shipped...";
                      }else if(mint_str[4] == 4) {cur_alm.status = "fulfilled...";
                      }else{mint_str[4] = "no status";}
                      cur_alm.product = mint_str[5];
                      cur_alm.tokens_sold = cur_alm.num_issued - cur_alm.Angels_Balance;
                      cur_alm.progress = cur_alm.tokens_sold/cur_alm.num_issued * 100 ;
                      cur_alm.owner_display = cur_alm.owner.toString().substring(0,4) + "   ....   " + cur_alm.owner.toString().substring(cur_alm.owner.toString().length - 4);
                    }else{
                        cur_alm = cur_alm;
                        cur_alm.img = "./ATEth_Logo_white.png";
                    }
              });
           }
         });
       });
      }
      return cur_alm;
    }
    $scope.fetchConnectedAccountsAlms = async function () {
      var alm = {};
      var AngelTokens = [];
      for (var i = 1; i <= $scope.totalAlms; i++) {
          // load connected alms
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
      //  console.log(AngelTokens);
      };
      return AngelTokens;
    }
    $scope.decode_bytes = async function (array) {
      console.log(array);
      $scope.bytes_decode_result = await web3.eth.abi.decodeParameters(['uint256', 'string', 'uint256', 'uint256', 'uint256', 'string'], array);
    }
    $scope.balance = function (account, id) {
      return $scope.AT_Contract.methods.balanceOf(account,id).call().then((bal) => {return bal;});
    }

    $scope.buy_alms = async function (amt_to_buy) {
      // console.log("Current Alm Owner: " + $scope.cur_alm.owner);console.log("Current Alm mint_data: " + $scope.cur_alm.mint_data);console.log($scope.cur_alm.id);console.log($scope.account);console.log(Number(amt_to_buy));console.log($scope.cur_alm.cost);

          try{
            await $scope.balance($scope.cur_alm.owner,$scope.cur_alm.id).then((bal) =>{
              console.log("Owner's Balance: " + bal);});
            await $scope.balance($scope.account,$scope.cur_alm.id).then((bal) =>{
                console.log("Buyer's Balance: " + bal);
            });
            await $scope.AT_Contract.methods.OA().call().then((addr) => {
               console.log("OA: " + addr);
               $scope.OA=addr;
            });
            // send funds to OA
            var buy_amt = web3.utils.toWei(String((parseInt($scope.cur_alm.cost) * amt_to_buy) + (0.001*amt_to_buy)), "ether")//0.001 goes to the OA - rice for the deities
            console.log('Transaction Amount: ' + buy_amt);
            console.log('Current Alm Owner: ' + $scope.cur_alm.owner);
            await $scope.AT_Contract.methods.buyAlms(
              $scope.cur_alm.owner,
              parseInt($scope.cur_alm.id),
              amt_to_buy,
              parseInt($scope.cur_alm.cost),
              $scope.cur_alm.mint_data
            )
            .send( {from: $scope.account, value: buy_amt })
            .then((res) => {
              $scope.balance($scope.account, $scope.cur_alm.id).then(async (bal)=>{
                  console.log("Buyer's New Balance" + bal);});
              var hash = String(res.transactionHash);
              var escan_url = "https://etherscan.io/tx/" + hash;
              console.log(escan_url);
              alert("You're transaction was sent to the network.  You can view it here: " + escan_url);

              $scope.balance($scope.cur_alm.owner, $scope.cur_alm.id).then(async (bal)=>{

                  console.log("Owner's New Balance" + bal);
                  if(Number(bal) < 998){
                    console.log("Funding round complete! Executing crowdfund...");
                    await $scope.AT_X_Contract.methods.crowdfund_execution($scope.cur_alm.owner,$scope.cur_alm.id).call()
                    .then(async (res)=> {
                        if (res) {
                           // call angel list associated with the token id
                           console.log("contract called successfully...");
                           //run a for loop to payout rewards to each account
                           console.log("executing payouts to angel list");
                           // map_angel_to_payout[_id][angel] = payout_amt;
                        }else {
                           console.log("crowdfund execution error");
                        }
                    });
                  }else{
                    console.log("waiting for crowdsale to complete before execution...");
                  }

              });

            })

            //   console.log('variables used to call the buyAlms function in the AT contract');
            //   console.log($scope.cur_alm.owner);
            //   console.log($scope.account);
            //   console.log(parseInt($scope.cur_alm.id));
            //   console.log(amt_to_buy);
            //   console.log($scope.cur_alm.mint_data);
            //   console.log(parseInt($scope.cur_alm.cost));
         }catch(error){
            console.log(error);
         }
         $scope.$digest();
         $route.reload();
    }
    $scope.bankless_checkout = function () {
    // const transactions = [
    //   {
    //     to: "<your-eth-address>",
    //     token: "DAI",
    //     amount: "23000000000000000000",
    //     description: "For apples",
    //   },
    //   {
    //     to: "<your-eth-address>",
    //     token: "DAI",
    //     amount: "55500000000000000000",
    //     description: "For bananas",
    //   },
    // ];
    // $scope.checkoutUser =  async function (transactions, feeToken, address) {
    //   const checkoutManager = new ZkSyncCheckout.CheckoutManager("mainnet");
    //   if (address) {
    //     const hasEnoughBalance = await checkoutManager.checkEnoughBalance(transactions, feeToken, address, ethProvider);
    //
    //     if (!hasEnoughBalance) {
    //       throw new Error("Not enough balance!");
    //     }
    //   }
    //
    //   const txHashes = await checkoutManager.zkSyncBatchCheckout(transactions, feeToken);
    //   const receipts = await checkoutManager.wait(txHashes);
    // }
  }
    $scope.cart = ShoppingCartFactory.cart;
    $scope.cart_length = $scope.cart.items.length;
    $scope.last_cart_item = ShoppingCartFactory.cart.items[$scope.cart_length-1];
    if ($scope.cart_length > 0){$scope.last_roast_type = $scope.last_cart_item.description;}else{$scope.last_roast_type = '1st crack (light)';}
    $scope.quantity = 0;$scope.promo_code = "";$scope.promo_code_list = [];$scope.promo_code_data = {};$scope.promo_discount_rate = 0;
    $scope.Total = ShoppingCartFactory.cart.getTotalPrice();
    $scope.running_promo = 0;
    $scope.runPromotional = function(running_promo) {return PromoCodeFactory.runPromotional(running_promo).then(function(data){var promotional_uses = data.uses,limit = data.limit;$scope.promos_left = limit - promotional_uses;});};
    $scope.showPromoCodes = function() {return PromoCodeFactory.showPromoCodes().then(function(data){var data = data;console.log(data);return data;});};
    $scope.payflow = function () {
        $scope.checkoutFlowProgress.showAddressFlow = true;

    };
    $scope.saveAddress = function (customer) {
        CustomerFactory.saveAddress(customer).then((res) => {
          // console.log(res);
          $scope.checkoutFlowProgress = {
              showAddressFlow: false,
              showPromoCodeFlow : true,
              showCheckoutFlow : false
          }
        })
    }
    $scope.checkPromoCode = function (_promo_code) {
      $scope.promo_code = _promo_code;
      if(_promo_code != null){
          PromoCodeFactory.checkPromoCode(_promo_code)
                .then((data) => {
                        var promo_discount_amount = data;
                        $scope.promo_discount_amount = data;
                        //console.log(promo_discount_amount);
                        console.log(_promo_code);
                        //console.log($scope.running_promo);
                        //if discount amount is 0 and promocode is not default
                        if (promo_discount_amount == 0 && _promo_code != "#PROMOCODE"){
                            //check if promocode is the running promotion
                            if(_promo_code == $scope.running_promo){
                              //console.log(promo_discount_amount);
                              //console.log($scope.promo_code);
                              //console.log($scope.running_promo);
                              alert('Cool Beans! If you hurry and finish checkout, you get a free grinder with your order! Do us a favor and tell EVERYBODY! #BEANSTOTHEFACE');
                            }else{
                              alert('Err1: Keep your eyes out for #PROMOCODES and be sure to enter them correctly! (All Caps starting with a #)');
                            }

                        }else {
                          //if discount amount is 0
                          if (promo_discount_amount == 0){
                            alert('Err2: Keep your eyes out for #PROMOCODES and be sure to enter them correctly! (All Caps starting with a #)');
                          //finally, if discount, affirmative alert and throw to checkout
                          }else{
                          alert('Sweet! You get a discount of $' + Number(promo_discount_amount).toFixed(2) + '!');
                          }
                        }

                        // $scope.shoppingCartTasks($scope.promo_code, promo_discount_amount);

                }).then(() => {
                  $scope.checkoutFlowProgress = {
                      showAddressFlow: false,
                      showPromoCodeFlow : false,
                      showCheckoutFlow : true
                  }
                })
      }
    }

    $scope.config_checkout = function () {
      var form = document.querySelector('#hosted-fields-form');
      var submit = document.querySelector('button[type="submit"]');

      // Insert your tokenization key here
      braintree.client.create({authorization: 'sandbox_8h8fhzn6_kmwtscn7dfptvwqj'}, function (clientErr, clientInstance) {if (clientErr) {console.error(clientErr);return;}

      // Create a hostedFields component to initialize the form
      braintree.hostedFields.create({
          client: clientInstance,
          // Customize the Hosted Fields.
          // More information can be found at:
          // https://developers.braintreepayments.com/guides/hosted-fields/styling/javascript/v3
          styles: {
            'input': {
              'font-size': '14px',
              'text-align': 'left'
            },
            'input.invalid': {
              'color': 'red'
            },
            'input.valid': {
              'color': 'green'
            }
          },
          // Configure which fields in your card form will be generated by Hosted Fields instead
          fields: {
            // cardholderName: {
            //   selector: '#cc-name',
            //   placeholder: 'Name as it appears on your card'
            // },
            number: {
              container: '#card-number',
              placeholder: '4111 1111 1111 1111'
            },
            cvv: {
              container: '#cvv',
              placeholder: '123'
            },
            expirationDate: {
              container: '#expiration-date',
              placeholder: '10/2022'
            }
          }
        }, function (hostedFieldsErr, instance) {
          if (hostedFieldsErr) {
            console.error(hostedFieldsErr);
            return;
          }

          // Once the fields are initialized enable the submit button
          submit.removeAttribute('disabled');

          // Initialize the form submit event
          form.addEventListener('submit', function (event) {
            event.preventDefault();
            // When the user clicks on the 'Submit payment' button this code will send the
            // encrypted payment information in a variable called a payment method nonce
            instance.tokenize(function (tokenizeErr, payload) {
              if (tokenizeErr) {
                console.error(tokenizeErr);
                return;
              }
              $http.post({
                type: 'POST',
                url: '/checkout/braintree',
                data: {'paymentMethodNonce': payload.nonce}
              }).done(function(result) {
                // Since the following code will overwrite the contents of
                // your page with a success or error message, first teardown
                // the Hosted Fields form to remove any extra event listeners
                // and iframes that the Braintree SDK added to your page
                instance.teardown(function (teardownErr) {
                  if (teardownErr) {
                    console.error('Could not tear down the Hosted Fields form!');
                  } else {
                    console.info('Hosted Fields form has been torn down!');
                    // Remove the 'Submit payment' button
                    $('#hosted-fields-form').remove();
                  }
                });

                if (result.success) {
                  $('#checkout-message').html('<h1>Success</h1><p>Your Hosted Fields form is working! Check your <a href="https://sandbox.braintreegateway.com/login">sandbox Control Panel</a> for your test transactions.</p><p>Refresh to try another transaction.</p>');
                } else {
                  $('#checkout-message').html('<h1>Error</h1><p>Check your console.</p>');
                }
              });
            });
          }, false);
        });
      });
      // ShoppingCartFactory.cart.addCheckoutParameters('PayPal', 'J@CaffeineLamanna.com', {return: 'https://www.caffeinelamanna.com/#!/Store_Front/checkout_complete',cancel_return: 'https://www.caffeinelamanna.com/#!/Store_Front/cancel_checkout',discount_amount_cart: promo_discount_amount,custom: promo_code});  // 'jrlamanna-facilitator@gmail.com'  for sandbox
      ShoppingCartFactory.cart.addCheckoutParameters('Braintree', 'J@CaffeineLamanna.com', {return: 'https://www.caffeinelamanna.com/#!/Store_Front/checkout_complete',cancel_return: 'https://www.caffeinelamanna.com/#!/Store_Front/cancel_checkout',discount_amount_cart: $scope.promo_discount_amount, custom: $scope.promo_code});
    }

    $scope.checkout = function () {
      ShoppingCartFactory.cart.checkout();
      $scope.clear_cart();
    }

    $scope.showGreenInventory = function() {
     InventoryFactory.showGreenInventory()
     .then(function(data){
         $scope.green_inventory = data;
         for (var i=0; i< $scope.green_inventory.length; i++) {
             var inventory_item = $scope.green_inventory[i];
             var sku = inventory_item.sku;
             inventory_item.weight -= Math.floor(inventory_item.weight * 0.2);
             for (var j=0; j< $scope.cart.items.length; j++){
                 var cart_item = $scope.cart.items[j].sku;
                 if(cart_item == sku){                    // if cart_item sku
                   // deduct shopping cart quantity from inventory weight
                   $scope.green_inventory[i].weight -= $scope.cart.items[j].quantity;}}}});};
    $scope.showPackagedInventory = function() {
      InventoryFactory.showPackagedInventory()
      .then(function(data){
         $scope.packaged_inventory = data;
         for (var i=0; i< $scope.packaged_inventory.length; i++) {
             var inventory_item = $scope.packaged_inventory[i].sku;
             for (var j=0; j< $scope.cart.items.length; j++){
                 var cart_item = $scope.cart.items[j].sku;
                 if(cart_item == inventory_item){                    // if cart_item sku
                   // deduct shopping cart quantity from inventory weight
                   $scope.packaged_inventory[i].weight -= $scope.cart.items[j].quantity;}}}});};
    $scope.showDiscountedInventory = function() {
      InventoryFactory.showDiscountedInventory()
      .then(function(data){
         $scope.discounted_inventory = data;
         for (var i=0; i< $scope.discounted_inventory.length; i++) {
             var inventory_item = $scope.discounted_inventory[i].sku;
             $scope.discounted_inventory[i].price_per_lb -= $scope.discounted_inventory[i].price_per_lb*0.10;
             for (var j=0; j< $scope.cart.items.length; j++){
                 var cart_item = $scope.cart.items[j].sku;
                 if(cart_item == inventory_item){
                     $scope.discounted_inventory[i].weight -= $scope.cart.items[j].quantity;}}}});};
    $scope.showMerchandiseInventory = function() {
       InventoryFactory.showMerchandiseInventory()
       .then(function(data){
         $scope.merchandise_inventory = data;
         for (var i=0; i< $scope.merchandise_inventory.length; i++) {
             var inventory_item = $scope.merchandise_inventory[i].sku;
             for (var j=0; j< $scope.cart.items.length; j++){
                 var cart_item = $scope.cart.items[j].sku;
                 if(cart_item == inventory_item){                    // if cart_item sku
                   // deduct shopping cart quantity from inventory weight
                   $scope.merchandise_inventory[i].quantity -= $scope.cart.items[j].quantity;}}}});};
    $scope.add_workweek_sampler_to_cart = function (sku, name, roast_type, price, quantity) {
      $scope.cart.addItem(sku, name, roast_type, price, quantity);
      $scope.Total += price;
      $route.reload();
    };
    $scope.add_discounted_purchase_to_cart = function (sku, name, roast_type, price, quantity) {
        var stock_weight = $filter('filter')($scope.discounted_inventory, {'sku': sku})[0].weight;
        if (stock_weight - quantity >= 0) {
            $scope.cart.addItem(sku, name, roast_type, price, quantity);
            $scope.Total += price;
            for (var i = 0; i < $scope.discounted_inventory.length; i++) {
                var item = $scope.discounted_inventory[i];

                if (item.sku == sku) {
                    item.weight -= quantity;
                }
            }
            $route.reload();
        }else {alert("That's more than we have, high roller! Try back next week ...");}};
    $scope.add_regular_purchase_to_cart = function (sku, name, roast_type, price, quantity) {
        var stock_weight = $filter('filter')($scope.packaged_inventory, {'sku': sku, 'roast_type': roast_type})[0].weight;

        if (stock_weight - quantity >= 0) {
            $scope.cart.addItem(sku, name, roast_type, price, quantity);
            $scope.Total += price;
            for (var i = 0; i < $scope.packaged_inventory.length; i++) {
                var item = $scope.packaged_inventory[i];

                if (item.sku == sku) {
                    item.weight -= quantity;
                }
            }
            $route.reload();
          }else {alert("That's more than we have, high roller! Try back next week ...");}};
    $scope.add_merchandise_purchase_to_cart = function (sku, name, description, price, quantity) {
        var stock_weight = $filter('filter')($scope.merchandise_inventory, {'sku': sku, 'description': description})[0].quantity;

        if (stock_weight - quantity >= 0) {
            $scope.cart.addItem(sku, name, description, price, quantity);
            $scope.Total += price;
            for (var i = 0; i < $scope.merchandise_inventory.length; i++) {
                var item = $scope.merchandise_inventory[i];

                if (item.sku == sku) {
                    item.quantity -= quantity;
                }
            }
            $route.reload();
          }else {alert("That's more than we have, high roller! Try back next week ...");}};
    $scope.add_reservation_to_cart = function (sku, name, description, price, quantity) {
      var stock_weight = $filter('filter')($scope.green_inventory, {'sku': sku})[0].weight;

          if (!($scope.roast_type_cats.includes(description))){
              description = "1st crack (light)";
          }


      if (stock_weight - quantity >= 0) {
            $scope.cart.addItem(sku, name, description, price, quantity);
            $scope.Total += price;
            for (var i = 0; i < $scope.green_inventory.length; i++) {
                var item = $scope.green_inventory[i];

                if (item.sku == sku) {
                    item.weight -= quantity;
                }
            }
            $route.reload();
            $scope.last_roast_type = description;
      }else {alert("That's more than we have, high roller! Try back next week ...");}};
    $scope.clear_cart = function () {
      $scope.cart.clearItems();
      $scope.Total = ShoppingCartFactory.cart.getTotalPrice();
      $route.reload();
    };
    $scope.remove_from_cart = function (sku, description) {
      $scope.cart.remove_item(sku, description);
      $scope.Total = ShoppingCartFactory.cart.getTotalPrice();
      $route.reload();
    };
  }

  init();
}]);
