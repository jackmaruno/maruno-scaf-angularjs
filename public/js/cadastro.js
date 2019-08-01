
function cadastroCtrl($scope, $location, $http) {   

	$scope.usuario = {};
	$scope.confirmaSenha = "";
	  
	
    $scope.save = function (mpForm) {    
		if (!mpForm.$valid) {
			$scope.displayValidationError = true;  
			return;
		}   
		if($scope.usuario.senha == $scope.confirmaSenha) {
			//$scope.portalService.salvar("/novoUsuario", $scope.usuario, {}, null, result); 
			$scope.portalService.novoUsuario($scope.usuario); 
			//$scope.goMainPage();
			//showMessage(true, 'Usuário criado com sucesso.'); 
		}else{ 
			showMessage(false, 'O campo "Senha" está diferente do campo "Confirma Senha".'); 
		} 
    };

    $scope.autenticar = function () {    
    	$scope.logar($scope.usuario.login, $scope.usuario.senha); 
    };
}; 