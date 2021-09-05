const express = require('express');
const db = require('../db');

var router = express.Router();

/* GET promocodes */
router.get('/', async (req, res, next) => {
  try {
    res.json({Promocodes: await db.get_promocodes()});
  }
   catch(e) {console.log(e);res.sendStatus(500);}
});
module.exports = router;
