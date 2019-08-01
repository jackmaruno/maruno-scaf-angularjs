

function tagsCtrl($scope, $location, $http) {     
    $scope.tag = {};
    $scope.tabela;

    var count = -1; 
	
    $scope.columnDefs = [ 
        getColumn("codigo", ++count),   
        getColumn("nome", ++count),   
        getColumn("descricao", ++count),    
        getColumnFunction(function (a, b) { return '<span>'+formatDate(a.dataCadastro)+'</span>' ;  }, ++count),    
        getColumnFunction(function (a, b) { return  getBotaoEditar('mpCadastro', a) + '&nbsp;&nbsp;&nbsp;' +  getBotaoExcluir('mpRemove')   ; }, ++count)  
    ];   

    $scope.saveOrUpdate = function (mpForm) {    
		if (!mpForm.$valid) {
			$scope.displayValidationError = true;  
			return;
		} 

		if (!$scope.tag.codigo) {
			$scope.TagsService.salvar(null, $scope.tag, {}, 'mpCadastro', function (obj) {$scope.pesquisar();});
		}else{
			$scope.TagsService.alterar(null, $scope.tag, {}, 'mpCadastro', function (obj) {$scope.pesquisar();});
		}  
    };
 

    $scope.remove = function () {     
		$scope.TagsService.excluir('/'+ $scope.tag.codigo, {}, 'mpRemove', function () {$scope.pesquisar();});
    };
    
	
    $scope.onclick = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {       
        $('td:eq('+count+')', nRow).bind('click', function() {
            $scope.$apply(function() {    
        		var tempEntity = angular.copy(aData);
        		$scope.tag = tempEntity; 
            });
        });
        return nRow;
    }; 
 
     
    $scope.novo = function () {    
    	$scope.tag = {};  
        $('#mpCadastro').modal('show');
    };
     

    $scope.pesquisar = function () {   
    	$scope.TagsService.pesquisar("/list", $scope.resultList ); 
    };

    $scope.resultList = function (data) {   
		 if($scope.tabela){ 
			 $scope.tabela.fnClearTable();
			 $scope.tabela.fnAddData(data); 
		 }else{
			 $scope.tabela = createTable("lista", data, $scope.columnDefs, $scope.onclick);
		 }
    }; 
    
    $scope.init = function () {   
    	$scope.pesquisar();
    }; 
    
    $scope.init();
}; 
 