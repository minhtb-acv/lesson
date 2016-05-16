/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

M.local_lesson = {
    Y: null,
    transaction: [],
    init: function (Y, params) {
        this.Y = Y;
        var aID = params.split(',');

        var del = new Y.DD.Delegate({
            container: '#dragdrop-lesson',
            nodes: 'li'
        });

        del.on('drag:start', function (e) {
            e.target.get('node').setStyle('opacity', '.5');
        });
        del.on('drag:end', function (e) {
            e.target.get('node').setStyle('opacity', '1');
        });

        del.dd.plug(Y.Plugin.DDConstrained, {
            constrain2node: '#play'
        });

        del.dd.plug(Y.Plugin.DDProxy, {
            moveOnEnd: false,
            cloneNode: true
        });

        Y.Array.each(aID, function (id) {
            var dropId = Y.one('#drop-' + id).plug(Y.Plugin.Drop);
            var corn = Y.one('input[name="response[' + id + ']"');

            dropId.drop.on('drop:hit', function (e) {
                dropId.set('innerHTML', '<span class="draghere active">' + e.drag.get('node').get('innerHTML') + '</strong>');
                corn.set('value', encodeURIComponent(e.drag.get('node').getAttribute('data-value')));
            });
        });
    }
};
