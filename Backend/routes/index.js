var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express está escuchando');
});


console.log('Servidor en funcionamiento, escuchando en el puerto 4000');

module.exports = router;

