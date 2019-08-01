function lancamentosAdmCtrl($scope,$location, $http) {     
	 
    $scope.lancamento = {};
    $scope.tabela; 
	$scope.codCategoriaPai;  
	$scope.filtro = {}; 
	$scope.error = false;   
	
    $scope.listUsuarios = new Array();
    $scope.listCategorias = new Array();
    $scope.listCategoriasPai = new Array();
    $scope.listCategoriasFilhas = new Array();  

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
        getColumn("usuario.nome", ++count),   
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
    	var config = {params: {"codUsuario":$scope.codUsuario,"codCategoriaPai":$scope.codCategoriaPai,"codCategoria": ''+$scope.filtro.codCategoria, "periodo":$scope.filtro.periodo.val()}}; 
    	$scope.LancamentoService.pesquisar("/listarAll", $scope.resultList, config); 
    };

    $scope.resultList = function (data) {   
		 if($scope.tabela){ 
			 $scope.tabela.fnClearTable();
			 $scope.tabela.fnAddData(data); 
		 }else{
			 $scope.tabela = createTable("lista", data, $scope.colunas, $scope.onclick);
		 }
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
   
    /*#######################################################################################
     #                 Construtor de pobre                                                  #  
     #######################################################################################*/

    $scope.init = function () {     
        $scope.filtro.periodo = $('#periodo').daterangepicker(daterangepickerOptions);  
    	$scope.filtro.periodo.val(moment().format('DD/MM/YYYY') + ' a ' + moment().format('DD/MM/YYYY')); 
    	$scope.Parametros.pesquisar("/listCategorias", resultListCategorias);  
    	$scope.UsuarioService.pesquisar("/list", resultUsuarios);  
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

    function resultUsuarios(data) {   
	    $scope.listUsuarios = data; 
    }
    $scope.init(); 
}; 


																																																								// ; i

 