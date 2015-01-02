/*global $, triplesec*/
/*jslint browser: true */

function progress(where) {
    'use strict';
    $.mobile.loading('show', {
        text: where.what,
        textVisible: true
    });
}

function addSecretToList(index, secret) {
    'use strict';
    $('#secrets').append('<li><a data-i="' + index + '" href="#showSecretDialog" class="showSecretBtn" data-secret="' + secret.name + '">' + secret.name + '</a><a class="delSecretBtn" data-secret="' + secret.name + '" data-icon="delete">Delete</a></li>').listview('refresh');
}

function updateList(secrets) {
    'use strict';
    $('#secrets').empty();
    $(secrets).each(addSecretToList);
    $('.showSecretBtn').click(function () {
        sessionStorage.setItem('curSecretName', $(this).data('secret'));
    });
}

function deleteSecret(name) {
    'use strict';
    $.post('php/ajax.php?action=del', {
        name: name
    }, updateList);
}

function confirmDelete(name) {
    'use strict';
    if (window.confirm('Do you really want to delete ' + name + '?')) {
        deleteSecret(name);
    }
}

function encryptEnd(err, buff) {
    'use strict';
    $.mobile.loading('hide');
    if (!err) {
        $.post('php/ajax.php?action=add', {
            triplesec: buff.toString('hex'),
            name: sessionStorage.getItem('curSecretName')
        }, updateList);
    }
}

function decryptEnd(err, buff) {
    'use strict';
    $.mobile.loading('hide');
    if (!err) {
        $('#plaintext').textinput('enable').val(buff.toString());
    }
}

function decrypt(key, ciphertext) {
    'use strict';
    triplesec.decrypt({
        data:          new triplesec.Buffer(ciphertext, "hex"),
        key:           new triplesec.Buffer(key),
        progress_hook: progress
    }, decryptEnd);
}

function encrypt(key, data) {
    'use strict';
    triplesec.encrypt({
        data:          new triplesec.Buffer(data),
        key:           new triplesec.Buffer(key),
        progress_hook: progress
    }, encryptEnd);
}

function initEncrypt() {
    'use strict';
    sessionStorage.setItem('curSecretName', $('#dataName').val());
    encrypt($('#passwordEncrypt').val(), $('#dataToEncrypt').val());
}

function initDecrypt() {
    'use strict';
    decrypt($('#passwordDecrypt').val(), $('#dataToDecrypt').val());
}

function getList() {
    'use strict';
    $.get('php/ajax.php?action=list' + '&' + new Date().getTime(), updateList);
}

function showSecret(secret) {
    'use strict';
    $('#dataToDecrypt').val(secret.triplesec);
}

function getSecret(secret) {
    'use strict';
    $('.secretName').text(secret);
    $('#passwordDecrypt, #dataToDecrypt').val('');
    $('#plaintext').val('').textinput('disable');
    $.post('php/ajax.php?action=get', {
        name: secret
    }, showSecret);
}

function initView(e, page) {
    'use strict';
    if (e.type === 'pagechange') {
        switch (page.toPage.attr('id')) {
        case 'home':
            getList();
            break;
        case 'showSecretDialog':
            getSecret(sessionStorage.getItem('curSecretName'));
            break;
        case 'addSecretDialog':
            $('#passwordEncrypt, #dataName, #dataToEncrypt').val('');
            break;
        }
    }
}

function init() {
    'use strict';
    $('#encryptBtn').click(initEncrypt);
    $('#decryptBtn').click(initDecrypt);
    $('#refreshBtn').click(getList);
    $(document).on('click', '.delSecretBtn', function () {
        confirmDelete($(this).data('secret'));
    });
}

$(document).ready(init);
$(document).on('pagechange', initView);
