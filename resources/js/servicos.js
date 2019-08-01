
var showMessage = function(success, message) {   
	$('#mpMessageBody').html('<div class="alert alert-'+(success ? 'success':'danger')+' alert-dismissable">'+message+'</div>');  
	$('#mpMessage').modal('show');  
};   

var sessionExpired = function() {   
	$('#mpSessionExpired').modal('show');  
};

var mpLoading = {
	show:function() {$('#mpLoading').modal('show');},
	hide:function() {$('#mpLoading').modal('hide');}
};