$(function() {
    oChrome.init();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        switch (e.target.hash) {
            case '#inbox':
                oChrome.inbox();
                break;
            case '#tickets':
                oChrome.tickets();
                break;
            case '#disputes':
                oChrome.disputes();
                break;
            case '#notices':
                oChrome.notices();
                break;
        }
    });

    switch (localStorage.getItem('oDeskChrome.tab')) {
        case 'inbox':
            $('a[href="#inbox"').parent('li').addClass('active');
            $('#inbox').addClass('active');
            break;
        case 'tickets':
            $('a[href="#tickets"').parent('li').addClass('active');
            $('#tickets').addClass('active');
            break;
        case 'disputes':
            $('a[href="#disputes"').parent('li').addClass('active');
            $('#disputes').addClass('active');
            break;
        case 'notices':
            $('a[href="#notices"').parent('li').addClass('active');
            $('#notices').addClass('active');
            break;
        default:
            $('a[href="#inbox"').parent('li').addClass('active');
            $('#inbox').addClass('active');
    }

    $('a[data-toggle="tooltip"]').tooltip({placement: 'left'});
});