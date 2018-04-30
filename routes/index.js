var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
/* GET home page. */


router.get('/', function (req, res, next) {


    var students = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..') + '/data/student/students.json', 'utf8'));
    var student_json = students.students;

    var teachers = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..') + '/data/teacher/teachers.json', 'utf8'));
    var teacher_json = teachers.teachers;

    var student_list = [];

    var renderPage = function () {
        res.render('index', {
            title: 'ACI HACIENDA',
            pageName: 'index',
            students: student_list,
            teachers: teacher_json
        });
    };

    for (var i = 0; i < student_json.length; i++) {
        readDetailTxt(i,path.resolve(__dirname, '..') + student_json[i].text_url, function (index, data) {

                student_list.push(
                    {
                        name: student_json[index].name,
                        content: data,
                        image: student_json[index].image_url,
                        description: student_json[index].description
                    }
                );

                if (student_json.length === student_list.length) {
                    renderPage();
                }
            },function (index, err) {
                student_list.push(
                    {
                        name: student_json[index].name,
                        content: 'NO CONTENT FOUND',
                        image: student_json[index].image_url,
                        description: student_json[index].description
                    }
                );
                console.log(err);
                if (student_json.length === student_list.length) {
                    renderPage();
                }
            }
        );
    }
});


function readDetailTxt(index, file_path, finishHandle, errorHandle) {
    fs.readFile(file_path, 'utf8', function (err, data) {
        if (err) {
            errorHandle(index, err);
        }
        if (finishHandle) {
            finishHandle(index, data);
        }
    });
}


module.exports = router;
