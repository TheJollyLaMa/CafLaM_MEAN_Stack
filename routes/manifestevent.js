const express = require('express');
const db = require('../db');

var router = express.Router();
router.post('/token_manifest_event', async function (req, res, next) {
  const token = req.body;
  // console.log(JSON.stringify(token));
  const filePath = path.join(__dirname, '/treasure_chest/', token._esym, '/');
  if (!fs.existsSync(filePath)){fs.mkdirSync(filePath);}
  const fileName =  token._id + '.json';
  console.log(filePath + fileName);
  fs.writeFile(filePath + fileName, JSON.stringify(token), { flag: 'w+' }, () => {
    console.log('token written to file: ' + filePath + fileName);
  });
  res.json(token);


});
module.exports = router;
