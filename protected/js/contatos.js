
function contatoCtrl($scope, $location, $http) {   
  
    $scope.columnDefs = [ 
        {"mDataProp": "nome", "aTargets":[0] },
        {"mDataProp": "email", "aTargets":[1] },
        {"mDataProp": "assunto", "aTargets":[2] },
        {"mDataProp": "comentario", "aTargets":[3] },
        {"mDataProp": function (a, b) {    
						return '<span>'+formatDateTime(a.data)+'</span>' ;
				      }, "aTargets":[4] } 
    ];   

    $scope.init = function () {   
    	$scope.UsuarioService.pesquisar("/findAllContatos", $scope.resultList ); 
    }; 
    

    $scope.resultList = function (data) {   
		 if($scope.tabela){ 
			 $scope.tabela.fnClearTable();
			 $scope.tabela.fnAddData(data); 
		 }else{
			 $scope.tabela = createTable("lista", data, $scope.columnDefs, $scope.onclick);
		 }
    }; 
    $scope.init();
}; 