/*global $, triplesec, progress, Papa*/
/*jslint browser: true*/
function cryptData(result) {
    'use strict';
    var pass = $('#pass').val();
    $.each(result.data, function (i, line) {
        if (i > 0 && line[0]) {
            triplesec.encrypt(
                {
                    data: new triplesec.Buffer('Username: ' + line[6] + '\nPassword: ' + line[7] + '\nHost: ' + line[3] + '\nDatabase: ' + line[5]),
                    key: new triplesec.Buffer(pass),
                    progress_hook: progress
                },
                function (err, buff) {
                    $.mobile.loading('hide');
                    if (!err) {
                        $.post(
                            'php/ajax.php?action=add',
                            {
                                triplesec: buff.toString('hex'),
                                name: line[0]
                            }
                        );
                    }
                }
            );
        }
    });
}

function parseCSV(i, csv) {
    'use strict';
    Papa.parse(csv, {
        complete: cryptData
    });
}

function getCSV() {
    'use strict';
    $.each($('#csvfile')[0].files, parseCSV);
}

function init() {
    'use strict';
    $('#getcsv').click(getCSV);
}

$(document).ready(init);
