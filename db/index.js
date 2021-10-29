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
db.get_orders_list = () => {
    return new Promise((resolve, reject) => {
        ordersPool.query(`SELECT * FROM current`, (err, results) => {
            return resolve(results);
        });
    });
};
db.post_new_order = (_id, _buyer, _email, _payment_status, _total, _cart) => {
    return new Promise((resolve, reject) => {
      let values = [[_id, _buyer, _email, _payment_status, _total, _cart]];
      ordersPool.query(`INSERT INTO current (id, buyer, email, payment_status, total, cart) VALUES ?`, [values], (err, results) => {
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
    // console.log(_promocode);
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
            // console.log(results);
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
      let values = [[_customer.billing.first_name, _customer.billing.last_name, _customer.billing.email, _customer.billing.street, _customer.billing.street2, _customer.billing.city, _customer.billing.state, _customer.billing.zipcode, _customer.shiptobilling]];
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
db.insert_green_inventory = (newInventoryForm) => {
    return new Promise((resolve, reject) => {
      let values = [[newInventoryForm.origin, newInventoryForm.reception_date, newInventoryForm.weight, newInventoryForm.cost_per_lb]];
      console.log('add to inventory ...');
      inventoryPool.query(`INSERT INTO Green_Inventory (origin, reception_date, weight, cost_per_lb) VALUES ?`, [values], (err, results) => {
          // console.log(results);
          if(err) {
            console.error(err);
            console.log(results);
            return results = {success:false, msg: 'Something wrong in entry', err: err};
          }
          return resolve(results);
      });
      // console.log('generate sku ...');
      inventoryPool.query(`UPDATE Green_Inventory SET sku = CONCAT(id,batch) WHERE sku = 'G0'`, (err, results) => {
        if(err) {
          console.error(err);
          console.log(results);
          return results = {success:false, msg: 'Something wrong in entry', err: err};
        }
        return resolve(results);
      });
   });
};
//insert beans as packaged - meaning already roasted and ready to ship
db.insert_packaged_inventory = (newPackagedForm) => {
    return new Promise((resolve, reject) => {
      let values = [[newPackagedForm.origin, newPackagedForm.weight, newPackagedForm.packaged_date, newPackagedForm.timestamp, newPackagedForm.roast_type]];
      // console.log('add to inventory ...');
      inventoryPool.query(`INSERT INTO Packaged_Inventory (origin, weight, packaged_date, timestamp, roast_type) VALUES ?`, [values], (err, results) => {
          // console.log(results);
          if(err) {
            console.error(err);
            console.log(results);
            return results = {success:false, msg: 'Something wrong in entry', err: err};
          }
          return resolve(results);
      });
      inventoryPool.query(`UPDATE Packaged_Inventory SET sku = CONCAT(id,batch) WHERE sku = 'P0'`, (err, results) => {
        if(err) {
          console.error(err);
          console.log(results);
          return results = {success:false, msg: 'Something wrong in entry', err: err};
        }
        return resolve(results);
      });
   });
};
//insert incoming merchandise
db.insert_merchandise_inventory = (newMerchandiseForm) => {
    return new Promise((resolve, reject) => {
      let values = [[newMerchandiseForm.sku,newMerchandiseForm.name,newMerchandiseForm.description,newMerchandiseForm.price,newMerchandiseForm.quantity,newMerchandiseForm.cost]];
      // console.log('add to inventory ...');
      inventoryPool.query(`INSERT INTO Merchandise_Inventory (sku, name, description, price, quantity, cost) VALUES ?`, [values], (err, results) => {
          // console.log(results);
          if(err) {
            console.error(err);
            console.log(results);
            return results = {success:false, msg: 'Something wrong in entry', err: err};
          }
          return resolve(results);
      });
   });
};
// add new PromoCode
db.add_promocode = (newPromocodeForm) => {
    console.log(newPromocodeForm);
    return new Promise((resolve, reject) => {
      let values = [[newPromocodeForm.new_code, newPromocodeForm.discount_rate, newPromocodeForm.limit_on_uses]];
      // console.log('add to inventory ...');
      promocodePool.query(`INSERT INTO PromoCodeTally (promo_code, discount_rate, limit_on_uses) VALUES ?`, [values], (err, results) => {
          if(err) {
            console.error(err);
            console.log(results);
            return results = {success:false, msg: 'Something wrong in entry', err: err};
          }
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
db.update_inventory_after_purchase = (_cart) => {
    console.log(_cart);
    _cart.forEach((element) => {
     var $sku = element.sku;
     var db_code = $sku.split('');
     db_code = db_code[0];
     var $quantity = element.quantity;
     var $table = '';
     if(db_code==='G'){
       $table='Green_Inventory';
     }else if (db_code==='P'){
       $table='Packaged_Inventory';
     }else if (db_code==='M'){
       $table='Merchandise_Inventory';
     }
     $timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
     return new Promise((resolve, reject) => {
        inventoryPool.query("UPDATE " + $table + " SET weight=weight-" + $quantity + ", timestamp='" + $timestamp + "' WHERE sku='" + $sku + "';", (err, results) => {
          if(err) {
            console.log(err);
            return reject(err);
          }
          console.log("Inventory Update: ", results);
          return resolve(results);
        });
     })
  });
};
//Tally Promocode Usage after purchase
db.tally_promo_code = (_discountamount, _promocode) => {
    return new Promise((resolve, reject) => {
      promocodePool.query("UPDATE PromoCodeTally SET uses=uses+1, total_amount_discounted=total_amount_discounted+'" + _discountamount + "' WHERE promo_code='" + _promocode + "';", (err, results) => { //WHERE weight > 0
          if(err) {
            console.log(err);
            return reject(err);
          }
          console.log("Promocode Tallied: ", results);
          return resolve(results);
      });
  });
};
// Set A trigger in MYSQL
// DELIMITER |
// CREATE TRIGGER `packaged_sku_trigger` BEFORE INSERT ON `Packaged_Inventory`
// FOR EACH ROW
// BEGIN
//   SET NEW.sku = CONCAT(NEW.id, NEW.batch);
// END |
// DELIMITER;
module.exports = db;
