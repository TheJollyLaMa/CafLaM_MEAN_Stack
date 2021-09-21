const express = require('express');
const request = require('request');

// const smarthome = require('../db/smarthome');

var router = express.Router();

//Get Power Data from Smarthome
router.get('/powerData', (req, res) => {
      request({ url: 'http://192.168.0.208/data/get' }, (error, response, body) => {
        // console.log(error);
        if (error || response.statusCode !== 200) {
          // console.log(err.message);
          return res.status(500).json({ type: 'error', message: error });
        }
        res.json(JSON.parse(body));
      })
  });



module.exports = router;
