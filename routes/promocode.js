const express = require('express');
const db = require('../db');

var router = express.Router();

/* GET promocodes */
router.get('/', async (req, res, next) => {
    res.json({Promocodes: await db.get_promocodes()});
});
/* Check promocode */
router.get('/check/:promocode', async (req, res, next) => {
  console.log(req.params.promocode);
    res.json({promocode: await db.check_promocode(req.params.promocode)});
});
/* POST new PromoCodes */
router.post('/', async (req, res, next) => {
    console.log(req.body);
    res.json({msg: 'Posted New Promocode',
              res: await db.add_promocode(req.body)
   });
});
/* Tally Promocode after purchase is called from checkout route and therefore does not need its own route */
/* The function is in db/index.js */


/* Update details of Promotional Code */

// router.put('/', async (req, res, next) => {
//
//     let result = await db.tally_promo_code();
//     res.json(result);
//   } catch(e) {
//     console.log(e);
//     res.sendStatus(500);
//   }
// });



/* Delete test promocode */
router.post('/Delete', async (req, res, next) => {
    res.json({msg: 'Deleted Test Promocode', res: await db.delete_test_promocode()});
});
module.exports = router;
