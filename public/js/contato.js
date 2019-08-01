
function contatoCtrl($scope, $location, $http) {   

	$scope.contato = {}; 
	  
	
    $scope.save = function (mpForm) {    
		if (!mpForm.$valid) {
			$scope.displayValidationError = true;  
			return;
		}   
		$scope.portalService.salvar('/saveContato', $scope.contato, {}, null,  function (obj) {$scope.goMainPage();}); 
    };
 
}; 