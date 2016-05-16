<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	 See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Main class for search block
 * @package	   block_search
 * @author Le Xuan Anh VERSION2 Inc
 */

namespace app;

class LessonQuestions {

    public $display;
    public $blockName = 'local_lesson';

    public function __construct() {
        global $CFG;
        //TODO: Autoloader would be nice here
        require_once __DIR__ . '/Display.php';
        $this->display = new Display($this);        
    }

    /**
     * Returns the version number of the plugin, from the version.php file
     *
     * As far as I can see there's no variable or constant that contains this already
     * so it includes the version.php file to read the version number from it.
     */
    public function version() {
        if (isset($this->version)) {
            return $this->version;
        }
        $plugin = new \stdClass;
        include dirname(__DIR__) . '/version.php';
        $this->version = $plugin->version;
        return $this->version;
    }

}
