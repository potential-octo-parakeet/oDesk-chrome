var uid = localStorage['oChromeUserID'];

$(document).ready(function(){
	init();

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  if(e.target.hash=="#inbox")
	  	oUserInbox();

	  if(e.target.hash=="#tickets")
	  	oUserTickets();

	  if(e.target.hash=="#notices")
	  	oUserNotices();

	});

});

function oUserInbox(){
	var url = "https://www.odesk.com/api/mc/v1/trays/"+uid+"/inbox.json";
	$.getJSON(url,function(result){
		var thread = $('#inbox');
		$('.oThread',thread).html('');
		$.each(result.current_tray.threads,function(i,e){
			$('.oThread',thread).append('<li '+(e.read==1?'':'class="active"')+'><a target="_blank" href="https://www.odesk.com/mc/#thread/'+e.id+'" data-href="'+e.thread_api+'">'+e.last_post_preview+'</a></li>');
		});
	}).fail(function(){
		oPlsLogin();
	});
}

function oUserTickets(){
	var url = "https://www.odesk.com/api/mc/v1/trays/"+uid+"/tickets.json";
	$.getJSON(url,function(result){
		var thread = $('#tickets');
		$('.oThread',thread).html('');
		$.each(result.current_tray.threads,function(i,e){
			$('.oThread',thread).append('<li '+(e.read==1?'':'class="active"')+'><a target="_blank" href="https://www.odesk.com/mc/#thread/'+e.id+'" data-href="'+e.thread_api+'">'+e.last_post_preview+'</a></li>');
		});
	});
}

function oUserNotices(){
	var url = "https://www.odesk.com/api/mc/v1/trays/"+uid+"/notifications.json";
	$.getJSON(url,function(result){
		var thread = $('#notices');
		$('.oThread',thread).html('');
		$.each(result.current_tray.threads,function(i,e){
			$('.oThread',thread).append('<li '+(e.read==1?'':'class="active"')+'><a target="_blank" href="https://www.odesk.com/mc/#thread/'+e.id+'" data-href="'+e.thread_api+'">'+e.subject+'</a></li>');
		});
	});
}

function oUserDetails(){
	$('.userimg').attr('src',localStorage['oChromeUserIMG']);
	$('.username').text(localStorage['oChromeUser']);
	$('.userid').text(localStorage['oChromeUserID']);
	$('.userlink').attr('href',localStorage['oChromeUserLink']);
}

function oPlsLogin(){
	$('#oThreads').hide();
	$('#oAlert').show();
}

function init(){
	oUserDetails();
	oUserInbox();
}