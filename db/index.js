const mysql = require('mysql2');
var moment = require('moment');
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

let db = {};
// get Users
db.get_employee_list = () => {
    return new Promise((resolve, reject) => {
        userPool.query(`SELECT * FROM Auth`, (err, results) => {
            if(err) {
              return reject(err);
            }
            return resolve(results);
        });
    });
};
// get Green_Inventory
db.get_green_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Green_Inventory`, (err, results) => {
            if(err) {
              return reject(err);
            }
            return resolve(results);
        });
    });
};
// get Packaged_Inventory
db.get_packaged_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Packaged_Inventory`, (err, results) => { //WHERE weight > 0
            if(err) {
              return reject(err);
            }
            return resolve(results);
        });
    });
};
// get Discounted_Inventory
db.get_discounted_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Packaged_Inventory WHERE packaged_date <= ?`, [discountdate], (err, results) => {
            if(err) {
              return reject(err);
            }
            return resolve(results);
        });
    });
};
// get Merch Inventory
db.get_merchandise_inventory = () => {
    return new Promise((resolve, reject) => {
        inventoryPool.query(`SELECT * FROM Merchandise_Inventory`, (err, results) => { //WHERE weight > 0
            if(err) {
              return reject(err);
            }
            return resolve(results);
        });
    });
};
// get Promocodes
db.get_promocodes = () => {
    return new Promise((resolve, reject) => {
        promocodePool.query(`SELECT * FROM PromoCodeTally`, (err, results) => { //WHERE weight > 0
            if(err) {
              return reject(err);
            }
            return resolve(results);
        });
    });
};
//insert incoming green beans
db.insert_green_inventory = (_origin, _reception_date, _weight) => {
    return new Promise((resolve, reject) => {
      let values = [[_origin, _reception_date, _weight]];
      // console.log('add to inventory ...');
      inventoryPool.query(`INSERT INTO Green_Inventory (origin, reception_date, weight) VALUES ?`, [values], (err, results) => {
          if(err) {
            return reject(err);
          }
          // console.log(results);
          return resolve(results);
      });
      // console.log('generate sku ...');
      inventoryPool.query(`UPDATE Green_Inventory SET sku = CONCAT(id,batch) WHERE sku = 'G0'`, (err, results) => {
        if(err) {

          return reject(err);
        }
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
          if(err) {
            return reject(err);
          }
          // console.log(results);
          return resolve(results);
      });
      inventoryPool.query(`UPDATE Packaged_Inventory SET sku = CONCAT(id,batch) WHERE sku = 'P0'`, (err, results) => {
        if(err) {

          return reject(err);
        }
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
          if(err) {
            return reject(err);
          }
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
          if(err) {
            return reject(err);
          }
          return resolve(results);
      });
   });
};
db.delete_test_packaged_inventory = () => {
    return new Promise((resolve, reject) => {
      console.log('delete test from inventory ...');
      inventoryPool.query(`DELETE FROM Packaged_Inventory WHERE origin = 'jest test'`, (err, results) => {
          if(err) {
            return reject(err);
          }
          return resolve(results);
      });
   });
};
db.delete_test_merchandise_inventory = () => {
    return new Promise((resolve, reject) => {
      // console.log('delete test from inventory ...');
      inventoryPool.query(`DELETE FROM Merchandise_Inventory WHERE sku = 'M0test'`, (err, results) => {
          if(err) {
            return reject(err);
          }
          return resolve(results);
      });
   });
};
//register beans as roasted and packaged
// dB.insert_packaged_inventory = (_origin, _weight, _packaged_date, _roast_type) => {
//     return new Promise((resolve, reject) => {
//       let values = [[_origin, _weight, _packaged_date, _roast_type]];
//       console.log(values);
//       inventoryPool.query(`INSERT INTO Packaged_Inventory (origin, weight, packaged_date, roast_type) VALUES ?`, [values], (err, results) => {
//           if(err) {
//             return reject(err);
//           }
//           console.log(results);
//           return resolve(results);
//       });
//       let updvalues = [_weight, [_origin], _reception_date];
//       inventoryPool.query(`UPDATE Green_Inventory SET weight = weight-?, timestamp = ? WHERE origin = ? AND weight > 0 ORDER BY reception_date ASC LIMIT 1`, updvalues, (err, results) => {
//         if(err) {
//
//           return reject(err);
//         }
//         return resolve(results);
//       });
//     })
// };
// //insert merchandise into inventory
// dB.insert_merhcandise_inventory = (_sku, _name, _description, _price, _quantity, _cost) => {
//     return new Promise((resolve, reject) => {
//       let values = [[_sku, _name, _description, _price, _quantity, _cost]];
//       console.log(values);
//       inventoryPool.query(`INSERT INTO Merchandise_Inventory (sku, name, description, price, quantity, cost) VALUES ?`, [values], (err, results) => {
//           if(err) {
//             return reject(err);
//           }
//           console.log(results);
//           return resolve(results);
//       });
//       let updvalues = [_weight, [_origin], _reception_date];
//       inventoryPool.query(`UPDATE Green_Inventory SET weight = weight-?, timestamp = ? WHERE origin = ? AND weight > 0 ORDER BY reception_date ASC LIMIT 1`, updvalues, (err, results) => {
//         if(err) {
//
//           return reject(err);
//         }
//         return resolve(results);
//       });
//     })
// };
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
