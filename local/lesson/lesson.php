<?php

/**
 * Get All Course
 *
 * @author Le Xuan Anh Version2
 */
require_once(dirname(__FILE__) . '/../../config.php');
require_once($CFG->dirroot . '/mod/lesson/locallib.php');
require_once($CFG->libdir . '/questionlib.php');
require_once __DIR__ . '/app/LessonQuestions.php';
global $CFG, $USER, $DB;
$lessonQuestions = new app\LessonQuestions();

/*
 * Get Data
 */
$lessonId = required_param('id', PARAM_INT);
$pageid = required_param('pageid', PARAM_INT);

$cm = get_coursemodule_from_id('lesson', $lessonId, 0, false, MUST_EXIST);
$course = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
$lesson = new lesson($DB->get_record('lesson', array('id' => $cm->instance), '*', MUST_EXIST));

/// Header
$PAGE->set_url('/local/lesson/lesson.php');
$PAGE->set_title(get_string('addfromquestionbank', $lessonQuestions->blockName));
$PAGE->set_heading($course->fullname);
$PAGE->navbar->add(get_string('pluginname', $lessonQuestions->blockName));
$PAGE->set_pagelayout('course');

echo $OUTPUT->header();
echo $OUTPUT->heading(format_string($lesson->name), 2);

if ($lessonQuestions->display->isAdmin()) {
    $courses = get_courses();
} else {
    $courses = enrol_get_all_users_courses($USER->id);
}

echo '<p>' . get_string('choosecoursenotice', $lessonQuestions->blockName) . '</p>';

foreach ($courses as $course) {
    if ($course->id != 1) {
        $exportQuestionBank = new \moodle_url('/local/lesson/question_bank_export.php', array(
            'courseid' => $course->id
        ));

        $courseid = $course->id;

        /**
         * Get Default Category in Course
         */
        $thiscontext = context_course::instance($courseid);
        if ($thiscontext) {
            $contexts = new question_edit_contexts($thiscontext);
            $contexts->require_one_edit_tab_cap('export');
        } else {
            $contexts = null;
        }
        $defaultcategory = question_make_default_categories($contexts->all());
        $category = $defaultcategory;
        $cat = "{$category->id},{$category->contextid}";

        /**
         * Link Get Question Bank in Course
         */
        $questionTable = get_string('question', 'local_lesson');
        echo '<h3 class="coursename coursename-lesson-qb" data-lesson-id="' . $lessonId . '" data-pageid="' . $pageid . '"
                data-export="' . $exportQuestionBank . '" data-course="' . $course->id . '" data-cm="' . $cm->id . '"
                data-lang-question-table="' . $questionTable . '" data-cat="' . $cat . '" data-sesskey="' . $USER->sesskey . '">'
            . $course->shortname .
            '</h3>';
    }
}

$backLink = new \moodle_url('/mod/lesson/view.php', array(
    'id' => $lessonId
));
echo '<a class="back-to-lesson" href="'.$backLink.'">' . get_string('backtolesson', 'local_lesson') . '</a>';

/**
 * Add Js to page
 */
$jsmodule = array(
    'name' => 'local_lesson',
    'fullpath' => '/local/lesson/lesson.js',
    'requires' => array('panel', 'datatable-base', 'dd-plugin', 'node', 'io', 'dump', 'json-parse'));
// -- end
$PAGE->requires->js_init_call('M.local_lesson.init', array(), false, $jsmodule);

/**
 * Popup Question
 */
echo '<div id="light" class="white_content display-none">
        <div class="header-popup">' . get_string('addquestionfrombank', 'local_lesson') . '
            <span>
                <button class="closebutton" title="Close"></button>
            </span>
        </div>
        <div class="content-popup">
            <table id="categoryquestions" class="list-question-bank"></table>
        </div>
    </div>
    <div id="fade" class="black_overlay display-none"></div>';

echo $OUTPUT->footer();
