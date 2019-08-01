
function cartoesDeCreditoCtrl($scope, $location, $http) {     
	
    $scope.cartaoCredito = {}; 
    $scope.tabela; 
    var count = -1; 
    
    
    
    $scope.columnDefs = [ 
        getColumn("codigo", ++count),   
        getColumn("bandeira", ++count),   
        getColumn("nome", ++count),   
        getColumn("numero", ++count),   
        getColumnFunction(function (a, b) {return '<span>'+formatDate(a.dataCadastro)+'</span>';}, ++count), 
        getColumn("diaFechamento", ++count),   
        getColumn("diaVencimento", ++count),   
        getColumnStatus(++count),  
        getColumnFunction(function (a, b) {return  getBotaoStatus('mpStatus', a) + '&nbsp;&nbsp;&nbsp;' + getBotaoEditar('mpCartaoCredito') + '&nbsp;&nbsp;&nbsp;' +  getBotaoExcluir('mpCartaoCreditoExcluir') ;} , ++count) 
 
    ];   

    $scope.saveOrUpdate = function (mpForm) {     
		if (!mpForm.$valid) {
			$scope.displayValidationError = true;  
			return;
		} 

		if (!$scope.cartaoCredito.codigo) {
			$scope.CartoesCreditoService.salvar(null, $scope.cartaoCredito, {}, 'mpCartaoCredito', function (obj) {$scope.pesquisar();});
		}else{
			$scope.CartoesCreditoService.alterar(null, $scope.cartaoCredito, {}, 'mpCartaoCredito', function (obj) {$scope.pesquisar();});
		}  
    };

	$scope.alterStatus = function () {     
		$scope.cartaoCredito.ativo = $scope.cartaoCredito.ativo+'' == 'true' ? 'false':'true';
		$scope.CartoesCreditoService.alterar(null, $scope.cartaoCredito, {}, 'mpStatus', function (obj) {$scope.pesquisar();});
	};
	

    $scope.remove = function () {    
		$scope.CartoesCreditoService.excluir('/'+ $scope.cartaoCredito.codigo, {}, 'mpCartaoCreditoExcluir', function () {$scope.pesquisar();});
    };
    
    $scope.onclick = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {       
        $('td:eq('+count+')', nRow).bind('click', function() {
            $scope.$apply(function() {    
        		var tempEntity = angular.copy(aData);
        		$scope.cartaoCredito = tempEntity;    
            });
        });
        return nRow;
    };  
     
    $scope.novo = function () {    
    	$scope.cartaoCredito = {};  
        $('#mpCartaoCredito').modal('show'); 
    }; 


    $scope.pesquisar = function () {   
    	$scope.CartoesCreditoService.pesquisar("/list", resultList ); 
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


																																																								// ; i

 