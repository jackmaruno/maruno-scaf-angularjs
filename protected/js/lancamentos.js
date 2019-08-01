function lancamentosCtrl($scope,$location, $http) {     
	   
    $scope.lancamento = {};
    $scope.tabela; 
	$scope.codCategoriaPai; 
	$scope.codFormaPagamento = 0; 
	$scope.numParcelas;  
	$scope.filtro = {}; 
	$scope.error = false;  

	$scope.listCartaoCredito = new Array();
    $scope.listCategorias = new Array();
    $scope.listCategoriasPai = new Array();
    $scope.listCategoriasFilhas = new Array(); 
	$scope.listTags= new Array();
    $scope.listFormaPagamentos = new Array();
    $scope.listNumParcelas = new Array();
     
    $scope.vencimentoFatura = {};
    $scope.listVencimentos = new Array();

    var count = -1; 
	
    function getTags(t){
    	var txt = '';
    	if(t.listTags && t.listTags.length > 0){
    		for(var i = 0; i < t.listTags.length; i++){
    			txt += ""+t.listTags[i].nome+', ' ;
    		} 
    		txt = txt.substring(0, txt.length - 2);
    	}
		return '<span style=\'color: blue\'>'+txt+'</span>' ;
    }
    
    
    $scope.colunas = [ 
        getColumn("codigo", ++count),   
        getColumn("categoria.nome", ++count),    
        getColumnFunction(function (a, b) { return getTags(a); }, ++count),     
        getColumnFunction(function (a, b) { return '<span>'+a.descricao+'</span>';}, ++count),     
        getColumnFunction(function (a, b) { return '<span>'+formatDate(a.dataReferencia)+'</span>' ;  }, ++count),    
        getColumnFunction(function (a, b) { return '<span>'+formatDateTime(a.dataLancamento)+'</span>' ;  }, ++count),    
        getColumnFunction(function (a, b) { return '<span class="money">R$ '+formatDouble(a.valorPrevisto)+'</span>' ;  }, ++count),    
        getColumnFunction(function (a, b) { return '<span class="money">R$ '+formatDouble(a.valor)+'</span>' ;  }, ++count),    
        getColumnFunction(function (a, b) { return (a.categoria.codigo == 76 || a.listParcela.length > 0 ? '': getBotaoEditar('mpLancamento') )+ '&nbsp;&nbsp;&nbsp;' +
        					                 getBotaoVisualizar('mpVisualizar')+ '&nbsp;&nbsp;&nbsp;' + getBotaoExcluir('mpExcluir'); }, ++count)  
    ];   
      


    $scope.pesquisar = function () {   
    	var config = {params: {"codCategoriaPai":$scope.codCategoriaPai,"codCategoria": ''+$scope.filtro.codCategoria, "periodo":$scope.filtro.periodo.val()}}; 
    	$scope.LancamentoService.pesquisar("/listar", $scope.resultList, config); 
    };

    $scope.resultList = function (data) {   
		 if($scope.tabela){ 
			 $scope.tabela.fnClearTable();
			 $scope.tabela.fnAddData(data); 
		 }else{
			 $scope.tabela = createTable("lista", data, $scope.colunas, $scope.onclick);
		 }
    };

    $scope.saveOrUpdate = function (mpForm) {   
    	$scope.error = !mpForm.$valid; 
		if ($scope.error) {  
			return;
		} 
		if($scope.validar()){ 
			$('#mpLoading').modal('show');   

			if ($scope.lancamento.codigo == null) {
		        var config = {params: {"codFormaPagamento":$scope.codFormaPagamento,"numParcelas": ''+$scope.numParcelas}}; 
				$scope.LancamentoService.salvar(null, $scope.lancamento, config, 'mpLancamento', function (obj) {$scope.clean(); $scope.pesquisar();});
			}else{
				$scope.LancamentoService.alterar(null, $scope.lancamento, {}, 'mpLancamento', function (obj) {$scope.clean(); $scope.pesquisar();});
			}  
			 
		}else{
			return;
		} 
    	
    };
	
    $scope.validar = function () {   
		$scope.error = false;
		var msg = '';  

    	if($scope.lancamento.valor <= 0){ 
			msg += 'O campo "Valor" tem que ser maior que 0. <BR>';
			$scope.error = true;
    	}
    	
    	if($scope.codFormaPagamento > 0){
    		if(!$scope.numParcelas || $scope.numParcelas < 1){
    			msg += 'O campo "Em quantas parcelas" tem que ser maior que 0. <BR>';
    			$scope.error = true;
    		}  
    	}
    	
    	if($scope.lancamento.categoria.codigo == 76){
    		if(!$scope.lancamento.cartaoCredito.codigo || $scope.lancamento.cartaoCredito.codigo == 0){
    			msg += 'O campo "Cartão de Crédito" é obrigatório para a categoria "Pagamento de Fatura".<BR>';
    			$scope.error = true;
    		}

    		if(!$scope.lancamento.dataFatura){
    			msg += 'O campo "Data de Vencimento de Fatura" é obrigatório para a categoria "Pagamento de Fatura".<BR>';
    			$scope.error = true;
    			
    		}

    		if($scope.lancamento.listParcelaFatura.length == 0){
    			msg += 'Não existe parcelas para compor o pagamento da fatura.<BR>';
    			$scope.error = true;
    			
    		}
    	}

		if($scope.error){ 
			 showMessage(false, msg); 
		}
    	return !$scope.error;
    };

    
	 
    $scope.remove = function () {    
		$scope.LancamentoService.excluir('/'+ $scope.lancamento.codigo, {}, 'mpExcluir', function () {$scope.clean(); $scope.pesquisar();});
    }; 
    
    $scope.onclick = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {       
        $('td:eq('+count+')', nRow).bind('click', function() {
            $scope.$apply(function() {    
        		var tempEntity = angular.copy(aData);
        		$scope.lancamento = tempEntity;  
        		$scope.alterar();
            });
        });
        return nRow;
    }; 
 

    $scope.alterar = function () {     
    	$scope.error = false; 
    	$scope.lancamento.dataLancamento = new Date($scope.lancamento.dataLancamento);  
    	$scope.lancamento.dataReferencia = new Date($scope.lancamento.dataReferencia);    
    	$scope.codCategoriaPai = $scope.lancamento.categoria.categoriaPai.codigo; 
    	$scope.listCategoriasFilhas = new Array();
    	$scope.setSubCategorias(); 

    	$.each($scope.listTags, function(index, t) {   
        	t.check = false ;
    	});
    	
    	$.each($scope.listTags, function(index, t) {  
        	$.each($scope.lancamento.listTags, function(index, t2) {  
        		if(t.codigo == t2.codigo){
        			t.check = true ;
        		}
        	});
    	});
    };
    
    $scope.novo = function () {    
    	$scope.error = false; 
    	$scope.lancamento = {};  
    	$scope.lancamento.dataReferencia = new Date();  
    	$scope.lancamento.listTags = new Array();
    	$scope.numParcelas = 1; 
    	$scope.codFormaPagamento = 0; 
    	$scope.codCategoriaPai = null; 

    	$.each($scope.listTags, function(index, t) {   
        	t.check = false ;
    	});
    	
        $('#mpLancamento').modal('show');
    };
      

    $scope.setTag = function (tag) {  
    	var set = false; 
    	$.each($scope.lancamento.listTags, function(index, t) {  
    		if(t.codigo == tag.codigo){
    			set = true ;
    		} 
    	});
    	if(!set && tag.check){
    		$scope.lancamento.listTags[$scope.lancamento.listTags.length] = tag; 
    	}
    	if(set && !tag.check){
    		var list = new Array(); 
    		var i = -1;
        	$.each($scope.lancamento.listTags, function(index, t) {  
        		if(t.codigo != tag.codigo){
        			list[++i] = t ;
        		} 
        	});
        	
    		$scope.lancamento.listTags = list;
    	}
    };

    /*#######################################################################################
     #                 FATURA                                                               #  
     #######################################################################################*/

    $scope.preencheVencimentos = function () {    
    	if($scope.lancamento.cartaoCredito.codigo > 0){
            var config = {params: {"codCartaoCredito":$scope.lancamento.cartaoCredito.codigo}}; 
        	$scope.LancamentoService.pesquisar("/listarDatasFaturas", function (data) {$scope.listVencimentos = data;}, config); 
    	} 
    };

    
    $scope.pesquisarParcelas = function () {    
		$scope.lancamento.listParcelaFatura = new Array();
		$scope.lancamento.valor = 0; 
		$scope.lancamento.valorPrevisto = 0;
		
    	if($scope.vencimentoFatura.dataReferencia == null){
    		$scope.lancamento.dataFatura = stringToDate($scope.vencimentoFatura.dataFatura) ;
    		var config = {params: {"codCartaoCredito":$scope.lancamento.cartaoCredito.codigo,"dataReferencia": ''+$scope.formatDate($scope.lancamento.dataFatura)}}; 
    		$scope.ParcelaService.pesquisar("/listarPorCartaoCredito", $scope.resultListarPorCartaoCredito, config); 
    	}

    };  

    $scope.resultListarPorCartaoCredito = function (data) {    
		$scope.lancamento.listParcelaFatura = data;
		var total = 0;
		$.each(data, function(index, p) {   
			total += p.valor;
		}); 
		$scope.lancamento.valor = parseFloat(total.toPrecision(12)); 
		$scope.lancamento.valorPrevisto = parseFloat(total.toPrecision(12)); 
    };
    
    $scope.getClass = function () { 
    	if($scope.lancamento && $scope.lancamento.categoria && $scope.lancamento.categoria.codigo == 76){
    		return 'col-xs-8';
    	} 
    	return 'col-xs-12'; 
    };

    $scope.isFatura = function () {  
    	if($scope.lancamento && $scope.lancamento.categoria && $scope.lancamento.categoria.codigo == 76){
    		$('#mpLancamento').addClass('modal800');  
    		$scope.codFormaPagamento = 0;
    		$scope.numParcelas = 1;
    		
    	}else if($scope.lancamento && $scope.lancamento.categoria && $scope.lancamento.categoria.codigo == 71){
    		$scope.lancamento.dataFatura = new Date();
    		$scope.codFormaPagamento = 1;
    		$scope.numParcelas = 1;
    	}else{  
    		$scope.numParcelas = 1;
    		$scope.codFormaPagamento = 0;
    		$scope.listVencimentos = new Array(); 
    		$scope.lancamento.dataFatura = null;
    		$scope.lancamento.cartaoCredito = null;
    		$scope.lancamento.listParcelaFatura = new Array();
    		$('#mpLancamento').removeClass('modal800');  
    	}
    };
    
    /*#######################################################################################
     #                 PARÂMETROS                                                           #  
     #######################################################################################*/
 

    $scope.setSubCategorias = function() {     
    	$scope.filtro.codCategoria = null;
    	$scope.listCategoriasFilhas = new Array();
    	if($scope.codCategoriaPai){
    		var i = -1;
    		$.each($scope.listCategorias, function(index, c) {  
    			if(c.categoriaPai && c.categoriaPai.codigo == $scope.codCategoriaPai && (c.codigo != 52 && c.codigo != 74 && c.codigo != 47)){ 
    				$scope.listCategoriasFilhas[++i] = c; 
    			}
    		});    
    	}
    };
 
    
    $scope.clean = function () { 
    	$scope.codFormaPagamento = 0; 
    	$scope.numParcelas = null; 
    	$scope.codCategoriaPai = null; 
    	$scope.filtro.codCategoria = null;  
    	$scope.filtro.periodo.val(moment().format('DD/MM/YYYY') + ' a ' + moment().format('DD/MM/YYYY')); 
        $scope.lancamento = {};
    };    

    $scope.formatDouble = function (valor) {      
    	return formatDouble(valor) ;  
    };
    

    $scope.formatDate = function (date) {      
    	return moment(date).format('DD/MM/YYYY') ; 
    };
    /*#######################################################################################
     #                 Construtor de pobre                                                  #  
     #######################################################################################*/

    $scope.init = function () {    
    	
        $scope.listFormaPagamentos[0] = {'codigo' : 0, 'nome' : 'À Vista'};
        $scope.listFormaPagamentos[1] = {'codigo' : 1, 'nome' : 'Carnê'};
        $scope.filtro.periodo = $('#periodo').daterangepicker(daterangepickerOptions);
    	$scope.filtro.periodo.val(moment().format('DD/MM/YYYY') + ' a ' + moment().format('DD/MM/YYYY')); 
        
        for(var i = 1; i <= 60; i++){
        	$scope.listNumParcelas[i] = {'numero': i, 'nome': i+''};
        }
        


    	$scope.Parametros.pesquisar("/listCategorias", resultListCategorias); 
    	
    	$scope.Parametros.pesquisar("/listTags", resultListTags); 
    	
    	$scope.Parametros.pesquisar("/listCartaoCredito", resultCartaoCredito); 
    }; 


    function resultListCategorias(data) {     
	    $scope.listCategorias = data; 
	    var i = -1;
		$.each(data, function(index, c) {  
			if(!c.categoriaPai){ 
				 $scope.listCategoriasPai[++i] = c; 
			}
		});   
    }

    function resultListTags(data) {      
    	$scope.listTags = data;  
    }
    

    function resultCartaoCredito(data) {     
    	$scope.listCartaoCredito = data;  
    	
    	var i = $scope.listFormaPagamentos.length - 1;
    	$.each(data, function(index, c) {  
    		$scope.listFormaPagamentos[++i] = {'codigo' : c.codigo, 'nome': c.bandeira+' '+c.numero, 'cartao':c}; 
    	});   
    }

    $scope.init(); 
}; 


																																																								// ; i

 