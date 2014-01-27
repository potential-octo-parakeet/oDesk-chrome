var notificationIcon  = '../assets/icon/icon48.png',
		notificationTitle = 'oDesk Notification',
		notificationText  = '';

setInterval(oQuery,300000);
setInterval(oChromeSave,3600000);

chrome.runtime.onInstalled.addListener(function(){
	oHttp("https://www.odesk.com/api/auth/v1/info.json",function(result){
		if(result.status==200){
			localStorage.setItem('oDeskChrome',result.response);
		}
		if(result.status==401){
			oBrowse("https://www.odesk.com/login")
		}
	});
});

function oQuery(){
	var	db = JSON.parse(localStorage.getItem('oDeskChrome'));

	oHttp("https://www.odesk.com/api/mc/v2/trays/"+db.auth_user.uid+"/notifications;inbox;tickets;disputes/stats.json",function(result){
		if(result.status==200){
			var res = JSON.parse(result.response), unreadCount = 0;		
			notificationText = ''; // clear text
			res.trays.forEach(function(n){
				if(parseInt(n.unread))
					notificationText += 'You have '+n.unread+' '+n.type+"\n";
				unreadCount += parseInt(n.unread);
			});
		}
		if(unreadCount)
			oNotice();
	});
}

function oNotice(){
	var notification = webkitNotifications.createNotification(
	 	notificationIcon,
	  notificationTitle,
	  notificationText  
	);
	
	notification.show();

	notification.addEventListener('click',function(t){
		oBrowse('https://www.odesk.com/mc/');
	});

	notification.addEventListener('show',function(){
		setTimeout(function(){
			notification.close();
		},5000);
	});
}

function oCookie(domain,cookie,cb){
	chrome.cookies.get({"url": domain, "name": cookie}, function(cookie){
		if(cookie && cb){
			cb(cookie.value);
		}
	});
}

function oBrowse(domain){
	chrome.tabs.create({url:domain});
}

function oChromeSave(){
	oHttp('https://www.odesk.com/api/auth/v1/info.json',function(result){
		if(result.status==200){
			localStorage.setItem('oDeskChrome',result.response);
		}
		else{
			oBrowse('https://www.odesk.com/login');
		}
	});
}

function oHttp(url,cb){
	var http = new XMLHttpRequest();
	http.onreadystatechange = function(){
		if(http.readyState==4)
			cb(http);
	};
	http.open('GET',url);
	http.send();
}