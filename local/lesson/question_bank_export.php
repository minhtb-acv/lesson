<?php
/**
 * Question Bank Export Page
 *
 * Le Xuan Anh Version2
 */

require_once(dirname(__FILE__) . '/../../config.php');
//require_once($CFG->dirroot . '/question/export.php');

require_once($CFG->dirroot . '/question/editlib.php');
require_once($CFG->dirroot . '/question/export_form.php');
require_once($CFG->dirroot . '/question/format.php');

list($thispageurl, $contexts, $cmid, $cm, $module, $pagevars) =
    question_edit_setup('export', '/blocks/lesson_questions/question_bank_export.php');

// get display strings
$strexportquestions = get_string('exportquestions', 'question');

list($catid, $catcontext) = explode(',', $pagevars['cat']);
$category = $DB->get_record('question_categories', array("id" => $catid, 'contextid' => $catcontext), '*', MUST_EXIST);

$export_form = new question_export_form($thispageurl,
    array('contexts' => $contexts->having_one_edit_tab_cap('export'), 'defaultcategory' => $pagevars['cat']));


if ($from_form = $export_form->get_data()) {
    $thiscontext = $contexts->lowest();
    /**
     * Edit link format.php from format/ to ../../question/format/
     */
    if (!is_readable("../../question/format/{$from_form->format}/format.php")) {
        print_error('unknowformat', '', '', $from_form->format);
    }
    //--
    $withcategories = 'nocategories';
    if (!empty($from_form->cattofile)) {
        $withcategories = 'withcategories';
    }
    $withcontexts = 'nocontexts';
    if (!empty($from_form->contexttofile)) {
        $withcontexts = 'withcontexts';
    }

    $classname = 'qformat_' . $from_form->format;
    $qformat = new $classname();
    $filename = question_default_export_filename($COURSE, $category) .
        $qformat->export_file_extension();
    $export_url = question_make_export_url($thiscontext->id, $category->id,
        $from_form->format, $withcategories, $withcontexts, $filename);

    echo json_encode(array(
        'urlAjax' => $export_url->out(false).'&lessonPopup=1&saveXML=2',
        'urlRoot' => $CFG->wwwroot
        )
    );

    exit;
}
