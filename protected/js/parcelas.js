function parcelaWeb($scope, $location, $http) {     
    $scope.parcelamento = {};
    $scope.tabela;
    $scope.valor =  0.00;
	$scope.codCategoriaPai;
	
    $scope.listCategorias = new Array();
	$scope.listCentrosDeCustos = new Array();
	$scope.listCartaoCredito = new Array();
	
    $scope.url = URL_REST+"parcelas";    

/*
    private Long codigo;
    private Date dataReferencia;
    private Double valor;
    private Integer numParcela;   
    private Lancamento lancamento;
    */
    $scope.columnDefs = [ 
        {"mDataProp": "lancamento.categoria.nome", "aTargets":[0] },
        {"mDataProp": "numParcela", "aTargets":[1] }, 
        {"mDataProp": function (a, b) {return '<span>'+formatDate(a.dataReferencia)+'</span>';}, "aTargets":[2] } ,
        {"mDataProp": function (a, b) {return '<span>'+formatDate(a.lancamento.dataReferencia)+'</span>';}, "aTargets":[3] } ,
        {"mDataProp": function (a, b) {return '<span class="money">R$ '+formatDouble(a.valor)+'</span>';}, "aTargets":[4] } /*, 
        {"mDataProp": function (a, b) {    
        				return '&nbsp;&nbsp;&nbsp;<a href="#mpParcelamento" data-toggle="modal" role="button" ><i class="fa fa-edit" style="color: #440;"></i></a>'
        				     + '&nbsp;&nbsp;&nbsp;<a href="#mpParcelas" data-toggle="modal"><i class="fa fa-table" title="Visualizar Parcelas"></i></a>'
        				     + '&nbsp;&nbsp;&nbsp;<a href="#mpParcelamentoExcluir" data-toggle="modal"  ng-click="" role="button" ><i class="fa fa-times-circle" style="color: red"></i></a>';
                      }, "aTargets":[5] } */
    ];   
     
     
    $scope.getList = function () {   
        var config = {}; 
		$http.get($scope.url + "/list", config)
			 .success(function(data) {  
				 if($scope.tabela){ 
					 $scope.tabela.fnClearTable();
					 $scope.tabela.fnAddData(data); 
				 }else{
					 $scope.tabela = createTable("lista", data, $scope.columnDefs, $scope.onclick);
				 }
			 }).error(function(data, status, headers, config) { 
				 showMessage(false, data);
			 });
    }; 
 
     
	$scope.update = function () {
    	$('#mpParcelamento').modal('hide');
		$('#mpLoading').modal('show');   
		$http.put($scope.url, $scope.parcelamento)
			.success(function (data) {
				$scope.getList();
				$('#mpLoading').modal('hide');  
				showMessage(true, 'parcelamento alterado com sucesso.'); 
			})
			.error(function(data, status, headers, config) { 
				$('#mpLoading').modal('hide'); 
		    	$('#mpParcelamento').modal('show');
		    	showMessage(false, 'Ocorreu um erro ao tentar alterar o parcelamento.'); 
			});
	};

	$scope.save = function () { 
    	$('#mpNovoParcelamento').modal('hide');
		$('#mpLoading').modal('show');   
		$http.post($scope.url+'/'+$scope.valor, $scope.parcelamento)
			.success(function (data) {
				$scope.getList();
				$('#mpLoading').modal('hide');  
				showMessage(true, 'parcelamento salvo com sucesso.');  
			})
			.error(function(data, status, headers, config) { 
				$('#mpLoading').modal('hide');
				$('#mpNovoParcelamento').modal('show'); 
				showMessage(false, 'Ocorreu um erro ao tentar salvar o parcelamento.'); 

			});
	};

    $scope.saveOrUpdate = function (mpForm) {    
		if (!mpForm.$valid) {
			$scope.displayValidationError = true;  
			return;
		} 
		if (!$scope.parcelamento.codigo) {
			$scope.save();
		}else{
			$scope.update();
		}  
    };

	$scope.alterStatus = function () {    
    	$('#mpStatus').modal('hide');
		$('#mpLoading').modal('show');  
		
		$scope.parcelamento.ativo = $scope.parcelamento.ativo+'' == 'true' ? 'false':'true';
		
		$http.put($scope.url, $scope.parcelamento)
			.success(function (data) {
				$scope.getList();
				$('#mpLoading').modal('hide');  
				showMessage(true, 'Alterado o status do parcelamento com sucesso.');  
			})
			.error(function(data, status, headers, config) { 
				$('#mpLoading').modal('hide'); 
				showMessage(false, 'Ocorreu um erro ao tentar alterar o status do parcelamento.'); 
			});
	};
	
/*
    $scope.remove = function () {    
		$('#mpLoading').modal('show');

		$http.delete($scope.url + '/'+ $scope.parcelamento.codigo)
			.success(function (data) {
				$scope.getList();
				$('#mpLoading').modal('hide');
				showMessage(true, 'parcelamento exclu�do com sucesso.');  
			})
			.error(function(data, status, headers, config) { 
				$('#mpLoading').modal('hide');
				showMessage(false, 'Ocorreu um erro ao tentar excluir o parcelamento.'); 	
			}); 
    };
  */  
    $scope.onclick = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {       
        $('td:eq(6)', nRow).bind('click', function() {
            $scope.$apply(function() {    
        		var tempEntity = angular.copy(aData);
        		$scope.parcelamento = tempEntity;  
            	$scope.parcelamento.dataCadastro = new Date($scope.parcelamento.dataCadastro);  
            	$scope.parcelamento.dataPrimeiraParcela = new Date($scope.parcelamento.dataPrimeiraParcela);  
            	$scope.setListParcelas();
            });
        });
        return nRow;
    }; 
 
     
    $scope.novo = function () {    
    	$scope.parcelamento = {};  
        $('#mpNovoParcelamento').modal('show');
    };
     
    
    $scope.formatDate = function (date) {      
    	return formatDate(date) ;  
    };
    
    
    $scope.formatDouble = function (valor) {      
    	return formatDouble(valor) ;  
    };
     
    
    
    /*#######################################################################################
     #                 Parcelas                                                             #  
     #######################################################################################*/ 

    $scope.parcela = {};
    $scope.tabelaParcela;

    $scope.columnDefsParcela = [ 
        {"mDataProp": "numParcela", "aTargets":[0]},
        {"mDataProp": function (a, b) {return '<span class="date">'+formatDate(a.dataReferencia)+'</span>';}, "aTargets":[1] } ,
        {"mDataProp": function (a, b) {return (a.dataPagamento ? '<span class="date">'+formatDate(a.dataReferencia)+'</span>':'Pendente');}, "aTargets":[2] } ,
        {"mDataProp": function (a, b) {return '<span class="money">R$ '+formatDouble(a.valor)+'</span>';}, "aTargets":[3] } ,
        {"mDataProp": function (a, b) {return (a.valorPago ? '<span class="money">R$ '+formatDouble(a.valorPago)+'</span>':'Pendente');}, "aTargets":[4] } ,
        {"mDataProp": function (a, b) {     
        				return '&nbsp;&nbsp;&nbsp;<a href="#mpParcelaAlterar" data-toggle="modal" role="button" ><i class="fa fa-edit" style="color: #440" title="Alterar Parcela"></i></a>' + 
        				       '&nbsp;&nbsp;&nbsp;<a href="#mpParcelaPagar" data-toggle="modal" ><i class="fa fa-money" style="color: green" title="Registrar Pagamento de Parcela"></i></a>';
                      }, "aTargets":[5] } 
    ];   
     
    $scope.getListParcelas = function () {    
        var config = {}; 
		$http.get($scope.url + "/parcelas/list/"+$scope.parcelamento.codigo, config) 
			 .success(function(data) {  
				 if($scope.tabelaParcela){ 
					 $scope.tabelaParcela.fnClearTable();
					 $scope.tabelaParcela.fnAddData(data); 
				 }else{
					 $scope.tabelaParcela = createTable("listParcelas", data, $scope.columnDefsParcela, $scope.onclickParcela);
				 }
			 }).error(function(data, status, headers, config) { 
				 showMessage(false, data);
			 });
    }; 
    
    $scope.setListParcelas = function () {    
    	if($scope.tabelaParcela){ 
    		$scope.tabelaParcela.fnClearTable();
    		$scope.tabelaParcela.fnAddData($scope.parcelamento.listParcela); 
    	}else{
    		$scope.tabelaParcela = createTable("listParcelas", $scope.parcelamento.listParcela, $scope.columnDefsParcela, $scope.onclickParcela);
    	} 
    }; 

    $scope.onclickParcela = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {       
        $('td:eq(5)', nRow).bind('click', function() {
            $scope.$apply(function() {    
        		var tempEntity = angular.copy(aData);
        		$scope.parcela = tempEntity;  
            	$scope.parcela.dataReferencia = new Date($scope.parcela.dataReferencia);     
            	
            });
        });
        return nRow;
    }; 
    
    $scope.saveParcela = function (mpForm) {    
		if (!mpForm.$valid) {
			$scope.mpForm = true;  
			return;
		} 
		$('#mpParcelaAlterar').modal('hide');
		$('#mpLoading').modal('show');
		$scope.parcela.parcelamento = $scope.parcelamento;
		 
    	var config = {}; 
    	$http.put($scope.url+"/parcelas", $scope.parcela, config)
    		.success(function (data) {
    			$scope.getListParcelas(); 
            	$('#mpLoading').modal('hide');
            	showMessage(true, 'Parcela alterada com sucesso.'); 
    		
    		}).error(function(data, status, headers, config) {  
    			$scope.mpParcelaAlterarFormErro = true;  
            	$('#mpLoading').modal('hide');
	    		$('#mpParcelaAlterar').modal('show');
	    		showMessage(false, 'Ocorreu um erro ao tentar alterar a Parcela.');  
    	});
    };
     
     /*
    $scope.removeParcela = function () {  
		$('#mpLoading').modal('show');
		$http.delete($scope.url+"/parcelas/"+ $scope.parcela.codigo)
			.success(function (data) {
    			$scope.findParcelas(); 
				$('#mpLoading').modal('hide');
				showMessage(true, 'Parcela exclu�da com sucesso.');  
			})
			.error(function(data, status, headers, config) { 
				$('#mpLoading').modal('hide');
				showMessage(false, 'Ocorreu um erro ao tentar excluir a Parcela.'); 	 
			}); 
    };
     
     */

    $scope.findParcelas = function () {     

		var config = {}; 
		$http.get($scope.url + "/parcelas/list/"+$scope.parcelamento.codigo, config)
			 .success(function(data) {   
				 $scope.parcelamento.listParcela = data;
			 }).error(function(data, status, headers, config) {  
			 });
    };


    /*#######################################################################################
     #                 PARÂMETROS                                                           #  
     #######################################################################################*/

    $scope.loadCategorias = function () {     
    	get(URL_REST+"parametros/listCategoriasByCategoriaPai/7", 
    	    function(data, textStatus, jqXHR){    
    			var i = -1;
				$.each(data, function(index, c) {  
					if(c.codigo == 52 || c.codigo == 74 || c.codigo == 47){ 
						$scope.listCategorias[++i] = c;
					}
				});    
    		}, 
    		function(jqXHR, textStatus, errorThrown){ 
				showMessage(false, 'Ocorreu um erro ao tentar carregar dados referentes a categoria.'); 	 
    		}
    	); 
    };

    $scope.loadCentrosDeCusto = function () {     
    	get(URL_REST+"parametros/listCentrosDeCustos", 
    	    function(data, textStatus, jqXHR){    
    		    $scope.listCentrosDeCustos = data;  
    		}, 
    		function(jqXHR, textStatus, errorThrown){ 
				showMessage(false, 'Ocorreu um erro ao tentar carregar dados referentes a CentrosDeCusto.'); 
    		}
    	); 
    };
    
    $scope.loadCartaoCredito = function () {     
    	get(URL_REST+"parametros/listCartaoCredito", 
    			function(data, textStatus, jqXHR){    
    		$scope.listCartaoCredito = data;  
    	}, 
    	function(jqXHR, textStatus, errorThrown){ 
			showMessage(false, 'Ocorreu um erro ao tentar carregar dados referentes a CartaoCredito.'); 
    	}
    	); 
    }; 
    
    $scope.init = function () {   
        $scope.getList();  
        $scope.loadCategorias();
        $scope.loadCentrosDeCusto();
        $scope.loadCartaoCredito();
    }; 
    
    $scope.init(); 
}; 


																																																								// ; i

 