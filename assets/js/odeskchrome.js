var oChrome = {};

oChrome.init = function() {
    this.user();
    if (!navigator.onLine) {
        oChrome.offline();
        return false;
    }
    switch (this.getTab()) {
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
    try{
        var lab1 = $('[href=#inbox] > .label'),
            lab2 = $('[href=#tickets] > .label'),
            lab3 = $('[href=#disputes] > .label'),
            lab4 = $('[href=#notices] > .label');            
                    
        $('[data-user="img"]').attr('src', this.getPortrait());
        $('[data-user="name"]').text(this.getName());
        $('[data-user="id"]').text(this.getUID());
        $('[data-user="url"]').attr('href', this.getURL());
         
        var i = this.getInbox(), t = this.getTickets(), 
            d = this.getDisputes(), n = this.getNotices();
        
        lab1.text(i);
        lab2.text(t);
        lab3.text(d);
        lab4.text(n);

        (i === 0) ? lab1.hide() : lab1.show();
        (t === 0) ? lab2.hide() : lab2.show();
        (d === 0) ? lab3.hide() : lab3.show();
        (n === 0) ? lab4.hide() : lab4.show();
    } catch(e){
        oChrome.login();
        oChrome.infoHide();
    }
};

oChrome.login = function() {
    $('#oThreads').hide();
    $('#oAlert').show();
};

oChrome.infoHide = function() {
    $('#info').hide();
};

oChrome.offline = function() {
    $('#oThreads').hide();
    $('#oOffline').show();
};

oChrome.inbox = function() {
    try{
        $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + this.getUID() + "/inbox.json", function(result) {
            var ctray  = result.current_tray,
                thread = $('#inbox');
                
            $('.oThread', thread).html('');            
            $.each(ctray.threads, function(i, e) {
                if (typeof (e.id) !== 'undefined')
                    $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/mc/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.last_post_preview) + '</a></li>');
            });
        }).fail(function() {
            oChrome.login();
        });        
    } catch(e){
        oChrome.dbinit();
    }
    this.setTab('inbox');
};

oChrome.tickets = function() {
    try{
        $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + this.getUID() + "/tickets.json", function(result) {
            var ctray  = result.current_tray,
                thread = $('#tickets');
               
            $('.oThread', thread).html('');
            $.each(ctray.threads, function(i, e) {
                if (typeof (e.id) !== 'undefined')
                    $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/tickets/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.last_post_preview) + '</a></li>');
            });
        }).fail(function() {
            oChrome.login();
        });        
    } catch(e){
        oChrome.dbinit();
    }
    this.setTab('tickets');
};

oChrome.disputes = function() {
    try{
        $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + this.getUID() + "/disputes.json", function(result) {
            var ctray  = result.current_tray,
                thread = $('#disputes');
               
            $('.oThread', thread).html('');            
            $.each(ctray.threads, function(i, e) {
                if (typeof (e.id) !== 'undefined')
                    $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/disputes/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.subject) + '</a></li>');
            });
        }).fail(function() {
            oChrome.login();
        });        
    } catch(e){
        oChrome.dbinit();
    }
    this.setTab('disputes');
};

oChrome.notices = function() {
    try{
        $.getJSON("https://www.odesk.com/api/mc/v1/trays/" + this.getUID() + "/notifications.json", function(result) {
            var ctray  = result.current_tray,
                thread = $('#notices');
               
            $('.oThread', thread).html('');            
            $.each(ctray.threads, function(i, e) {
                if (typeof (e.id) !== 'undefined')
                    $('.oThread', thread).append('<li ' + (parseInt(e.read) === 1 ? '' : 'class="active"') + '><a target="_blank" href="https://www.odesk.com/notifications/#thread/' + e.id + '" data-href="' + e.thread_api + '" rel="nofollow">' + oChrome.html2text(e.subject) + '</a></li>');
            });
        }).fail(function() {
            oChrome.login();
        });        
    } catch(e){
        oChrome.dbinit();
    }
    this.setTab('notices');
};

oChrome.setTab = function(tab){
    localStorage.setItem('oDeskChrome.tab', tab);
};

oChrome.getTab = function(){
    return localStorage.getItem('oDeskChrome.tab');
};

oChrome.getUID = function(){
    return JSON.parse(localStorage.getItem('oDeskChrome')).user.id;  
};

oChrome.getURL = function(){
    return JSON.parse(localStorage.getItem('oDeskChrome')).user.public_url;  
};

oChrome.getName = function(){
    var u = JSON.parse(localStorage.getItem('oDeskChrome')).user;
    return u.first_name + ' ' + u.last_name;
};

oChrome.getPortrait = function(){
    return localStorage.getItem('oDeskChrome.portrait') || '../assets/img/user.svg';
};

oChrome.getInbox = function(){
    return parseInt(localStorage.getItem('oDeskChrome.inbox') || 0);
};

oChrome.getTickets = function(){
    return parseInt(localStorage.getItem('oDeskChrome.tickets') || 0);
};

oChrome.getDisputes = function(){
    return parseInt(localStorage.getItem('oDeskChrome.disputes') || 0);
};

oChrome.getNotices = function(){
    return parseInt(localStorage.getItem('oDeskChrome.notifications') || 0);
};

oChrome.dbinit = function(){
    try{
        $.get('https://www.odesk.com/api/hr/v2/users/me.json', function(result){            
            localStorage.setItem('oDeskChrome', JSON.stringify(result));
            $.getJSON('https://www.odesk.com/api/auth/v1/info.json', function(res) {
                localStorage.setItem('oDeskChrome.portrait', res.info.portrait_50_img);
            });
        });
    } catch(e){
        console.log(e);
    }
};

oChrome.html2text = function(html) {
    var span = document.createElement("span");
    span.innerHTML = html;
    return span.textContent || span.innerText;
};
