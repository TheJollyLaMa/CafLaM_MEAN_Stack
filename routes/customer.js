const express = require('express');
const db = require('../db');
const passport = require('passport');
const jwt = require('jsonwebtoken');

var router = express.Router();

/* --- Post New Customer --- */

router.post('/add', async (req, res, next) => {
    // console.log(req.body);
    res.json({
      msg: 'Posted New Customer',
      res: await db.add_customer(req.body)
    });
});

module.exports = router;
