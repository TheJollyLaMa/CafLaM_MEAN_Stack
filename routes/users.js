const express = require('express');
const db = require('../db');

var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    res.json({Employees: await db.get_employee_list()});
  }
   catch(e) {console.log(e);res.sendStatus(500);}
});

module.exports = router;
