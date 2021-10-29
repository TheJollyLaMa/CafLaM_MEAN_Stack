'use strict';

app.factory('CustomerFactory', ['$http', function($http) {
    return {saveCustomer: saveCustomer}

      function saveCustomer(customer) {
        // console.log(customer);
          var req = {method: 'POST', url: '/customer/add', headers: {'Content-Type': 'application/json'}, data: customer};
          return $http(req).then(function(res){
                  // console.log(res);
                  return res;
                  });
      }
}]);


/*
{
    'first_name': 'Justin',
    'last_name': 'LaManna',
    'email': 'jrlamanna@gmail.com',
    'street': '2 Jones Dr',
    'street2': '',
    'city': 'Fulton',
    'state': 'NY',
    'zipcode': '13069',
    'shiptobilling': 'true'
}
*/
