var express = require('express');
var router = express.Router();
const md5 = require('md5');
module.exports = router;
const out_req = require('request');


/* GET home page. */
router.get('/app_api', function (req, res, next) {
    //res.render('index', { title: 'ACI INSTITUTE' });
});

function getPostPackage() {
    return {
        "api_key": "chrisyao4700",
        "version_code": "public.web.1.001"
    };
}

router.post('/demo_course', function (req, res, next) {
    var dict = {};
    var package = getPostPackage();
    package.service_code = "demo_course";
    package.data_pack = {
        "campus_id": "1"
    };
    dict.json = package;
    out_req.post("https://chrisyao4700.com/aci_hacienda/aci_hacienda_api.php", dict, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(response.body);
        }
    });
});

router.post('/login', function (req, res, next) {
    var dict = {};
    var package = getPostPackage();
    package.service_code = "admin_logon";
    package.data_pack = req.body;
    dict.json = package;

    out_req.post("https://chrisyao4700.com/aci_hacienda/aci_hacienda_api.php", dict, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //res.send(response.body);

            if (response.body.status === true) {
                var loggedUser = response.body.user;
                res.cookie(
                    'user_id',
                    loggedUser.id,
                    {
                        maxAge: 50000,
                        httpOnly: true
                    }
                );
            }

        }
    });
});


router.post('/app_api', function (req, res, next) {
    //res.render('index', { title: 'ACI INSTITUTE' });
    var res_data = {
        status: false,
        message: 'DEFAULT REQUEST ROOT'
    };
    var api_key_success = function (result, fields) {
        if (result.count == 1) {
            if (result[0].result_count == 1) {
                if (req.body.version_code) {
                    checkVersionCode(req.body, version_code_success, version_code_fail);
                } else {
                    request_fail('VERSION CODE MISSED');
                }
            } else {
                api_key_fail('API KEY SELECTION COUNT ERROR');
            }
        } else {
            api_key_fail('API KEY RESULT COUNT ERROR');
        }
    };
    var api_key_fail = function (err) {
        request_fail(err);
    };

    var request_fail = function (err) {
        res_data.message = err;
        res.send(res_data);
    };
    var request_finish = function (data) {
        res_data = data;
        res.send(res_data);
    };

    var version_code_success = function (result, fields) {
        if (result.count == 1) {
            if (result[0].result_count == 1) {

                if (req.body.service_code === 'admin_login') {
                    appAdminLogin(req.body.data_pack, request_finish);
                }


            } else {
                version_code_fail('VERSION CODE SELECTION COUNT ERROR');
            }
        } else {
            version_code_fail('VERSION CODE RESULT COUNT ERROR');
        }
    };
    var version_code_fail = function (err) {
        request_fail(err);
    };


    if (req.body.api_key) {
        checkAPI(req.body, api_key_success, api_key_fail);
    } else {
        request_fail('API KEY MISSED');
    }
});

function appAdminLogin(datapack, finish) {

    var pass;

    if (datapack.type === 'RAW') {
        pass = datapack.password;
    } else {
        pass = md5(datapack.password);
    }

    var query = "SELECT * FROM `aci_users` " +
        "WHERE `user_category_id` IN (0,1,2) " +
        "AND `user_status_id` != 0 " +
        "AND `username` = '" + datapack.username + "' " +
        "AND `password` = '" + pass + "' ";

    var request_fail = function (err, query) {

        if (finish) {
            var data = {
                status: false,
                message: err,
                query: query
            };
            finish(data);
        }
    };
    selectRecordsWithQuery(query, function (result, fields) {

        if (result.count == 1) {
            if (finish) {
                var data = {
                    status: true,
                    message: 'USER FOUND'
                };
                finish(data);
            }

        } else {
            request_fail('USERNAME/PASSWORD NOT MATCH');
        }

    }, function (err) {
        request_fail(err, query);
    })


}


function checkAPI(datapack, success, fail) {
    var query = "SELECT COUNT(`id`) AS `result_count` FROM `aci_app_info` " +
        "WHERE `aci_app_info`.`status` != 0 " +
        "AND `aci_app_info`.`key` = 'api_key' " +
        "AND `aci_app_info`.`value` = '" + md5(datapack.api_key + '.jielu') + "'";
    selectRecordsWithQuery(query, function (result, fields) {
        //console.log(result + fields.toString());
        if (success) {
            success(result, fields);
        }

    }, function (err) {
        if (fail) {
            fail(err);
        }
    });


}

function checkVersionCode(datapack, success, fail) {
    var query = "SELECT COUNT(`id`) AS `result_count` FROM `aci_app_info` " +
        "WHERE `aci_app_info`.`status` != 0 " +
        "AND `aci_app_info`.`key` = 'version_code' " +
        "AND `aci_app_info`.`value` = '" + datapack.version_code + "'";
    selectRecordsWithQuery(query, function (result, fields) {
        //console.log(result + fields.toString());
        if (success) {
            success(result, fields);
        }
    }, function (err) {
        if (fail) {
            fail(err);
        }
    });

}

function selectRecordsWithQuery(query, success, fail) {
    pool.query(query, function (err, result, fields) {
        if (err) {
            if (fail) {
                fail(err);
            }
        } else {
            if (success) {
                success(result, fields);
            }
        }
    });
}

const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "69.195.124.95",
    user: "chrisyao_aci_api",
    password: "6fC2]wZq%(6a",
    database: "chrisyao_aci_hacienda"
});

