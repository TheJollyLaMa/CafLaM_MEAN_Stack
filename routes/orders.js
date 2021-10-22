const express = require('express');
const db = require('../db');

var router = express.Router();

/* GET All orders */
router.get('/', async (req, res, next) => {
    res.json({order_list: await db.get_orders_list()});
});
/* POST new order */
// no need for route.  Post function called via: /checkout --> callback(success) --> db/index.js post_new_order()
// router.post('/Create/:id/:buyer/:email/:payment_status/:total/:cart', async (req, res, next) => {
//     res.json({msg: 'Posted New Order',
//         res: await db.post_new_order(req.params.id, req.params.buyer, req.params.email, req.params.payment_status, req.params.total, req.params.cart)
//     });
// });
/* Update order */
// don't need it - just cancel and put in new, or just put in new to add anything - it's really not worth the trouble of an "update" function
// router.put('/Create/:id/:buyer/:email/:payment_status/:total/:cart', async (req, res, next) => {
//     res.json({msg: 'Posted New Order',
//         res: await db.update_order(req.params.id, req.params.buyer, req.params.email, req.params.payment_status, req.params.total, req.params.cart)
//     });
// });
module.exports = router;
