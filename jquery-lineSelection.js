/*
 * jQuery plugin: fieldSelection - v0.1.1 - last change: 2006-12-16
 * (c) 2006 Alex Brem <alex@0xab.cd> - http://blog.0xab.cd
 */

(function () {

    var lineSelection = {

        getSelection: function () {

            var e = (this.jquery) ? this[0] : this;

            return (

                /* mozilla / dom 3.0 */
                ('selectionStart' in e && function () {

                    var start = e.selectionStart;
                    var end = e.selectionEnd;
                    var length = end - start;
                    var text = e.value.substr(start, length);

                    var caretIndicator = '|caretIsHere|';
                    var line = e.value.substring(0, start) + caretIndicator + e.value.substring(start);
                    var lines = line.split('\n');

                    var selectedLine = '';
                    lines.forEach(function (l, i) {
                        if (l.indexOf(caretIndicator) !== -1) {
                            selectedLine = l.replace(caretIndicator, '');
                        }
                    });

                    return {
                        start: start,
                        end: end,
                        length: length,
                        text: text,
                        line: selectedLine
                    };
                }) ||

                /* explorer */
                (document.selection && function () {

                    e.focus();

                    var r = document.selection.createRange();
                    if (r === null) {
                        return {start: 0, end: e.value.length, length: 0}
                    }

                    var re = e.createTextRange();
                    var rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);

                    return {
                        start: rc.text.length,
                        end: rc.text.length + r.text.length,
                        length: r.text.length,
                        text: r.text
                    };
                }) ||

                /* browser not supported */
                function () {
                    return null;
                }

            )();

        }
    };

    jQuery.each(lineSelection, function (i) {
        jQuery.fn[i] = this;
    });

})();
