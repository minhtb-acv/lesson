/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 * @author AnhLX Ver2
 */
M.local_lesson = {
    Y: null,
    transaction: [],
    init: function (Y, params) {
        this.Y = Y;
        /**
         * Event when click every Course
         */
        var flag = true;
        Y.all('.coursename-lesson-qb').each(function (node) {
            node.on('click', function (e) {
                if (flag) {
                    flag = false;
                    e.preventDefault();
                    var url = node.getAttribute("data-export");
                    var courseId = node.getAttribute("data-course");
                    var sessKey = node.getAttribute("data-sesskey");
                    var cat = node.getAttribute("data-cat");

                    /**
                     * Data use be import to xml
                     */
                    var lessonId = node.getAttribute("data-lesson-id");
                    var pageId = node.getAttribute("data-pageid");
                    var cmId = node.getAttribute("data-cm");

                    /**
                     * Languages
                     */
                    var questionTableLang = node.getAttribute("data-lang-question-table");

                    Y.on('domready', function () {
                        /**
                         * Post data and get link
                         */
                        Y.io(url, {
                            method: "POST",
                            data: {
                                courseid: courseId,
                                cat: cat,
                                sesskey: sessKey,
                                _qf__question_export_form: 1,
                                mform_isexpanded_id_fileformat: 1,
                                mform_isexpanded_id_general: 1,
                                format: 'xml',
                                category: cat,
                                cattofile: 1,
                                contexttofile: 1,
                                submitbutton: 'Export questions to file'
                            },
                            on: {
                                success: function (x, o) {
                                    try {
                                        // Parse the JSON data so we can use it in a string.
                                        var d = Y.JSON.parse(o.responseText);
                                    } catch (e) {
                                        // This is what happens if the request fails.
                                        console.log("JSON Parse failed!");
                                        flag = true;
                                        return;
                                    }

                                    /**
                                     * Add question in Question Bank
                                     */
                                        //Y.on('domready', function() {
                                    Y.io(d.urlAjax, {
                                        on: {
                                            success: function (x, o) {
                                                try {
                                                    // Parse the JSON data so we can use it in a string.
                                                    var result = Y.JSON.parse(o.responseText);
                                                    if (result.error == 1) {
                                                        alert(result.data);
                                                        flag = true;
                                                    } else {
                                                        var html = '', i, l;
                                                        html += '<tbody class="content-header">';
                                                        html += '<tr>';
                                                        html += '<td class="checkbox"><input class="checkbox-all-question" title="Select" type="checkbox" name="checkallquestions"></td>';
                                                        html += '<td class="questionnametext qtext-header">'+ questionTableLang +'</td>';
                                                        html += '<td class="iconcol previewaction"></td>';
                                                        html += '</tr>';
                                                        html += '</tbody>';
                                                        html += '<tbody class="content-list">';

                                                        for (i = 0, l = result.length; i < l; ++i) {
                                                            html += '<tr>';
                                                            html += '<td class="checkbox">';
                                                            html += '<input class="checkbox-question" title="Select" type="checkbox" name="q' + result[i].questionId + '" id="checkq' + result[i].questionId + '" value="' + result[i].questionId + '">';
                                                            html += '</td>';
                                                            html += '<td class="questionnametext">';
                                                            html += '<label for="checkq' + result[i].questionId + '">';
                                                            html += '<span class="questionname">' + result[i].questionName + '</span>';
                                                            html += '<span class="questiontext">' + result[i].questionText + '</span>';
                                                            html += '</label>';
                                                            html += '</td>';
                                                            html += '<td class="iconcol previewaction">';
                                                            html += '<span title="Preview" class="preview-question" data-href="' + d.urlRoot + '/question/preview.php?id=' + result[i].questionId + '&cmid=' + cmId + '">';
                                                            html += '<img class="iconsmall" alt="Preview" title="Preview" src="' + d.urlRoot + '/theme/image.php/clean/core/1452507578/t/preview">';
                                                            html += '</span>';
                                                            html += '</td>';
                                                            html += '</tr>';
                                                        }

                                                        html += '</tbody>';

                                                        //Add data to popup
                                                        var listQuestion = Y.one('.list-question-bank');
                                                        listQuestion.setHTML(html);
                                                        //Add Button
                                                        Y.one('.content-popup').append('<div class="add-to-lesson">レッスンに追加</div>');
                                                        flag = true;

                                                        /**
                                                         * Click to open new window (Preview)
                                                         */
                                                        Y.all('.preview-question').each(function (node) {
                                                            node.on('click', function (e) {
                                                                e.preventDefault();
                                                                var urlOpen = node.getAttribute("data-href");
                                                                window.open(urlOpen, '_blank', 'toolbar=0,location=0,menubar=0');
                                                            });
                                                        });

                                                        /**
                                                         * Show popup
                                                         */
                                                        var whiteContent = Y.one('#light');
                                                        var blackOverlay = Y.one('#fade');
                                                        whiteContent.removeClass('display-none');
                                                        blackOverlay.removeClass('display-none');

                                                        /**
                                                         * Hidden Popup and remove data in content popup
                                                         */
                                                        var closeButton = Y.one('.closebutton');
                                                        closeButton.on('click', function (e) {
                                                            e.preventDefault();
                                                            /**
                                                             * Close popup and remove element (tr, td, tbody, button)
                                                             */
                                                            whiteContent.addClass('display-none');
                                                            blackOverlay.addClass('display-none');
                                                            listQuestion.setHTML('');
                                                            Y.one('.add-to-lesson').remove();
                                                        });

                                                        Y.one('.checkbox-all-question').on('change', function () {
                                                            if (this.get("checked")) {
                                                                Y.all('.checkbox-question').each(function () {
                                                                    this.set('checked', true);
                                                                });
                                                            } else {
                                                                Y.all('.checkbox-question').each(function () {
                                                                    this.set('checked', false);
                                                                });
                                                            }
                                                        });

                                                        /**
                                                         * Add To Lesson
                                                         */
                                                        var flagAddToLesson = true;
                                                        var addButton = Y.one('.add-to-lesson');
                                                        addButton.on('click', function (e) {
                                                            if (flagAddToLesson) {
                                                                flagAddToLesson = false;
                                                                e.preventDefault();
                                                                var values = [];
                                                                Y.all('.checkbox-question').each(function () {
                                                                    if (this.get("checked")) {
                                                                        values.push(this.get('value'));
                                                                    }
                                                                });
                                                                var qlid = values.toString();
                                                                /**
                                                                 * Save to XML with selected question
                                                                 */
                                                                var urlSaveXML = d.urlAjax;
                                                                urlSaveXML = urlSaveXML.replace('saveXML=2', 'saveXML=1');
                                                                urlSaveXML = urlSaveXML.replace('lessonPopup=1', 'lessonPopup=2');
                                                                urlSaveXML = urlSaveXML + '&qlid=' + qlid;
                                                                Y.io(urlSaveXML, {
                                                                    on: {
                                                                        success: function (x, o) {
                                                                            try {
                                                                                var resultXml = Y.JSON.parse(o.responseText);
                                                                                if (resultXml.status != 1) {
                                                                                    flagAddToLesson = true;
                                                                                    return;
                                                                                }

                                                                                var urlImport = resultXml.urlImport;
                                                                                urlImport = urlImport + '?id=' + lessonId + '&pageid=' + pageId;
                                                                                var urlFile = resultXml.file;

                                                                                /**
                                                                                 * Ajax import xml data to lesson
                                                                                 */
                                                                                Y.io(urlImport, {
                                                                                    method: "POST",
                                                                                    data: {
                                                                                        id: lessonId,
                                                                                        pageid: pageId,
                                                                                        sesskey: sessKey,
                                                                                        _qf__lesson_import_form: 1,
                                                                                        format: 'xml',
                                                                                        file: urlFile,
                                                                                        submitbutton: 'Import'
                                                                                    },
                                                                                    on: {
                                                                                        success: function (x, o) {
                                                                                            try {
                                                                                                /**
                                                                                                 * Close popup and remove element (tr, td, tbody, button)
                                                                                                 */
                                                                                                whiteContent.addClass('display-none');
                                                                                                blackOverlay.addClass('display-none');
                                                                                                listQuestion.setHTML('');
                                                                                                Y.one('.add-to-lesson').remove();
                                                                                                flagAddToLesson = true;
                                                                                                /* MinhTB VERSION2 2016-05-13 */
                                                                                                var result = o.responseText.split('__v2__')[1];

                                                                                                if (result == 'success') {
                                                                                                    alert('レッスンに追加しました。');
                                                                                                } else {
                                                                                                    alert('レッスンモジュールに対応していない問題形式は追加できません');
                                                                                                }
                                                                                                /* END MinhTB VERSION2 2016-05-13 */
                                                                                            } catch (e) {
                                                                                                // This is what happens if the request fails.
                                                                                                console.log("JSON Parse failed!");
                                                                                                flagAddToLesson = true;
                                                                                                return;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                });
                                                                            } catch (e) {
                                                                                // This is what happens if the request fails.
                                                                                console.log("JSON Parse failed!");
                                                                                flagAddToLesson = true;
                                                                                return;
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                } catch (e) {
                                                    // This is what happens if the request fails.
                                                    console.log("JSON Parse failed!");
                                                    flag = true;
                                                    return;
                                                }
                                            }
                                        }
                                    });
                                    //});
                                }
                            }
                        });
                    });
                }
            });
        });
    },
};
