const express = require('express');
const db = require('../db');

var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
    res.json({Employees: await db.get_employee_list()});
});
// Post New Employee
router.post('/:username/:password', async (req, res, next) => {
    res.json({msg: 'Posted New Employee',
              res: await db.add_employee(req.params.username, req.params.password)
   });
});
/* Delete test Employee*/
router.post('/Delete', async (req, res, next) => {
    res.json({msg: 'Deleted Test Employee', res: await db.delete_test_employee()});
});
module.exports = router;
