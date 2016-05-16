<?php

/**
 * @package local_lesson
 * @author Le Xuan Anh VERSION2 Inc
 */

namespace app;

class Display {

    private $block;

    public function __construct(\app\LessonQuestions $block) {
        $this->block = $block;
    }

    /**
     * Get All Lesson
     */
    public function listLesson() {
        global $DB;
        $sql = "SELECT m.id, m.name
                FROM {course_modules} cm
                   JOIN {modules} md ON md.id = cm.module
                   JOIN {lesson} m ON m.id = cm.instance
             WHERE md.name = 'lesson'";
        
        return $DB->get_records_sql_menu($sql);
    }
    
    /**
     * Get Course Module
     */
    public function getCourseModuleLesson($lessonId) {
        global $DB;
        $sql = "SELECT cm.id
                FROM {course_modules} cm
                   JOIN {modules} md ON md.id = cm.module
                   JOIN {lesson} m ON m.id = cm.instance
             WHERE md.name = 'lesson' AND m.id = $lessonId";
        
        return $DB->get_record_sql($sql);
    }

    /**
     * Checking user permissions in Moodle
     * @return bool
     */
    public function isAdmin() {
        global $USER;
        $admins = get_admins();
        $isadmin = false;
        foreach ($admins as $admin) {
            if ($USER->id == $admin->id) {
                $isadmin = true;
            }
        }
        return $isadmin;
    }

    /**
     * Debug
     */
    public function debug($a) {
        echo '<pre style="text-align: left;font-size: 14;">';
        $trace = debug_backtrace();
        echo 'Line: ' . $trace[0]['line'] . '<br>';
        print_r($a);
        echo '</pre>';
    }

}
