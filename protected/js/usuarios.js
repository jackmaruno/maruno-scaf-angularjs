

function usuariosCtrl($scope, $location, $http) {   
	
    $scope.usuario;
    $scope.tabela;

    var count = -1; 
      
    $scope.columnDefs = [ 
         getColumn("codigo", ++count),       
         getColumn("nome", ++count),       
         getColumn("login", ++count),       
         getColumn("perfil.nome", ++count),       
         getColumn("email", ++count),      
         getColumnStatus(++count), 
         getColumnFunction(function (a, b) { return  getBotaoStatus('mpStatusUsuario', a) + '&nbsp;&nbsp;&nbsp;' +  getBotaoEditar('mpUsuario')   ; }, ++count)          
    ];  
    
    $scope.saveOrUpdate = function (mpForm) {    
		if (!mpForm.$valid) {
			$scope.displayValidationError = true;  
			return;
		} 

		if ($scope.usuario.codigo == null) {
			$scope.UsuarioService.salvar(null, $scope.usuario, {}, 'mpUsuario', function (obj) {$scope.pesquisar();});
		}else{
			$scope.UsuarioService.alterar(null, $scope.usuario, {}, 'mpUsuario', function (obj) {$scope.pesquisar();});
		}   
    };

	$scope.alterStatus = function () {    
		$scope.usuario.ativo = $scope.usuario.ativo+'' == 'true' ? 'false':'true';
		$scope.UsuarioService.alterar(null, $scope.usuario, {}, 'mpStatusUsuario', function (obj) {$scope.pesquisar();});
	};
	
	
    $scope.onclick = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {            
        $('td:eq('+count+')', nRow).bind('click', function() {
            $scope.$apply(function() {  
        		var tempEntity = angular.copy(aData);
        		$scope.usuario = tempEntity;
            });
        });
        return nRow;
    };   
    


    $scope.pesquisar = function () {   
    	$scope.UsuarioService.pesquisar("/list", resultList ); 
    };
    
    function resultList(data) {   
		 if($scope.tabela){ 
			 $scope.tabela.fnClearTable();
			 $scope.tabela.fnAddData(data); 
		 }else{
			 $scope.tabela = createTable("lista", data, $scope.columnDefs, $scope.onclick);
		 } 
    }
    
    $scope.init = function () {   
        $scope.pesquisar();  
    }; 
    
    $scope.init(); 
}; 
 