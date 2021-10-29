const express = require('express');
const db = require('../db');

var router = express.Router();
  /* --- GET Inventory --- */

// Get all inventory
router.get('/', async (req, res, next) => {
  res.json({
    greenInventory: await db.get_green_inventory(),
    packagedInventory: await db.get_packaged_inventory(),
    discountedInventory: await db.get_discounted_inventory(),
    merchandiseInventory: await db.get_merchandise_inventory()
  });
});
//Get Green Inventory
router.get('/Green', async (req, res, next) => {
  res.json({greenInventory: await db.get_green_inventory()});
});
//Get Packaged Inventory
router.get('/Packaged', async (req, res, next) => {
  res.json({packagedInventory: await db.get_packaged_inventory()});
});
//Get discounted Inventory
router.get('/Discounted', async (req, res, next) => {
  res.json({discountedInventory: await db.get_discounted_inventory()});
});
//Get Merchandise Inventory
router.get('/Merchandise', async (req, res, next) => {
  res.json({merchandiseInventory: await db.get_merchandise_inventory()});
});


  /* --- POST New Inventory --- */

// Post new Green Inventory
router.post('/Green', async (req, res, next) => {
    res.json({msg: 'Posted New Green Inventory',inv_insert_res: await db.insert_green_inventory(req.body)});
});
// Post new Packaged Inventory
router.post('/Packaged', async (req, res, next) => {
    res.json({msg: 'Posted New Packaged Inventory',inv_insert_res: await db.insert_packaged_inventory(req.body)});
});
// Post new Merchandise Inventory
router.post('/Merchandise', async (req, res, next) => {
    res.json({msg: 'Posted New Merchandise Inventory', inv_insert_res: await db.insert_merchandise_inventory(req.body)});
});


// Delete Tests
router.post('/Green/Delete', async (req, res, next) => {
    res.json({msg: 'Deleted Test Green Inventory', inv_insert_res: await db.delete_test_green_inventory()});
});
router.post('/Packaged/Delete', async (req, res, next) => {
    res.json({msg: 'Deleted Test Packaged Inventory', inv_insert_res: await db.delete_test_packaged_inventory()});
});
router.post('/Merchandise/Delete', async (req, res, next) => {
    res.json({msg: 'Deleted Test Merchandise Inventory', inv_insert_res: await db.delete_test_merchandise_inventory()});
});


module.exports = router;
