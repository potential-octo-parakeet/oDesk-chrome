var oChrome = {}, db = {};

oChrome.init = function() {
    oChrome.db();
    oChrome.user();
    if (!navigator.onLine) {
        oChrome.offline();
        return false;
    }
    switch (localStorage.getItem('oDeskChrome.tab')) {
        case 'inbox':
            oChrome.inbox();
            break;
        case 'tickets':
            oChrome.tickets();
            break;
        case 'disputes':
            oChrome.disputes();
            break;
        case 'notices':
            oChrome.notices();
            break;
        default:
            oChrome.inbox();
    }
};

oChrome.user = function() {
    var tab1 = $('[href=#inbox] > .label'),
        tab2 = $('[href=#tickets] > .label'),
        tab3 = $('[href=#disputes] > .label'),
        tab4 = $('[href=#notices] > .label');

    $('[data-user="img"]').attr('src', localStorage.getItem('oDeskChrome.portrait'));
    $('[data-user="name"]').text(db.user.first_name + ' ' + db.user.last_name);
    $('[data-user="id"]').text(db.user.id);
    $('[data-user="url"]').attr('href', db.user.public_url);
    tab1.text(localStorage.getItem('oDeskChrome.inbox'));
    tab2.text(localStorage.getItem('oDeskChrome.tickets'));
    tab3.text(localStorage.getItem('oDeskChrome.disputes'));
    tab4.text(localStorage.getItem('oDeskChrome.notifications'));

    parseInt(localStorage.getItem('oDeskChrome.inbox')) === 0 ? tab1.hide() : tab1.show();
    parseInt(localStorage.getItem('oDeskChrome.tickets')) === 0 ? tab2.hide() : tab2.show();
    parseInt(localStorage.getItem('oDeskChrome.disputes')) === 0 ? tab3.hide() : tab3.show();
    parseInt(localStorage.getItem('oDeskChrome.notifications')) === 0 ? tab4.hide() : tab4.show();
};

oChrome.login = function() {
    $('#oThreads').hide();
    $('#oAlert').show();
};

oChrome.offline = function() {
    $('#oThreads').hide();
    $('#oOffline').show();
};

oChrome.inbox = function() {
    $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + db.user.id + "/inbox.json", function(result) {
        var thread = $('#inbox');

        $('.oThread', thread).html('');
        $.each(result.current_tray.threads, function(i, e) {
            if (typeof (e.id) !== 'undefined')
                $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/mc/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.last_post_preview) + '</a></li>');
        });
    }).fail(function() {
        oChrome.login();
    });
    localStorage.setItem('oDeskChrome.tab', 'inbox');
};

oChrome.tickets = function() {
    $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + db.user.id + "/tickets.json", function(result) {
        var thread = $('#tickets');

        $('.oThread', thread).html('');
        $.each(result.current_tray.threads, function(i, e) {
            if (typeof (e.id) !== 'undefined')
                $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/tickets/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.last_post_preview) + '</a></li>');
        });
    }).fail(function() {
        oChrome.login();
    });
    localStorage.setItem('oDeskChrome.tab', 'tickets');
};

oChrome.disputes = function() {
    $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + db.user.id + "/disputes.json", function(result) {
        var thread = $('#disputes');

        $('.oThread', thread).html('');
        $.each(result.current_tray.threads, function(i, e) {
            if (typeof (e.id) !== 'undefined')
                $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/disputes/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.subject) + '</a></li>');
        });
    }).fail(function() {
        oChrome.login();
    });
    localStorage.setItem('oDeskChrome.tab', 'disputes');
};

oChrome.notices = function() {
    $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + db.user.id + "/notifications.json", function(result) {
        var thread = $('#notices');

        $('.oThread', thread).html('');
        $.each(result.current_tray.threads, function(i, e) {
            if (typeof (e.id) !== 'undefined')
                $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/notifications/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.subject) + '</a></li>');
        });
    }).fail(function() {
        oChrome.login();
    });
    localStorage.setItem('oDeskChrome.tab', 'notices');
};

oChrome.db = function() {
    db = JSON.parse(localStorage.getItem('oDeskChrome'));
};

oChrome.html2text = function(html) {
    var span = document.createElement("span");
    span.innerHTML = html;
    return span.textContent || span.innerText;
};