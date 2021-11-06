const express = require('express');
const db = require('../db');

var router = express.Router();

router.all('/treasure_chest/:sym/:file', async function (req, res, next) {
  // console.log(req);
  var fileName = req.params.file;
  var filePath = __dirname + '/treasure_chest/' + req.params.sym + '/';
  console.log(filePath + fileName);
  res.sendFile(fileName, {root: filePath});
  // res.send('This would call the contract to see all the Alms in creation');
});

module.exports = router;
