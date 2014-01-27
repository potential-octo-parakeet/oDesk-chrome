var db = {}, oChrome = {};

oChrome.init = function(){
	oChrome.db();
	oChrome.user();
	oChrome.inbox();
}

oChrome.user = function(){
	$('.userimg').attr('src',db.info.portrait_50_img);
	$('.username').text(db.auth_user.first_name+' '+db.auth_user.last_name);
	$('.userid').text(db.auth_user.uid);
	$('.userlink').attr('href',db.info.profile_url);
}

oChrome.login = function(){
	$('#oThreads').hide();
	$('#oAlert').show();
}

oChrome.inbox = function(){
	$.getJSON("https://www.odesk.com/api/mc/v1/trays/"+db.auth_user.uid+"/inbox.json",function(result){
		var thread = $('#inbox');
		$('.oThread',thread).html('');
		$.each(result.current_tray.threads,function(i,e){
			$('.oThread',thread).append('<li '+(e.read==1?'':'class="active"')+'><a target="_blank" href="https://www.odesk.com/mc/#thread/'+e.id+'" data-href="'+e.thread_api+'">'+e.last_post_preview+'</a></li>');
		});
	});
}

oChrome.tickets = function(){
	$.getJSON("https://www.odesk.com/api/mc/v1/trays/"+db.auth_user.uid+"/tickets.json",function(result){
		var thread = $('#tickets');
		$('.oThread',thread).html('');
		$.each(result.current_tray.threads,function(i,e){
			$('.oThread',thread).append('<li '+(e.read==1?'':'class="active"')+'><a target="_blank" href="https://www.odesk.com/mc/#thread/'+e.id+'" data-href="'+e.thread_api+'">'+e.last_post_preview+'</a></li>');
		});
	});
}

oChrome.notices = function(){
	$.getJSON("https://www.odesk.com/api/mc/v1/trays/"+db.auth_user.uid+"/notifications.json",function(result){
		var thread = $('#notices');
		$('.oThread',thread).html('');
		$.each(result.current_tray.threads,function(i,e){
			$('.oThread',thread).append('<li '+(e.read==1?'':'class="active"')+'><a target="_blank" href="https://www.odesk.com/mc/#thread/'+e.id+'" data-href="'+e.thread_api+'">'+e.subject+'</a></li>');
		});
	});
}

oChrome.db = function(){
	$.getJSON('https://www.odesk.com/api/auth/v1/info.json',function(result){
		localStorage.setItem('oDeskChrome',JSON.stringify(result));
	}).fail(function(){
		oChrome.login();
	});
	db = JSON.parse(localStorage.getItem('oDeskChrome'));
}