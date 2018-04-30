function check_testimonial() {
    $('html, body').animate({
        scrollTop: $("#fh5co-testimonial").offset().top
    }, 2000);
}

function check_course_demo() {

    loadCourseDemo(function () {
        show_course();
    });
    // if ($('#fh5co-project').getPropertyValue('display') === 'none') {
    //     loadCourseDemo();
    // } else {
    //     move_to_course();
    // }
}

function check_instructor() {
    $('html, body').animate({
        scrollTop: $("#instructor-broad").offset().top
    }, 2000);

}

function show_course() {
    $('div#fh5co-project').fadeIn(200, function () {
        move_to_course();
    });
}

function move_to_course() {
    $('html, body').animate({
        scrollTop: $('#fh5co-project').offset().top
    }, 2000);
}

function loadCourseDemo(finish) {
    $.post("/app_api/demo_course", {}
        , function (data, status) {

            if (data.status !== true) {
                console.log(data.message);
                //Then Do Nothing.

            } else {
                var code = '';
                var count = 0;
                data.records.forEach(function (t) {
                    var course_code = "<div class=\"col-md-4 col-sm-6 fh5co-project\">" +
                        "                <a href=\"#\"><img src=\"images/courseImage/course_" + count + ".png\"" +
                        " alt=\"Course\"\n" +
                        "                                 class=\"img-responsive\">\n" +
                        "                    <h3>" + t.class_name + " " + t.class_number + " " + t.subject_description + "</h3>\n" +
                        "                    <span>View Course</span>\n" +
                        "                </a>\n" +
                        "            </div>";
                    code += course_code;
                    count++;
                });


                $('div#course-broad-display-row').html(code);
                if(finish){
                    finish();
                }
            }
        });
}

function popupTawk() {
    Tawk_API.toggle();
}
(function () {
    loadCourseDemo(function () {
        $('div#fh5co-project').fadeIn(200);
    });
})();