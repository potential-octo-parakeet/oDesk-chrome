var chromedesk = {}, db = {}, firstuse = false;

setInterval(function() {
    chromedesk.init();    
}, 90000);

chrome.runtime.onInstalled.addListener(function() {
    firstuse = true;
    chromedesk.init();
});

chromedesk.init = function() {
    if (navigator.onLine) {
        chromedesk.check();
        chromedesk.dbsave();
    }
};

chromedesk.check = function() {
    var unread = 0;
    
    this.dbinit();
    try{
        chromedesk.http("https://www.odesk.com/api/mc/v2/trays/" + db.user.id + "/notifications;inbox;tickets;disputes/stats.json", function(result) {
            if (parseInt(result.status) === 200) {
                var res = JSON.parse(result.response);
                res.trays.forEach(function(n) {
                  var t = n.type, ur = parseInt(n.unread);
                  if(ur==null || ur=='NaN' || ur==''){
                    ur = 0;
                  }
                  localStorage.setItem('oDeskChrome.' + t, ur);
                  unread += ur;
                  console.log('unread.'+t+':'+unread);
                });
                chromedesk.badge(unread);
            }
        });
    } catch(e){
        //do nothing
    }    
};

chromedesk.badge = function(n) {
    chrome.browserAction.setBadgeText({text: n.toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 150]});
};

chromedesk.notice = function(text) {
    var note = chrome.notifications,
            opts = {
                type: "basic",
                iconUrl: "../assets/icon/icon48.png",
                title: "oDesk Notification",
                message: text
            };

    note.create('a', opts, function() {
        setTimeout(function() {
            note.clear('a', function() {
                console.log('notif cleared');
            });
        }, 5000);
    });
};

chromedesk.cookie = function(domain, cookie, cb) {
    chrome.cookies.get({"url": domain, "name": cookie}, function(cookie) {
        if (cookie && cb) {
            cb(cookie.value);
        }
    });
};

chromedesk.dbinit = function() {    
    try{
        db = JSON.parse(localStorage.getItem('oDeskChrome'));
        db.user;// trial error
    } catch(e){
        //chromedesk.dbsave();
    }
};

chromedesk.dbsave = function() {
    try{
        chromedesk.http('https://www.odesk.com/api/hr/v2/users/me.json', function(result) {
            if (parseInt(result.status) === 200) {
                localStorage.setItem('oDeskChrome', result.response);
                chromedesk.http('https://www.odesk.com/api/auth/v1/info.json', function(res) {
                    localStorage.setItem('oDeskChrome.portrait', JSON.parse(res.response).info.portrait_50_img);
                });
            }
            if (parseInt(result.status)===401 && firstuse) {    
                chromedesk.browse('https://www.odesk.com/login');
                firstuse = false;
            }
        });
    } catch(e){
        console.log(e);
    }
};

chromedesk.browse = function(domain) {
    chrome.tabs.create({url: domain});
};

chromedesk.http = function(url, cb) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (parseInt(http.readyState) === 4)
            cb(http);
    };
    http.open('GET', url);
    http.send();
};