var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('courses', {
        title: 'ACI INSTITUTE',
        pageName: 'courses'
    });
});


module.exports = router;
