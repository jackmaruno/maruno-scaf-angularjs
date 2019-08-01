
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
 
};