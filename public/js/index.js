function indexCtrl($scope, $location, $http) {   

	$scope.url = 'public/principal.jsp';
	
	$scope.include = function (url) {       
		$scope.url = 'public/' + url +'?hash='+moment().format('sssYYYYHHMMmmDD') ; 
	};

	$scope.logar = function (login, senha) {       
		$scope.url = 'loginAuto.jsp?login='+login+'&senha='+senha+'&hash='+moment().format('sssYYYYHHMMmmDD') ; 
	};
	
	$scope.init = function () {        
	};

	$scope.goMainPage = function () {      
		$scope.url = 'public/principal.jsp';
	};

	$scope.init();
 
var mpLoading = {
	show:function() {$('#mpLoading').modal('show');},
	hide:function() {$('#mpLoading').modal('hide');}
};  
var showMessage = function(success, message) {   
	$('#mpMessageBody').html('<div class="alert alert-'+(success ? 'success':'danger')+' alert-dismissable">'+message+'</div>');  
	$('#mpMessage').modal('show');  
};   

	function Service(http_){
		var http = http_;
			function salvar(path, obj, config, idModal, listener) {  
				mpLoading.show();
				http.post('/rest/portal'+path, obj, config)
					.success(function (data, status, headers, config) { 
						showMessage(data.sucesso, data.msg);  
						mpLoading.hide();
						if(listener){
							listener(data.sucesso, data.dados.RESPOSTA);
						}
						if(idModal){
							$('#'+idModal).modal('hide');  
						}
					})
					.error(function(data, status, headers, config) { 
						mpLoading.hide();
						showMessage(false, data); 
						if(idModal){
							$('#'+idModal).modal('show'); 
						}
					});
			}

			function novoUsuario(usuario) {  
				mpLoading.show();
				http.post('/rest/portal/novoUsuario', usuario, {})
					.success(function (data, status, headers, config) { 
						mpLoading.hide(); 
						if(data.sucesso){
							$('#mpUsuario').modal('show');  
						}else{
							showMessage(data.sucesso, data.msg);  
						}
					})
					.error(function(data, status, headers, config) { 
						mpLoading.hide();
						showMessage(false, data);  
					});
			}
			
			function pesquisar(path, listener, config) {  
				http.get('/rest/portal'+path, config)
			    	.success(function(data, status, headers, config) {
			    		if(!data.sucesso){ 
			    			showMessage(data.sucesso, data.msg);  
			    		} 
			    		if(listener){
			    			listener(data.dados.RESPOSTA);
			    		}  
			    	 }); 
			}  
			return {
				'salvar': salvar ,
				'novoUsuario': novoUsuario ,
				'pesquisar': pesquisar 
			}
	};
	 
	$scope.portalService = new Service($http) ; 
};