$(function(){
	oChrome.init();

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  if(e.target.hash=="#inbox")
	  	oChrome.inbox();

	  if(e.target.hash=="#tickets")
	  	oChrome.tickets();

	  if(e.target.hash=="#notices")
	  	oChrome.notices();
	});
});