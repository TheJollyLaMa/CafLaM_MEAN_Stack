const express = require('express');
const db = require('../db');

var router = express.Router();

/* GET promocodes */
router.get('/', async (req, res, next) => {
    res.json({Promocodes: await db.get_promocodes()});
});
/* POST new PromoCodes */
router.post('/:promo_code/:discount_rate/:uses/:total_amount_discounted/:limit_on_uses', async (req, res, next) => {
    res.json({msg: 'Posted New Promocode',
              res: await db.add_promocode(req.params.promo_code, req.params.discount_rate, req.params.uses, req.params.total_amount_discounted, req.params.limit_on_uses)
   });
});
/* Delete test promocode */
router.post('/Delete', async (req, res, next) => {
    res.json({msg: 'Deleted Test Promocode', res: await db.delete_test_promocode()});
});
module.exports = router;
