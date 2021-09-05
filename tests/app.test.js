const request = require('supertest');
const mysql = require('mysql2');
const app = require('../app');
require('dotenv').config();

const user = process.env.DB_USERNAME;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const employee_username = process.env.BEHIND_THE_COUNTER_USERNAME;
jest.setTimeout(30000);
describe('CaffeineLaManna.Com E2E tests:', () => {

  /* --- Bring in DATABASES and TABLES --- */
  const userPool = mysql.createPool({
      connectionLimit: 10,
      user: user,
      password: pass,
      database: 'RoastMeister',
      host: host,
      port: db_port
  });
  const inventoryPool = mysql.createPool({
      connectionLimit: 10,
      user: user,
      password: pass,
      database: 'Inventory',
      host: host,
      port: db_port
  });
  const promocodePool = mysql.createPool({
      connectionLimit: 10,
      user: user,
      password: pass,
      database: 'PromoCode',
      host: host,
      port: db_port
  });

  /* --- Check Main Route --- */
  it('checking main Frontend route', () => {
    return request(app).get('/public/#!/index.html')
                       .expect(200) //http success
                       .then((response) => {
                           // console.log(response.body);
                       });
  })

  /* --- Check StoreFront Main Route --- */
  describe('Store Front', () => {
      it('checking main StoreFront route', () => {
        return request(app).get('/public/#!/StoreFront/store_front.html')
                           .expect(200) //http success
                           .then((response) => {
                               // console.log(response.body);
                           });
      })
      // describe('Inventory', () => {
      //   it('should show inventory available for purchase', () => {
      //       // inventory with weight/quantity greater than 0
      //       expect.hasAssertions();
      //   });
      //   it('should not show empty inventory', () => {
      //       // inventory with weight || quantity === 0 should not display
      //       expect.hasAssertions();
      //   });
      // });
      // describe('Subscriptions', ()=> {
      //   it('should have a front page subscription offering', () => {
      //       // add to cart
      //       expect.hasAssertions();
      //   });
      // });
      // describe('AngelsRoom', ()=> {
      //   it('should connect to a metamask wallet', () => {
      //       // asks to connect
      //       // displays wallet address in corner to show connection
      //       expect.hasAssertions();
      //   });
      //   it('should display tokens owned by the customer', () => {
      //       // a display of tokenized funding rounds the customer has participated in
      //       expect.hasAssertions();
      //   });
      //   it('should display all tokenized rounds', () => {
      //       // a display of all tokenized funding rounds
      //       // tokens show details
      //       //tokens link to their own unique page further describing details
      //       expect.hasAssertions();
      //   });
      //   it('should have an about page for this round', () => {
      //       // describes the details of this round of funding
      //       expect.hasAssertions();
      //   });
      //   it('should have an about page for the next round', () => {
      //       // describes next round's details
      //       expect.hasAssertions();
      //   });
      //   it('should have an about page for the last round', () => {
      //       // describes last round's details
      //       expect.hasAssertions();
      //   });
      //   it('should allow the purchase of tokens', () => {
      //       // tokens are purchased thorugh metamask wallet
      //       //
      //       // collect customer shipping information for each token purchased
      //       // allow shipping to multiple addresses
      //       expect.hasAssertions();
      //   });
      //
      // });
      // describe('Shopping Cart', () => {
      //   it('should allow users to add items to their shopping cart', () => {
      //       // service request to backend database
      //       expect.hasAssertions();
      //   });
      //   it('should have a checkout button', () => {
      //       // service request to checkout PayFlow
      //       expect.hasAssertions();
      //
      //   });
      //   it('should have a subscription offering', () => {
      //       // checkbox and popup to make item a regular subscription delivery
      //       expect.hasAssertions();
      //   });
      //   it('should be able to remove items', () => {
      //       // remove from cart
      //       expect.hasAssertions();
      //   });
      //   it('should be able to change item quantity', () => {
      //       // update cart
      //       expect.hasAssertions();
      //   });
      // });

      // describe('Checkout Pay Flow', () => {
      //   it('should collect customer billing information', () => {
      //       //collect customer Billing information
      //       //credit card
      //       //billing address
      //       //email and/or phone
      //       expect.hasAssertions();
      //   });
      //   it('should collect customer shipping information', () => {
      //       //collect customer Shipping information
      //       //city state zip
      //       //should display shipping cost
      //       expect.hasAssertions();
      //   });
      //   it('should implement a Promocode system', () => {
      //       // service request to promocode database
      //       // afterEach((done) => {
      //       //   promocodePool.end();
      //       //   ordersPool.end();
      //       // });
      //       expect.hasAssertions();
      //   });
      //   it('should add the order to Current Orders Inventory', () => {
      //     // POST service to add order details
      //     expect.hasAssertions();
      //   });
      //   it('should send a callback with confirmation to the customer', () => {
      //     // POST service to show order details to customer
      //     expect.hasAssertions();
      //   });
      //   it('should send an email to the customer', () => {
      //     // POST service to send order details to user email
      //     expect.hasAssertions();
      //   });
      //   it('should alert the ShipStation', () => {
      //     // POST service to add order ShipStation
      //     expect.hasAssertions();
      //   });
      //
      //
      //   describe('Braintree', () => {
      //     it('should implement a Pay Flow with Braintree', () => {
      //         // service request to BraintTree Api
      //         expect.hasAssertions();
      //
      //     });
      //   });
      //   describe('Bankless', () => {
      //     it('should implement a Pay Flow with metamask and Ethereum', () => {
      //         // service request to metamask and Ethereum network
      //         //zksync Checkout
      //         expect.hasAssertions();
      //     });
      //   });
      //
      // });
  });

  /* --- Check BehindTheCounter Main Route --- */
  describe('Behind The Counter', () => {
    it('checking main BehindTheCounter route', () => {
      return request(app).get('/public/#!/BehindTheCounter/behind_the_counter.html')
                         .expect(200) //http success
                         .then((response) => {
                             // console.log(response.body);
                         });
    })
    // it('should be exclusive to Authorized members', () => {
    //     //Authorization call to database
    //     //check against improper access
    //     expect.hasAssertions();
    // });
    describe('Authorization', () => {
        it('GET Users route should be connected', () => {
            return request(app).get('/users') //service request to backend inventory database
                               .expect(200) //http success
                               .expect('Content-Type', /json/) // check Content-Type is json
                               .then((response) => {
                                   // console.log(response.body.Employees);
                               });
        });
        it('should be able to fetch a user', () => {
            return request(app).get('/users') //service request to backend inventory database
                               .expect(200) //http success
                               .expect('Content-Type', /json/) // check Content-Type is json
                               .then((response) => {
                                   // console.log(response.body.Employees[0].username);
                                   expect(response.body.Employees[0].username).toEqual(employee_username);
                               });
        });
        it('should be able to add an employee', () => {
            //POST service to add incoming green bean inventory
            const username = 'JoeCool', password = "BullshitPassword";
            return request(app).post('/users/' + username + '/' + password) //service request to backend inventory database
                               .expect(200) //http success
                               .expect('Content-Type', /json/) // check Content-Type is json
                               .then((response) => {
                                   // console.log(response.body);
                               });
        });
    });


    // it('should display a Roast List of current orders', () => {
    //     //request to get list of current orders that have not yet shipped and need to be roasted
    //     //should send email to roastmeister to alert of new customer order
    //
    //     expect.hasAssertions();
    // });
    // it('should display a Customer List of past customers', () => {
    //     //request to get list of current orders that have not yet shipped and need to be roasted
    //     expect.hasAssertions();
    // });
    // it('should display Links to operational partners', () => {
    //     //shipstation, post office or shipping partners, Green Bean Supplier, Bag Supplier
    //     expect.hasAssertions();
    // });
    describe('PromoCode', () => {
      it('should display codes with a GET request', () => {
        return request(app).get('/promocode') //service request to backend inventory database
                           .expect(200) //http success
                           .expect('Content-Type', /json/) // check Content-Type is json
                           .then((response) => {
                               // console.log(response.body.Promocodes[0].promo_code);
                               expect(response.body.Promocodes[0].promo_code);
                           });

      });
      it('should allow an Employee to register a new promotional', () => {
          //POST service to add incoming green bean inventory
          const promo_code = 'JestTestPromo', discount_rate = 0.1, uses = 0, total_amount_discounted = 0, limit_on_uses = 0;
          return request(app).post('/promocode/' + promo_code + '/' + discount_rate + '/' + uses + '/' + total_amount_discounted + '/' + limit_on_uses) //service request to backend inventory database
                             .expect(200) //http success
                             .expect('Content-Type', /json/) // check Content-Type is json
                             .then((response) => {
                                 // console.log(response.body);
                             });
      });

    })

    describe('Inventory', () => {

        it('main route should be connected', () => {
           return request(app).get('/inventory') //service request to backend inventory database
                       .expect(200) //http success
                       .expect('Content-Type', /json/) // check Content-Type is json

        });
        it('greenInventory route should be connected', () => {
           return request(app).get('/inventory/Green') //service request to backend inventory database
                       .expect(200) //http success
                       .expect('Content-Type', /json/) // check Content-Type is json
                       .then((response) => {
                          // console.log(response.body.greenInventory[0].id);
                          expect(response.body.greenInventory[0].id).toEqual('G');
                       });
        });
        it('packagedInventory route should be connected', () => {
            return request(app).get('/inventory/Packaged') //service request to backend inventory database
                               .expect(200) //http success
                               .expect('Content-Type', /json/) // check Content-Type is json
                               .then((response) => {
                                 // console.log(response.body.packagedInventory[0].id);
                                 expect(response.body.packagedInventory[0].id).toEqual('P');
                               });
        });
        it('discountedInventory route should be connected', () => {
            return request(app).get('/inventory/Discounted') //service request to backend inventory database
                               .expect(200) //http success
                               .expect('Content-Type', /json/) // check Content-Type is json

        });
        it('merchandiseInventory route should be connected', () => {
            return request(app).get('/inventory/Merchandise') //service request to backend inventory database
                               .expect(200) //http success
                               .expect('Content-Type', /json/) // check Content-Type is json

        });

        describe('checking POST routes ...', () => {
          it('should add Green Inventory', () => {
              //POST service to add incoming green bean inventory
              const origin = 'jest test', reception_date = '2021-09-04', weight = 33;
              return request(app).post('/inventory/Green/' + origin + '/' + reception_date + '/' + weight) //service request to backend inventory database
                                 .expect(200) //http success
                                 .expect('Content-Type', /json/) // check Content-Type is json
                                 .then((response) => {
                                     // console.log(response.body);
                                 });
          });
          it('should add Packaged Inventory', () => {
              //POST service to add roasted and packaged bean inventory
              const origin = 'jest test', weight = 33, packaged_date = '2021-09-04', timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), roast_type = '1st Crack';
              return request(app).post('/inventory/Packaged/' + origin + '/' + weight + '/' + packaged_date + '/' + timestamp + '/' + roast_type) //service request to backend inventory database
                                 .expect(200) //http success
                                 .expect('Content-Type', /json/) // check Content-Type is json
                                 .then((response) => {
                                     // console.log(response.body);
                                 });          });
          it('should add Merchandise Inventory', () => {
              //POST service to add items to Merchandise inventory
              const sku = 'M0test', name = 'Test Merch', description = 'This describes the product', price = '12.24', quantity = 33, cost = '13.46';
              return request(app).post('/inventory/Merchandise/' + sku + '/' + name + '/' + description + '/' + price + '/' + quantity + '/' + cost) //service request to backend inventory database
                                 .expect(200) //http success
                                 .expect('Content-Type', /json/) // check Content-Type is json
                                 .then((response) => {
                                     // console.log(response.body);
                                 });          });
        });

    });

    describe('Deleting Jest test data ...', () => {
      it('should delete Green Inventory test POST', () => {
        return request(app).post('/inventory/Green/Delete')
                           .expect(200) //http success
                           .expect('Content-Type', /json/) // check Content-Type is json
                           .then((response) => {
                               // console.log(response.body);
                           });
      })
      it('should delete Package Inventory test POST', () => {
        return request(app).post('/inventory/Packaged/Delete')
                           .expect(200) //http success
                           .expect('Content-Type', /json/) // check Content-Type is json
                           .then((response) => {
                               // console.log(response.body);
                           });
      })
      it('should delete Merchandise Inventory test POST', () => {
        return request(app).post('/inventory/Merchandise/Delete')
                           .expect(200) //http success
                           .expect('Content-Type', /json/) // check Content-Type is json
                           .then((response) => {
                               // console.log(response.body);
                           });
      })
      it('should delete New Employee test POST', () => {
        return request(app).post('/users/Delete')
                           .expect(200) //http success
                           .expect('Content-Type', /json/) // check Content-Type is json
                           .then((response) => {
                               // console.log(response.body);
                           });
      })
      it('should delete New Promocode test POST', () => {
        return request(app).post('/promocode/Delete')
                           .expect(200) //http success
                           .expect('Content-Type', /json/) // check Content-Type is json
                           .then((response) => {
                               // console.log(response.body);
                           });
      })

    })

  });
  userPool.end();
  inventoryPool.end();
  promocodePool.end();

});
// routes for front end access to arduino smarthome garden and solar controllers
// describe('SmartHome E2E tests', () => {
//   it('should be defined later', () => {
//     expect.hasAssertions();
//   });
// });
