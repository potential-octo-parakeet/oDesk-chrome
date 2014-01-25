var notificationIcon  = '../assets/icon/icon48.png',
		notificationTitle = 'oDesk Notification',
		notificationText  = '';

setInterval(oQuery,300000);
//setTimeout(oQuery,5000); // debug 

/*
chrome.browserAction.onClicked.addListener(function(){
	oBrowse('https://www.odesk.com/');
});*/

chrome.tabs.onUpdated.addListener(function(){
	oChromeStore();
});


function oQuery(){
	var	http = new XMLHttpRequest(), 
			uid = localStorage['oChromeUserID'],
			url = "https://www.odesk.com/api/mc/v2/trays/"+uid+"/notifications;inbox;tickets;disputes/stats.json";

		http.open('GET',url,true);
		http.onload = function(){
			if(this.status==200){
				var res = JSON.parse(this.response), unreadCount = 0;		
				notificationText = ''; // clear text first
				res.trays.forEach(function(n){
					if(parseInt(n.unread))
						notificationText += 'You have '+n.unread+' '+n.type+"\n";
					unreadCount += parseInt(n.unread);
				});
			}
			if(unreadCount)
				oNotice();
		}
		http.send();
}

function oNotice(){

	var notification = webkitNotifications.createNotification(
	 	notificationIcon,
	  notificationTitle,
	  notificationText  
	);
	
	notification.show();

	notification.addEventListener('click',function(t){
		console.log(t);
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

function oChromeStore(){
	var	http = new XMLHttpRequest(),
			url = "https://www.odesk.com/api/auth/v1/info.json";

	http.open('GET',url,true);
	http.onload = function(result,data){
		if(this.status==200){
			var user = JSON.parse(this.response);
			localStorage['oChromeUser'] = user.auth_user.first_name+' '+user.auth_user.last_name;
			localStorage['oChromeUserID'] = user.auth_user.uid;
			localStorage['oChromeUserIMG'] = user.info.portrait_50_img;
			localStorage['oChromeUserLink'] = user.info.profile_url;
		}
	};
	http.send();
}