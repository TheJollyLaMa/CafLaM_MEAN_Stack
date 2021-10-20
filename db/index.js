const mysql = require('mysql2');
var moment = require('moment');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let date = moment().format('yyyy-mm-dd:hh:mm:ss');
let discountdate = moment().subtract(14,'d').format('YYYY-MM-DD');
//populate memPools
const user = process.env.DB_USERNAME;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const inventoryPool = mysql.createPool({
    connectionLimit: 10,
    user: user,
    password: pass,
    database: 'Inventory',
    host: host,
    port: db_port
});
const userPool = mysql.createPool({
    connectionLimit: 10,
    user: user, // root
    password: pass, // GroWBetteR
    database: 'RoastMeister',
    host: host, // localhost
    port: db_port
});
const promocodePool = mysql.createPool({
    connectionLimit: 10,
    user: user, // root
    password: pass, // GroWBetteR
    database: 'PromoCode',
    host: host, // localhost
    port: db_port
});
const ordersPool = mysql.createPool({
    connectionLimit: 10,
    user: user, // root
    password: pass, // GroWBetteR
    database: 'Purchase_Orders',
    host: host, // localhost
    port: db_port
});
const customerPool = mysql.createPool({
    connectionLimit: 10,
    user: user, // root
    password: pass, // GroWBetteR
    database: 'Customers',
    host: host, // localhost
    port: db_port
});

let db = {};
// get Users
db.get_employee_list = () => {
    return new Promise((resolve, reject) => {
        userPool.query(`SELECT * FROM Auth`, (err, results) => {
            return resolve(results);
        });
    });
};
// check user creds
db.check_credentials = (_username,_password) => {
    let values = [_username, _password], $response = [];
    // console.log(values);
    return new Promise((resolve, reject) => {
        userPool.query(`SELECT * FROM Auth WHERE username = ? AND password = ?`, values, (err, results) => {
          if(!results) {
            return results = {success:false, msg: 'User not found'};
          }else{
            var user = {username: _username}
            // console.log(user.username);
            const token= jwt.sign(user, 'somesecret', {
              expiresIn: 604800 //1 week worth of seconds
            });
            // console.log(token);
            results = {
              success: true,
              token: 'JWT ' + token,
              user: user.username
            }
          return resolve(results);
        };
    });
  })
};
// get Green_Inventory
db.get_green_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Green_Inventory`, (err, results) => {
            return resolve(results);
        });
    });
};
// get Packaged_Inventory
db.get_packaged_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Packaged_Inventory`, (err, results) => { //WHERE weight > 0
            return resolve(results);
        });
    });
};
// get Discounted_Inventory
db.get_discounted_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Packaged_Inventory WHERE packaged_date <= ?`, [discountdate], (err, results) => {
            return resolve(results);
        });
    });
};
// get Merch Inventory
db.get_merchandise_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Merchandise_Inventory`, (err, results) => { //WHERE weight > 0
            return resolve(results);
        });
    });
};
// get Promocodes
db.get_promocodes = () => {
    return new Promise((resolve, reject) => {
        promocodePool.query(`SELECT * FROM PromoCodeTally`, (err, results) => { //WHERE weight > 0
            return resolve(results);
        });
    });
};
// check promocode
db.check_promocode = (_promocode) => {
    _promocode = '#' + _promocode;
    let values = [[_promocode]], $response = [];
    console.log(_promocode);
    return new Promise((resolve, reject) => {
        promocodePool.query(`SELECT * FROM PromoCodeTally WHERE promo_code = ?`, values, (err, results) => {
          if(!results) {
            // console.log(results);
            return results = {success:false, msg: 'Promocode not found'};
          }
          // else if(results.discount.limit_on_uses === results.discount.uses){
          //   return results = {success:false, msg: 'Limit on uses has been reached'};
          // }
          else{
            console.log(resolve(results));
          return resolve(results);
        };
    });
  })
};
db.add_employee = (_username, _password) => {
    return new Promise((resolve, reject) => {
      let values = [[_username, _password]];
      userPool.query(`INSERT INTO Auth (username, password) VALUES ?`, [values], (err, results) => {
          return resolve(results);
      });
   });
};
db.add_customer = (_customer) => {
    // console.log(_customer.first_name);
    return new Promise((resolve, reject) => {
      let values = [[_customer.first_name, _customer.last_name, _customer.email, _customer.street, _customer.street2, _customer.city, _customer.state, _customer.zipcode, _customer.shiptobilling]];
      // console.log(values);
      customerPool.query(`INSERT INTO CustomerList (first_name, last_name, email, street, street2, city, state, zipcode, shiptobilling) VALUES ?`, [values], (err, results) => {
        // console.log(results);
        // console.log(err);
        if(err) {
          // console.log(results);
          return results = {success:false, msg: 'Something wrong in entry', err: err};
        }
        return resolve(results);
          // CREATE TABLE CustomerList (first_name VARCHAR(40) NOT NULL, last_name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL, street VARCHAR(40) NOT NULL, street2 VARCHAR(40), city VARCHAR(40) NOT NULL, state VARCHAR(15) NOT NULL, zipcode INT NOT NULL, shiptobilling BOOL NOT NULL);
          // INSERT INTO CustomerList (first_name, last_name, email, street, street2, city, state, zipcode, shiptobilling) VALUES ('Testy', 'Tester', 'Testys@yahoo.com', '69 Johnson St', '', 'Petersville', 'FL', '98064', true);

      });
   });
};
//insert incoming green beans
db.insert_green_inventory = (_origin, _reception_date, _weight) => {
    return new Promise((resolve, reject) => {
      let values = [[_origin, _reception_date, _weight]];
      // console.log('add to inventory ...');
      inventoryPool.query(`INSERT INTO Green_Inventory (origin, reception_date, weight) VALUES ?`, [values], (err, results) => {
          // console.log(results);
          return resolve(results);
      });
      // console.log('generate sku ...');
      inventoryPool.query(`UPDATE Green_Inventory SET sku = CONCAT(id,batch) WHERE sku = 'G0'`, (err, results) => {
        return resolve(results);
      });
   });
};
//insert incoming green beans
db.insert_packaged_inventory = (_origin,_weight,_packaged_date,_timestamp,_roast_type) => {
    return new Promise((resolve, reject) => {
      let values = [[_origin,_weight,_packaged_date,_timestamp,_roast_type]];
      // console.log('add to inventory ...');
      inventoryPool.query(`INSERT INTO Packaged_Inventory (origin, weight, packaged_date, timestamp, roast_type) VALUES ?`, [values], (err, results) => {
          // console.log(results);
          return resolve(results);
      });
      inventoryPool.query(`UPDATE Packaged_Inventory SET sku = CONCAT(id,batch) WHERE sku = 'P0'`, (err, results) => {
        return resolve(results);
      });
   });
};
//insert incoming green beans
db.insert_merchandise_inventory = (_sku,_name,_description,_price,_quantity,_cost) => {
    return new Promise((resolve, reject) => {
      let values = [[_sku,_name,_description,_price,_quantity,_cost]];
      // console.log('add to inventory ...');
      inventoryPool.query(`INSERT INTO Merchandise_Inventory (sku, name, description, price, quantity, cost) VALUES ?`, [values], (err, results) => {
          // console.log(results);
          return resolve(results);
      });
   });
};
// add new PromoCode
db.add_promocode = (_promo_code, _discount_rate, _uses, _total_amount_discounted, _limit_on_uses) => {
    return new Promise((resolve, reject) => {
      let values = [[_promo_code, _discount_rate, _uses, _total_amount_discounted, _limit_on_uses]];
      // console.log('add to inventory ...');
      promocodePool.query(`INSERT INTO PromoCodeTally (promo_code, discount_rate, Uses, total_amount_discounted, limit_on_uses) VALUES ?`, [values], (err, results) => {
          // console.log(results);
          return resolve(results);
      });
   });
};
// delete test inventory from jest tests
db.delete_test_green_inventory = () => {
    return new Promise((resolve, reject) => {
      // console.log('delete test from inventory ...');
      inventoryPool.query(`DELETE FROM Green_Inventory WHERE origin = 'jest test'`, (err, results) => {
          return resolve(results);
      });
   });
};
db.delete_test_packaged_inventory = () => {
    return new Promise((resolve, reject) => {
      // console.log('delete test from inventory ...');
      inventoryPool.query(`DELETE FROM Packaged_Inventory WHERE origin = 'jest test'`, (err, results) => {
          return resolve(results);
      });
   });
};
db.delete_test_merchandise_inventory = () => {
    return new Promise((resolve, reject) => {
      // console.log('delete test from inventory ...');
      inventoryPool.query(`DELETE FROM Merchandise_Inventory WHERE sku = 'M0test'`, (err, results) => {
          return resolve(results);
      });
   });
};
db.delete_test_employee = () => {
    return new Promise((resolve, reject) => {
      // console.log('delete test from inventory ...');
      userPool.query(`DELETE FROM Auth WHERE username = 'JoeCool'`, (err, results) => {
          return resolve(results);
      });
   });
};
db.delete_test_promocode = () => {
    return new Promise((resolve, reject) => {
      // console.log('delete test from inventory ...');
      promocodePool.query(`DELETE FROM PromoCodeTally WHERE promo_code = 'JestTestPromo'`, (err, results) => {
          return resolve(results);
      });
   });
};

//Update after purchase
// dB.update_inventory_after_purchase = (data) => {
//     return new Promise((resolve, reject) => {
//       // inventoryPool.query(`SELECT * FROM Merchandise_Inventory`, data, (err, results) => { //WHERE weight > 0
//           if(err) {
//             return reject(err);
//           }
//           return resolve(results);
//       });
//   });
// };
// Set A trigger in MYSQL
// DELIMITER |
// CREATE TRIGGER `packaged_sku_trigger` BEFORE INSERT ON `Packaged_Inventory`
// FOR EACH ROW
// BEGIN
//   SET NEW.sku = CONCAT(NEW.id, NEW.batch);
// END |
// DELIMITER;
module.exports = db;
