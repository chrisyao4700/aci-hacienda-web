var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'ACI INSTITUTE' });
});


module.exports = router;
/**
 * Created by ChrisYao on 7/22/17.
 */
