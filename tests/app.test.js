const request = require('supertest');
const mysql = require('mysql2');
const app = require('../app');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
jest.setTimeout(20000);
const user = process.env.DB_USERNAME;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const employee_username = process.env.BEHIND_THE_COUNTER_USERNAME;
const employee_password = process.env.BEHIND_THE_COUNTER_PASSWORD;
// process.env.NODE_ENV = 'live';

/*--**     SEE CafLaM_MEAN_Stack WORKORDER    **--*/

describe('CaffeineLaManna.Com E2E tests:', () => {

  /* main checks */
  it('should be listening', async () => {
    return await request(app).get('/').expect(200);
    });
  it('should return error on false page request', () => {
    return request(app).get('/SomeFalsePage').expect(404);
  });

  /* --- Check Backend Routes and Database --- */
  describe('Main Routes and Backend Database tests:', () => {

    /* --- Check Main Route --- */
    it('checking main Frontend route', async () => {
      return await request(app).get('/public/')
                         .expect(200) //http success
                         .then((response) => {
                             var index = response.text.toString();
                             var indexfile = fs.readFile('/Users/j/Desktop/2021_Kode_Tut/CafLaM_MEAN_Stack/public/index.html', 'utf8', (err, data) => {
                               expect(index).toBe(data);
                             });
                         });
    })

    /* --- Check StoreFront Main Route --- */
    describe('Store Front', () => {
        it('checking main StoreFront route', async () => {
          return await request(app).get('/public/#!/StoreFront/store_front.html')
                             .expect(200) //http success
                             .then((response) => {
                                 // console.log(response.body);
                             });
        })
    });

    /* --- Check BehindTheCounter Main Route --- */
    describe('Behind The Counter', () => {

        it('checking BehindTheCounter Main route', async () => {
          return await request(app).get('/public/#!/BehindTheCounter/behind_the_counter.html')
                             .expect(200) //http success
                             .then((response) => {
                                 // console.log(response.body);
                             });
        })

        describe('Authorization', () => {
          var userPool;
          beforeEach( async () => {
            return userPool = await mysql.createPool({
                connectionLimit: 10,
                user: user,
                password: pass,
                database: 'RoastMeister',
                host: host,
                port: db_port
            });
          });
          afterEach(() => {
            return userPool.end();
          });
            it('GET Users route should be connected', async () => {
                await request(app).get('/users') //service request to backend inventory database
                                   .expect(200) //http success
                                   .expect('Content-Type', /json/) // check Content-Type is json
                                   .then((response) => {
                                       // console.log(response.body.Employees);
                                   });
            });
            it('should be able to fetch a user', async () => {
                return await request(app).get('/users') //service request to backend inventory database
                                   .expect(200) //http success
                                   .expect('Content-Type', /json/) // check Content-Type is json
                                   .then((response) => {
                                       // console.log(response.body.Employees[0].username);
                                       expect(response.body.Employees[0].username).toEqual(employee_username);
                                   });
            });
            it('should be able to add an employee', async () => {
                //POST service to add incoming green bean inventory
                const username = 'JoeCool', password = "BullshitPassword";
                return await request(app).post('/users/' + username + '/' + password) //service request to backend inventory database
                                   .expect(200) //http success
                                   .expect('Content-Type', /json/) // check Content-Type is json
                                   .then((response) => {
                                       // console.log(response.body);
                                   });
            });
            it('should return error on bad new employee insertion', async () => {
              const username = 'JoeCool', password = "BullshitPassword";
              return await request(app).post('/users/' + username + '/') //service request to backend inventory database
                                       .then((res) => {
                                         expect(res.status).toBe(404);
                                       });
            });
        });

        describe('PromoCode', () => {
          var promocodePool;
          beforeEach( async () => {
            return promocodePool = await mysql.createPool({
               connectionLimit: 10,
               user: user,
               password: pass,
               database: 'PromoCode',
               host: host,
               port: db_port
             });
          });
          afterEach(() => {
            return promocodePool.end();
          });
          it('should display codes with a GET request', async () => {
            return await request(app).get('/promocode') //service request to backend inventory database
                               .expect(200) //http success
                               .expect('Content-Type', /json/) // check Content-Type is json
                               .then((response) => {
                                   // console.log(response.body.Promocodes[0].promo_code);
                                   expect(response.body.Promocodes[0].promo_code);
                               });

          });
          it('should allow an Employee to register a new promotional', async () => {
              //POST service to add incoming green bean inventory
              const promo_code = 'JestTestPromo', discount_rate = 0.1, uses = 0, total_amount_discounted = 0, limit_on_uses = 0;
              return await request(app).post('/promocode/' + promo_code + '/' + discount_rate + '/' + uses + '/' + total_amount_discounted + '/' + limit_on_uses) //service request to backend inventory database
                                 .expect(200) //http success
                                 .expect('Content-Type', /json/) // check Content-Type is json
                                 .then((response) => {
                                     // console.log(response.body);
                                 });
          });
          it('should return error on bad new promocode insertion', async () => {
            const origin = 88, weight = 33, packaged_date = '2021-09-04', timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), roast_type = '1st Crack';
            return await request(app).post('/inventory/Packaged/' + '/' + weight + '/' + packaged_date + '/' + timestamp + '/' + roast_type)
                                     .then((res) => {
                                       expect(res.status).toBe(404);
                                       var errmsg = "Error in your Program Dude";
                                       expect(res.error.text.includes(errmsg));
                                     });
          });

        })

        describe('Inventory', () => {
            var inventoryPool;
            beforeEach( async () => {
              return inventoryPool = mysql.createPool({
                 connectionLimit: 10,
                 user: user,
                 password: pass,
                 database: 'Inventory',
                 host: host,
                 port: db_port
               });
            });
            afterEach(() => {
              return inventoryPool.end();
            });

            it('main route should be connected', async () => {
                const result = await request(app).get('/inventory') //service request to backend inventory database
                 .expect(200) //http success
                 .expect('Content-Type', /json/);
                 inventoryPool.end();
            });

            it('greenInventory route should be connected', async () => {
               return await request(app).get('/inventory/Green') //service request to backend inventory database
                           .expect(200) //http success
                           .expect('Content-Type', /json/) // check Content-Type is json
                           .then((response) => {
                              // console.log(response.body.greenInventory[0].id);
                              expect(response.body.greenInventory[0].id).toEqual('G');
                           });
            });
            it('packagedInventory route should be connected', async () => {
                return await request(app).get('/inventory/Packaged') //service request to backend inventory database
                                   .expect(200) //http success
                                   .expect('Content-Type', /json/) // check Content-Type is json
                                   .then((response) => {
                                     // console.log(response.body.packagedInventory[0].id);
                                     expect(response.body.packagedInventory[0].id).toEqual('P');
                                   });
            });
            it('discountedInventory route should be connected', async () => {
                return await request(app).get('/inventory/Discounted') //service request to backend inventory database
                                   .expect(200) //http success
                                   .expect('Content-Type', /json/) // check Content-Type is json

            });
            it('merchandiseInventory route should be connected', async () => {
                return await request(app).get('/inventory/Merchandise') //service request to backend inventory database
                                   .expect(200) //http success
                                   .expect('Content-Type', /json/) // check Content-Type is json

            });

            describe('checking POST routes ...', () => {
              it('should add Green Inventory', async () => {
                  //POST service to add incoming green bean inventory
                  const origin = 'jest test', reception_date = '2021-09-04', weight = 33;
                  return await request(app).post('/inventory/Green/' + origin + '/' + reception_date + '/' + weight)
                                     .expect(200) //http success
                                     .expect('Content-Type', /json/) // check Content-Type is json
                                     .then((response) => {
                                         // console.log(response.body);
                                     });
              });
              it('should return error on bad green_inventory insertion', async () => {
                const origin = 88, reception_date = '2021-09-04', weight = 33;
                return await request(app).post('/inventory/Green/' + '/' + reception_date + '/' + weight)
                              .then((res) => {
                                expect(res.status).toBe(404);
                                var errmsg = "Error in your Program Dude";
                                expect(res.error.text.includes(errmsg));
                              }); //http server error
              });
              it('should add Packaged Inventory', async () => {
                  //POST service to add roasted and packaged bean inventory
                  const origin = 'jest test', weight = 33, packaged_date = '2021-09-04', timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), roast_type = '1st Crack';
                  return await request(app).post('/inventory/Packaged/' + origin + '/' + weight + '/' + packaged_date + '/' + timestamp + '/' + roast_type) //service request to backend inventory database
                                     .expect(200) //http success
                                     .expect('Content-Type', /json/) // check Content-Type is json
                                     .then((response) => {
                                         // console.log(response.body);
                                     });
              });
              it('should return error on bad packaged_inventory insertion', async () => {
                const origin = 88, weight = 33, packaged_date = '2021-09-04', timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), roast_type = '1st Crack';
                return await request(app).post('/inventory/Packaged/' + '/' + weight + '/' + packaged_date + '/' + timestamp + '/' + roast_type)
                                         .then((res) => {
                                           expect(res.status).toBe(404);
                                           var errmsg = "Error in your Program Dude";
                                           expect(res.error.text.includes(errmsg));
                                         });
              });
              it('should add Merchandise Inventory', async () => {
                  //POST service to add items to Merchandise inventory
                  const sku = 'M0test', name = 'Test Merch', description = 'This describes the product', price = '12.24', quantity = 33, cost = '13.46';
                  return await request(app).post('/inventory/Merchandise/' + sku + '/' + name + '/' + description + '/' + price + '/' + quantity + '/' + cost) //service request to backend inventory database
                                     .expect(200) //http success
                                     .expect('Content-Type', /json/) // check Content-Type is json
                                     .then((response) => {
                                         // console.log(response.body);
                                     });          });
            });
            it('should return error on bad merchandise_inventory insertion', async () => {
              const origin = 88, weight = 33, packaged_date = '2021-09-04', timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), roast_type = '1st Crack';
              return await request(app).post('/inventory/Packaged/' + '/' + weight + '/' + packaged_date + '/' + timestamp + '/' + roast_type)
                                       .then((res) => {
                                         expect(res.status).toBe(404);
                                         var errmsg = "Error in your Program Dude";
                                         expect(res.error.text.includes(errmsg));
                                       });
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

        });

    });

    /* --- Check Greenhouse Routes --- */
    describe('Greenhouse backend', () => {
        it('checking main Greenhouse Data Route', async () => {
          return await request(app).get('/greenhouse/powerData')
                             .expect(200) //http success
                             .then((response) => {
                                 // console.log(response.body);
                             });
        })
    });

    /* --- Check SmartHome Routes --- */
    describe('Smarthome', () => {
        it('checking Smarthome FrontEnd Main Route', async () => {
          return await request(app).get('/public/#!/SmartHome/store_front.html')
                             .expect(200) //http success
                             .then((response) => {
                                 // console.log(response.body);
                             });
        })
        // it('checking main Smarthome Data Route', async () => {
        //   return await request(app).get('/smarthome/powerData')
        //                      .expect(200) //http success
        //                      .then((response) => {
        //                          // console.log(response.body);
        //                      });
        // })

    });
  });


  // /* --- Check StoreFront User Interface --- */
  // describe('Store Front UI', () => {
  //     /* --- Check Frontend StoreFront Reroute --- */
  //     it('should reroute "/" to the Store Front', () => {
  //        expect.hasAssertions();
  //     });
  //
  //     it('should have a StoreFront landing page', () => {
  //       expect.hasAssertions();
  //
  //       // return request(app).get('/public/#!/StoreFront')
  //       //                    .expect(200) //http success
  //       //                    .then((response) => {
  //       //                        // console.log(response.body);
  //       //                    });
  //     })
  //     describe('Inventory', () => {
  //       it('should show inventory available for purchase', () => {
  //           // inventory with weight/quantity greater than 0
  //           expect.hasAssertions();
  //       });
  //       it('should not show empty inventory', () => {
  //           // inventory with weight || quantity === 0 should not display
  //           expect.hasAssertions();
  //       });
  //     });
  //     describe('Subscriptions', ()=> {
  //       it('should have a front page subscription offering', () => {
  //           // add to cart
  //           expect.hasAssertions();
  //       });
  //     });
  //     describe('AngelsRoom', ()=> {
  //       it('should connect to a metamask wallet', () => {
  //           // asks to connect
  //           // displays wallet address in corner to show connection
  //           expect.hasAssertions();
  //       });
  //       it('should display tokens owned by the customer', () => {
  //           // a display of tokenized funding rounds the customer has participated in
  //           expect.hasAssertions();
  //       });
  //       it('should display all tokenized rounds', () => {
  //           // a display of all tokenized funding rounds
  //           // tokens show details
  //           //tokens link to their own unique page further describing details
  //           expect.hasAssertions();
  //       });
  //       it('should have an about page for this round', () => {
  //           // describes the details of this round of funding
  //           expect.hasAssertions();
  //       });
  //       it('should have an about page for the next round', () => {
  //           // describes next round's details
  //           expect.hasAssertions();
  //       });
  //       it('should have an about page for the last round', () => {
  //           // describes last round's details
  //           expect.hasAssertions();
  //       });
  //       it('should allow the purchase of tokens', () => {
  //           // tokens are purchased thorugh metamask wallet
  //           //
  //           // collect customer shipping information for each token purchased
  //           // allow shipping to multiple addresses
  //           expect.hasAssertions();
  //       });
  //
  //     });
  //     describe('Shopping Cart', () => {
  //       it('should allow users to add items to their shopping cart', () => {
  //           // service request to backend database
  //           expect.hasAssertions();
  //       });
  //       it('should have a checkout button', () => {
  //           // service request to checkout PayFlow
  //           expect.hasAssertions();
  //
  //       });
  //       it('should have a subscription offering', () => {
  //           // checkbox and popup to make item a regular subscription delivery
  //           expect.hasAssertions();
  //       });
  //       it('should be able to remove items', () => {
  //           // remove from cart
  //           expect.hasAssertions();
  //       });
  //       it('should be able to change item quantity', () => {
  //           // update cart
  //           expect.hasAssertions();
  //       });
  //     });
  //
  //     describe('Checkout Pay Flow', () => {
  //       it('should collect customer billing information', () => {
  //           //collect customer Billing information
  //           //credit card
  //           //billing address
  //           //email and/or phone
  //           expect.hasAssertions();
  //       });
  //       it('should collect customer shipping information', () => {
  //           //collect customer Shipping information
  //           //city state zip
  //           //should display shipping cost
  //           expect.hasAssertions();
  //       });
  //       it('should implement a Promocode system', () => {
  //           // service request to promocode database
  //           // afterEach((done) => {
  //           //   promocodePool.end();
  //           //   ordersPool.end();
  //           // });
  //           expect.hasAssertions();
  //       });
  //       it('should add the order to Current Orders Inventory', () => {
  //         // POST service to add order details
  //         expect.hasAssertions();
  //       });
  //       it('should send a callback with confirmation to the customer', () => {
  //         // POST service to show order details to customer
  //         expect.hasAssertions();
  //       });
  //       it('should send an email to the customer', () => {
  //         // POST service to send order details to user email
  //         expect.hasAssertions();
  //       });
  //       it('should alert the ShipStation', () => {
  //         // POST service to add order ShipStation
  //         expect.hasAssertions();
  //       });
  //
  //
  //       describe('Braintree', () => {
  //         it('should implement a Pay Flow with Braintree', () => {
  //             // service request to BraintTree Api
  //             expect.hasAssertions();
  //
  //         });
  //       });
  //       describe('Bankless', () => {
  //         it('should implement a Pay Flow with metamask and Ethereum', () => {
  //             // service request to metamask and Ethereum network
  //             //zksync Checkout
  //             expect.hasAssertions();
  //         });
  //       });
  //
  //     });
  // });
  //
  describe('User Experience tests', () => {

      // /* --- Check BehindTheCounter User Interface --- */
      describe('Behind The Counter UI', () => {

        /* --- Check Frontend BehindTheCounter Login Reroute --- */
        it('should be exclusive to Authorized members', () => {
            //Authorization call to database
            //check against improper access
            //reroute to login page whenever exclusive routes are called
            expect.hasAssertions();
        });

        describe('Authorization', () => {
            var userPool;
            beforeEach( async () => {
              return userPool = await mysql.createPool({
                  connectionLimit: 10,
                  user: user,
                  password: pass,
                  database: 'RoastMeister',
                  host: host,
                  port: db_port
              });
            });
            afterEach(() => {
              return userPool.end();
            });
            it('should be the landing page for all BehindTheCounter operations unless signed in', () => {
                //Gateway to BehindTheCounter Routes
                expect.hasAssertions();

            });
            it('should have a sign in form', async () => {
                //name and a password input
                return await request(app).get('/public/#!/Login')
                                         .expect(200)
                                         .then((res) => {
                                           // console.log(res);
                                         });

            });
            // it('should save a session token ', async () => {
            //    //call to backend checkCredentials()
            //    //returns userid and token
            //    let url = '/user/checkCredentials/' + employee_username + '/' + employee_password;
            //    // console.log(url);
            //    return await request(app).post('/users/checkCredentials/' + employee_username + '/' + employee_password)
            //                             .expect(200)
            //                             .expect('Content-Type', /json/) // check Content-Type is json
            //                             .then((response) => {
            //                                return response;
            //                             });
            //
            // });
            // it('should have an add an employee form', () => {
            //     //Learn how to send verification email with acceptence button and link
            //     expect.hasAssertions();
            //
            // });

        });
      //   describe('checking main BehindTheCounter route when signed in ...', () => {
      //       describe('Current Orders', () => {
      //           it('should display a Roast List of current orders', () => {
      //               //request to get list of current orders that have not yet shipped and need to be roasted
      //               //should send email to roastmeister to alert of new customer order
      //               expect.hasAssertions();
      //           });
      //       });
      //
      //       describe('Inventory', () => {
      //           it('should have a main inventory page and show all inventory with a selector', () => {
      //              // return request(app).get('/inventory') //service request to backend inventory database
      //              //             .expect(200) //http success
      //              //             .expect('Content-Type', /json/) // check Content-Type is json
      //              expect.hasAssertions();
      //
      //
      //           });
      //           it('should have an add inventory form', () => {
      //              expect.hasAssertions();
      //
      //           });
      //           it('should have a way to update inventory records', () => {
      //              expect.hasAssertions();
      //
      //           });
      //
      //       });
      //       describe('PromoCode', () => {
      //           it('should display all codes and terms with a GET request', () => {
      //             // return request(app).get('/promocode')
      //             //                    .expect(200) //http success
      //             //                    .expect('Content-Type', /json/) // check Content-Type is json
      //             //                    .then((response) => {
      //             //                        // console.log(response.body.Promocodes[0].promo_code);
      //             //                        expect(response.body.Promocodes);
      //             //                    });
      //               expect.hasAssertions();
      //
      //
      //           });
      //           it('should have a form to add a new promotional', () => {
      //               expect.hasAssertions();
      //
      //           });
      //           it('should have a way to end a promotion', () => {
      //               expect.hasAssertions();
      //
      //           });
      //           it('should have a way to change a promotion\'s terms', () => {
      //               expect.hasAssertions();
      //
      //           });
      //
      //       });
      //       describe('Customers List', () => {
      //           it('should display a Customer List of past customers', () => {
      //               //request to get list of current orders that have not yet shipped and need to be roasted
      //               expect.hasAssertions();
      //
      //           });
      //
      //       });
      //       describe('External Links', () => {
      //           it('should display Links to operational partners', () => {
      //               //shipstation, post office or shipping partners, Green Bean Supplier, Bag Supplier
      //               expect.hasAssertions();
      //           });
      //       })
      //
      //     });
      //
     });
  });
});
