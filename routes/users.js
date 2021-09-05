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
// Post New Employee
router.post('/:username/:password', async (req, res, next) => {
  try {
    // console.log(req.params.origin);
    res.json({msg: 'Posted New Employee',
              res: await db.add_employee(req.params.username, req.params.password)
   });
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
/* Delete test Employee*/
router.post('/Delete', async (req, res, next) => {
  try {
    // console.log(req.params.origin);
    res.json({msg: 'Deleted Test Employee', res: await db.delete_test_employee()});
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});
module.exports = router;
