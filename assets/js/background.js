var chromedesk = {}, db = {};

setInterval(function(){
	chromedesk.query();
	chromedesk.dbsave();
},90000);

chrome.runtime.onInstalled.addListener(function(){
	chromedesk.http("https://www.odesk.com/api/auth/v1/info.json",function(result){
		if(result.status==200){
			localStorage.setItem('oDeskChrome',result.response);
		}
		if(result.status==401){
			chromedesk.browse("https://www.odesk.com/login")
		}
	});
});

chromedesk.query = function(){
	var message = '', unread = 0;

	chromedesk.dbinit();

	chromedesk.http("https://www.odesk.com/api/mc/v2/trays/"+db.auth_user.uid+"/notifications;inbox;tickets;disputes/stats.json",function(result){
		if(result.status==200){
			var res = JSON.parse(result.response);	
			res.trays.forEach(function(n){
				localStorage.setItem('oDeskChrome.'+n.type,n.unread);
				unread += parseInt(n.unread);
			});
		}
		chromedesk.badge(unread);
	});
}

chromedesk.badge = function(n){
	chrome.browserAction.setBadgeText({text: n.toString()});
	chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,150]});
}

chromedesk.notice = function(text){
	var note = chrome.notifications,
			opts = {
				type: "basic",
				iconUrl: "../assets/icon/icon48.png",
				title: "oDesk Notification",
				message: text
			};

	note.create('a',opts,function(){
		setTimeout(function(){
			note.clear('a',function(){
				console.log('notif cleared');
			});
		},5000);
	});
}

chromedesk.cookie = function(domain,cookie,cb){
	chrome.cookies.get({"url": domain, "name": cookie}, function(cookie){
		if(cookie && cb){
			cb(cookie.value);
		}
	});
}

chromedesk.dbinit = function(){
	db = JSON.parse(localStorage.getItem('oDeskChrome'));
}

chromedesk.dbsave = function(){
	chromedesk.http('https://www.odesk.com/api/auth/v1/info.json',function(result){
		if(result.status==200){
			localStorage.setItem('oDeskChrome',result.response);
		}
	});
}

chromedesk.browse = function(domain){
	chrome.tabs.create({url:domain});
}

chromedesk.http = function(url,cb){
	var http = new XMLHttpRequest();
	http.onreadystatechange = function(){
		if(http.readyState==4)
			cb(http);
	};
	http.open('GET',url);
	http.send();
}