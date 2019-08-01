
function homeCtrl($scope, $location, $http) {   

	$scope.Parametros = new Parametros($http) ; 
	$scope.urlPagina = 'dashboard.jsp';
	$scope.listMenu  = new Array();
	$scope.menu = {};
	$scope.respres = ''; 
 

	$scope.initHomeCtrl = function () {        
		$scope.Parametros.pesquisar("/listMenus", resultListMenus); 
		$scope.Parametros.pesquisar("/listServicos", resultListServicos); 
		$scope.Parametros.pesquisar("/usuarioLogado", resultUsuarioLogado);  
	};

	function resultListServicos(data) {      
		$.each(data, function(index, s) {   
			$scope[s.nome] = new Service($http, s) ;   
		});    
    }  
    
	function resultListMenus(data) {       
		$scope.listMenu = data;     
		$scope.listMenu[data.length] = {codigo:0, urlPagina:'relatorioDinamicoAjax.jsp', nome:'Relatório Dinâmico Ajax', styleClass:'glyphicon glyphicon-refresh'};//glyphicon glyphicon-refresh
		$scope.goMainPage();
    }  

	function resultUsuarioLogado(data) {       
		$('#userName').append(data.nome+'<i class="caret"></i>');  
		$('#userFullName').append("<p>"+data.nome+'<small>'+data.perfil.nome+'</small></p>');  
		$('#userNameMenu').append("<p>"+data.nome+'</p>');  
    }   
	
    $scope.setUrlPagina = function (valor) {     
		$scope.urlPagina = valor +'?hash='+moment().format('sssYYYYHHMMmmDD') ; 
	};
	
	$scope.include = function (menu) {      
		$scope.menu = menu;
		$scope.urlPagina = menu.urlPagina +'?hash='+moment().format('sssYYYYHHMMmmDD') ; 
	};
	
	$scope.goMainPage = function () {     
		$scope.include($scope.listMenu[0]);
	};

    $scope.formatDouble = function (valor) {      
    	return formatDouble(valor) ;  
    }; 

    $scope.formatInteger = function (valor) {      
    	return formatInteger(valor) ;  
    }; 

    $scope.formatCentavos = function (valor) {      
    	return formatCentavos(valor) ;  
    }; 
    
    $scope.formatDate = function (date) {      
    	return moment(date).format('DD/MM/YYYY') ; 
    };
    

	
	$scope.initHomeCtrl();
 
		
	function Service(http_, servico_){
		var http = http_;
		var servico = servico_;

		function getUrl(path) {     
			if(path != null && path.length > 0){
				return servico.path + path;
			}
			return servico.path;
		}  
		
		function pesquisar(path, listener, config) {  
			http.get(getUrl(path), config)
				.success(function(data, status, headers, config) { 
					if(data.sucesso == null){ 
						sessionExpired();
					}else{
						if(!data.sucesso){ 
							showMessage(data.sucesso, data.msg);  
						} 
						if(listener){
							listener(data.dados.RESPOSTA);
						}
					} 
				}); 
		} 

		function salvar(path, obj, config, idModal, listener) {  
			mpLoading.show();
			http.post(getUrl(path), obj, config)
				.success(function (data, status, headers, config) {
					if(data.sucesso == null){ 
						sessionExpired();
						mpLoading.hide();
					}else{
						showMessage(data.sucesso, data.msg);  
						mpLoading.hide();
						if(listener){
							listener(data.dados.RESPOSTA);
						}
					}
					$('#'+idModal).modal('hide');  
				})
				.error(function(data, status, headers, config) { 
					mpLoading.hide();
					showMessage(false, data); 
					$('#'+idModal).modal('show'); 
				});
		}
		
		function alterar(path, obj, config, idModal, listener) {  
			mpLoading.show();
			http.put(getUrl(path), obj, config)
			.success(function (data, status, headers, config) {
				if(data.sucesso == null){ 
					sessionExpired();
					mpLoading.hide();
				}else{
					showMessage(data.sucesso, data.msg);  
					mpLoading.hide();
					if(listener){
						listener(data.dados.RESPOSTA);
					}
				}
				$('#'+idModal).modal('hide');  
			})
			.error(function(data, status, headers, config) { 
				mpLoading.hide();
				showMessage(false, data); 
				$('#'+idModal).modal('show'); 
			});
		}
		
		function excluir(path, config, idModal, listener) {  
			mpLoading.show();
			http({method: 'DELETE',url: getUrl(path), config:config})
			.success(function (data, status, headers, config) {
				if(data.sucesso == null){ 
					sessionExpired();
					mpLoading.hide();
				}else{
					showMessage(data.sucesso, data.msg);  
					mpLoading.hide();
					if(listener){
						listener();
					}
				}
				$('#'+idModal).modal('hide');  
			})
			.error(function(data, status, headers, config) { 
				mpLoading.hide();
				showMessage(false, data); 
				$('#'+idModal).modal('show'); 
			});
		} 
		
		return {
			'pesquisar': pesquisar
			, 'salvar': salvar 
			, 'alterar': alterar 
			, 'excluir': excluir 
		}
	};
	

	function Parametros(http_){
		var http = http_;  
		
		function pesquisar(path, listener, config) {  
			http.get('/rest/parametros'+path, config)
				.success(function(data, status, headers, config) {
					if(data.sucesso == null){ 
						sessionExpired();
					}else{
						if(!data.sucesso){ 
							showMessage(data.sucesso, data.msg);  
						} 
						if(listener){
							listener(data.dados.RESPOSTA);
						}
					}  
				}); 
		}   
		
		return {
			'pesquisar': pesquisar 
		,'find':find
		}
	};
};