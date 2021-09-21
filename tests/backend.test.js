const request = require('supertest');
const mysql = require('mysql2');
const app = require('../app');
require('dotenv').config();

//
// /* Backend Database and Route tests*/
// jest.setTimeout(30000);
// const user = process.env.DB_USERNAME;
// const pass = process.env.DB_PASS;
// const host = process.env.DB_HOST;
// const db_port = process.env.DB_PORT;
// const employee_username = process.env.BEHIND_THE_COUNTER_USERNAME;
//
describe('Backend Database and Routes tests:', () => {
//
//   /* --- Bring in DATABASES and TABLES --- */
//   // const userPool = mysql.createPool({
//   //     connectionLimit: 10,
//   //     user: user,
//   //     password: pass,
//   //     database: 'RoastMeister',
//   //     host: host,
//   //     port: db_port
//   // });
//   // const inventoryPool = mysql.createPool({
//   //     connectionLimit: 10,
//   //     user: user,
//   //     password: pass,
//   //     database: 'Inventory',
//   //     host: host,
//   //     port: db_port
//   // });
//   // const promocodePool = mysql.createPool({
//   //     connectionLimit: 10,
//   //     user: user,
//   //     password: pass,
//   //     database: 'PromoCode',
//   //     host: host,
//   //     port: db_port
//   // });
//
//   /* --- Check Main Route --- */
//   it('checking main Frontend route', () => {
//     return request(app).get('/public/#!/index.html')
//                        .expect(200) //http success
//                        .then((response) => {
//                            // console.log(response.body);
//                        });
//   })
//
//   /* --- Check StoreFront Main Route --- */
//   describe('Store Front', () => {
//       it('checking main StoreFront route', () => {
//         return request(app).get('/public/#!/StoreFront/store_front.html')
//                            .expect(200) //http success
//                            .then((response) => {
//                                // console.log(response.body);
//                            });
//       })
//   });
//
//   /* --- Check BehindTheCounter Main Route --- */
  describe('Behind The Counter', () => {

      it('checking BehindTheCounter Main route', async () => {
        return await request(app).get('/public/#!/BehindTheCounter/behind_the_counter.html')
                           .expect(200) //http success
                           .then((response) => {
                               // console.log(response.body);
                           });
      })
//
//       describe('Authorization', () => {
//           it('GET Users route should be connected', () => {
//               return request(app).get('/users') //service request to backend inventory database
//                                  .expect(200) //http success
//                                  .expect('Content-Type', /json/) // check Content-Type is json
//                                  .then((response) => {
//                                      // console.log(response.body.Employees);
//                                  });
//           });
//           it('should be able to fetch a user', () => {
//               return request(app).get('/users') //service request to backend inventory database
//                                  .expect(200) //http success
//                                  .expect('Content-Type', /json/) // check Content-Type is json
//                                  .then((response) => {
//                                      // console.log(response.body.Employees[0].username);
//                                      expect(response.body.Employees[0].username).toEqual(employee_username);
//                                  });
//           });
//           it('should be able to add an employee', () => {
//               //POST service to add incoming green bean inventory
//               const username = 'JoeCool', password = "BullshitPassword";
//               return request(app).post('/users/' + username + '/' + password) //service request to backend inventory database
//                                  .expect(200) //http success
//                                  .expect('Content-Type', /json/) // check Content-Type is json
//                                  .then((response) => {
//                                      // console.log(response.body);
//                                  });
//           });
//       });
//
//       describe('PromoCode', () => {
//         it('should display codes with a GET request', () => {
//           return request(app).get('/promocode') //service request to backend inventory database
//                              .expect(200) //http success
//                              .expect('Content-Type', /json/) // check Content-Type is json
//                              .then((response) => {
//                                  // console.log(response.body.Promocodes[0].promo_code);
//                                  expect(response.body.Promocodes[0].promo_code);
//                              });
//
//         });
//         it('should allow an Employee to register a new promotional', () => {
//             //POST service to add incoming green bean inventory
//             const promo_code = 'JestTestPromo', discount_rate = 0.1, uses = 0, total_amount_discounted = 0, limit_on_uses = 0;
//             return request(app).post('/promocode/' + promo_code + '/' + discount_rate + '/' + uses + '/' + total_amount_discounted + '/' + limit_on_uses) //service request to backend inventory database
//                                .expect(200) //http success
//                                .expect('Content-Type', /json/) // check Content-Type is json
//                                .then((response) => {
//                                    // console.log(response.body);
//                                });
//         });
//
//       })
//
//       describe('Inventory', () => {
//
//           it('main route should be connected', () => {
//             // try {
//               const result = request(app).get('/inventory') //service request to backend inventory database
//                .expect(200) //http success
//                .expect('Content-Type', /json/)
//             // }catch (e) {
//             //   console.log(e);
//             //   expect.hasAssertions();
//             //   // expect(e).toMatch('error');
//             //   // expect(res.status).toBe(500);
//             // }
//
//           });
//           it('greenInventory route should be connected', () => {
//              return request(app).get('/inventory/Green') //service request to backend inventory database
//                          .expect(200) //http success
//                          .expect('Content-Type', /json/) // check Content-Type is json
//                          .then((response) => {
//                             // console.log(response.body.greenInventory[0].id);
//                             expect(response.body.greenInventory[0].id).toEqual('G');
//                          });
//           });
//           it('packagedInventory route should be connected', () => {
//               return request(app).get('/inventory/Packaged') //service request to backend inventory database
//                                  .expect(200) //http success
//                                  .expect('Content-Type', /json/) // check Content-Type is json
//                                  .then((response) => {
//                                    // console.log(response.body.packagedInventory[0].id);
//                                    expect(response.body.packagedInventory[0].id).toEqual('P');
//                                  });
//           });
//           it('discountedInventory route should be connected', () => {
//               return request(app).get('/inventory/Discounted') //service request to backend inventory database
//                                  .expect(200) //http success
//                                  .expect('Content-Type', /json/) // check Content-Type is json
//
//           });
//           it('merchandiseInventory route should be connected', () => {
//               return request(app).get('/inventory/Merchandise') //service request to backend inventory database
//                                  .expect(200) //http success
//                                  .expect('Content-Type', /json/) // check Content-Type is json
//
//           });
//
//           describe('checking POST routes ...', () => {
//             it('should add Green Inventory', () => {
//                 //POST service to add incoming green bean inventory
//                 const origin = 'jest test', reception_date = '2021-09-04', weight = 33;
//                 return request(app).post('/inventory/Green/' + origin + '/' + reception_date + '/' + weight) //service request to backend inventory database
//                                    .expect(200) //http success
//                                    .expect('Content-Type', /json/) // check Content-Type is json
//                                    .then((response) => {
//                                        // console.log(response.body);
//                                    });
//             });
//             it('should add Packaged Inventory', () => {
//                 //POST service to add roasted and packaged bean inventory
//                 const origin = 'jest test', weight = 33, packaged_date = '2021-09-04', timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), roast_type = '1st Crack';
//                 return request(app).post('/inventory/Packaged/' + origin + '/' + weight + '/' + packaged_date + '/' + timestamp + '/' + roast_type) //service request to backend inventory database
//                                    .expect(200) //http success
//                                    .expect('Content-Type', /json/) // check Content-Type is json
//                                    .then((response) => {
//                                        // console.log(response.body);
//                                    });          });
//             it('should add Merchandise Inventory', () => {
//                 //POST service to add items to Merchandise inventory
//                 const sku = 'M0test', name = 'Test Merch', description = 'This describes the product', price = '12.24', quantity = 33, cost = '13.46';
//                 return request(app).post('/inventory/Merchandise/' + sku + '/' + name + '/' + description + '/' + price + '/' + quantity + '/' + cost) //service request to backend inventory database
//                                    .expect(200) //http success
//                                    .expect('Content-Type', /json/) // check Content-Type is json
//                                    .then((response) => {
//                                        // console.log(response.body);
//                                    });          });
//           });
//
//       });
//
//       describe('Deleting Jest test data ...', () => {
//         it('should delete Green Inventory test POST', () => {
//           return request(app).post('/inventory/Green/Delete')
//                              .expect(200) //http success
//                              .expect('Content-Type', /json/) // check Content-Type is json
//                              .then((response) => {
//                                  // console.log(response.body);
//                              });
//         })
//         it('should delete Package Inventory test POST', () => {
//           return request(app).post('/inventory/Packaged/Delete')
//                              .expect(200) //http success
//                              .expect('Content-Type', /json/) // check Content-Type is json
//                              .then((response) => {
//                                  // console.log(response.body);
//                              });
//         })
//         it('should delete Merchandise Inventory test POST', () => {
//           return request(app).post('/inventory/Merchandise/Delete')
//                              .expect(200) //http success
//                              .expect('Content-Type', /json/) // check Content-Type is json
//                              .then((response) => {
//                                  // console.log(response.body);
//                              });
//         })
//         it('should delete New Employee test POST', () => {
//           return request(app).post('/users/Delete')
//                              .expect(200) //http success
//                              .expect('Content-Type', /json/) // check Content-Type is json
//                              .then((response) => {
//                                  // console.log(response.body);
//                              });
//         })
//         it('should delete New Promocode test POST', () => {
//           return request(app).post('/promocode/Delete')
//                              .expect(200) //http success
//                              .expect('Content-Type', /json/) // check Content-Type is json
//                              .then((response) => {
//                                  // console.log(response.body);
//                              });
//         })
//
//       })
//
  });
//
//   userPool.end();
//   inventoryPool.end();
//   promocodePool.end();
//
//
});
// // routes for front end access to arduino smarthome garden and solar controllers
// // describe('SmartHome E2E tests', () => {
// //   it('should be defined later', () => {
// //     expect.hasAssertions();
// //   });
// // });
