const express = require('express');
const db = require('../db');

var router = express.Router();
router.use('/', express.static('public'));
/* Open all public routes with a #! */
router.all('/', function (req, res, next) {
  var file = 'public/index.html';
  res.sendFile(file, '/#!/', function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', file);
            next();
        }
    });
});

module.exports = router;
