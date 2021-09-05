const express = require('express');
const db = require('../db');

var router = express.Router();
// Get all inventory
router.get('/', async (req, res, next) => {
  try {
    res.json({
      greenInventory: await db.get_green_inventory(),
      packagedInventory: await db.get_packaged_inventory(),
      discountedInventory: await db.get_discounted_inventory(),
      merchandiseInventory: await db.get_merchandise_inventory()
    });
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
//Get Green Inventory
router.get('/Green', async (req, res, next) => {
  try {res.json({greenInventory: await db.get_green_inventory()});}
   catch(e) {console.log(e);res.sendStatus(500);}
});
//Get Packaged Inventory
router.get('/Packaged', async (req, res, next) => {
  try {res.json({packagedInventory: await db.get_packaged_inventory()});}
   catch(e) {console.log(e);res.sendStatus(500);}
});
//Get discounted Inventory
router.get('/Discounted', async (req, res, next) => {
  try {res.json({discountedInventory: await db.get_discounted_inventory()});}
   catch(e) {console.log(e);res.sendStatus(500);}
});
//Get Merchandise Inventory
router.get('/Merchandise', async (req, res, next) => {
  try {res.json({merchandiseInventory: await db.get_merchandise_inventory()});}
   catch(e) {console.log(e);res.sendStatus(500);}
});
// Post new Green Inventory
router.post('/Green/:origin/:reception_date/:weight', async (req, res, next) => {
  try {
    // console.log(req.params.origin);
    res.json({msg: 'Posted New Green Inventory',
     inv_insert_res: await db.insert_green_inventory(req.params.origin, req.params.reception_date, req.params.weight)
   });
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
// Post new Packaged Inventory
router.post('/Packaged/:origin/:weight/:packaged_date/:timestamp/:roast_type', async (req, res, next) => {
  try {
    // console.log(req.params);
    res.json({msg: 'Posted New Packaged Inventory',
     inv_insert_res: await db.insert_packaged_inventory(req.params.origin, req.params.weight, req.params.packaged_date, req.params.timestamp, req.params.roast_type)
    });
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
// Post new Merchandise Inventory
router.post('/Merchandise/:sku/:name/:description/:price/:quantity/:cost', async (req, res, next) => {
  try {
    // console.log(req.params.origin);
    res.json({msg: 'Posted New Merchandise Inventory', inv_insert_res: await db.insert_merchandise_inventory(req.params.sku, req.params.name, req.params.description, req.params.price, req.params.quantity, req.params.cost)});
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.post('/Green/Delete', async (req, res, next) => {
  try {
    // console.log(req.params.origin);
    res.json({msg: 'Deleted Test Green Inventory', inv_insert_res: await db.delete_test_green_inventory()});
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.post('/Packaged/Delete', async (req, res, next) => {
  try {
    // console.log(req.params.origin);
    res.json({msg: 'Deleted Test Packaged Inventory', inv_insert_res: await db.delete_test_packaged_inventory()});
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.post('/Merchandise/Delete', async (req, res, next) => {
  try {
    // console.log(req.params.origin);
    res.json({msg: 'Deleted Test Merchandise Inventory', inv_insert_res: await db.delete_test_merchandise_inventory()});
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Update Inventory after purchase
// router.put('/inventory', async (req, res, next) => {
//
//   try {
//     let result = await db.update_inventory_after_purchase();
//     res.json(result);
//   } catch(e) {
//     console.log(e);
//     res.sendStatus(500);
//   }
// });

// });


module.exports = router;
