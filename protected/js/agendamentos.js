

function agendamentosCtrl($scope, $location, $http) {    
  
	
    $scope.agendamento = {};
    $scope.tabela;

    $scope.listCategorias = new Array();
    $scope.listCategoriasPai = new Array();
    $scope.listCategoriasFilhas = new Array();
	$scope.codCategoriaPai;
	
	$scope.listTags = new Array();
	$scope.listPeriodos = new Array();

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
    
    $scope.columnDefs = [ 
        getColumn("codigo", ++count),   
        getColumn("nome", ++count),   
        getColumn("periodo.nome", ++count),   
        getColumn("categoria.nome", ++count),    
        getColumnFunction(function (a, b) { return getTags(a); }, ++count),    
        getColumnFunction(function (a, b) { return '<span>'+formatDate(a.dataCadastro)+'</span>' ;  }, ++count),    
        getColumnFunction(function (a, b) { return '<span>'+formatDate(a.dataInicio)+'</span>' ;  }, ++count),     
        getColumnStatus(++count),  
        getColumnFunction(function (a, b) { return  getBotaoStatus('mpStatusAgendamento', a) + '&nbsp;&nbsp;&nbsp;' +  getBotaoEditar('mpAgendamento')   ; }, ++count) 
    ];   

    $scope.saveOrUpdate = function (mpForm) {   
		if (!mpForm.$valid) {
			$scope.displayValidationError = true;  
			return;
		}  
		if (!$scope.agendamento.codigo) {
			$scope.AgendamentoService.salvar(null, $scope.agendamento, {}, 'mpAgendamento', function (obj) {$scope.AgendamentoService.pesquisar("/list", $scope.resultList );});
		}else{
			$scope.AgendamentoService.alterar(null, $scope.agendamento, {}, 'mpAgendamento', function (obj) {$scope.AgendamentoService.pesquisar("/list", $scope.resultList );});
		}  
    };

	$scope.alterStatus = function () {   
		$scope.agendamento.ativo = $scope.agendamento.ativo+'' == 'true' ? 'false':'true';
		$scope.AgendamentoService.alterar(null, $scope.agendamento, {}, 'mpStatusAgendamento', function (obj) {$scope.AgendamentoService.pesquisar("/list", $scope.resultList );});
	};
	
	
    $scope.onclick = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {       
        $('td:eq('+count+')', nRow).bind('click', function() {
            $scope.$apply(function() {    
        		var tempEntity = angular.copy(aData);
        		$scope.agendamento = tempEntity;
        		$scope.alterar();
            });
        });
        return nRow;
    }; 
 
    $scope.alterar = function () {     
    	$scope.agendamento.dataInicio = new Date($scope.agendamento.dataInicio);
    	$scope.codCategoriaPai = $scope.agendamento.categoria.categoriaPai.codigo; 
    	$scope.listCategoriasFilhas = new Array();
    	$scope.setSubCategorias(); 

    	$.each($scope.listTags, function(index, t) {   
        	t.check = false ;
    	});
    	
    	$.each($scope.listTags, function(index, t) {  
        	$.each($scope.agendamento.listTags, function(index, t2) {  
        		if(t.codigo == t2.codigo){
        			t.check = true ;
        		}
        	});
    	});
    	
    };

    $scope.setTag = function (tag) {  
    	var set = false; 
    	$.each($scope.agendamento.listTags, function(index, t) {  
    		if(t.codigo == tag.codigo){
    			set = true ;
    		} 
    	});
    	if(!set && tag.check){
    		$scope.agendamento.listTags[$scope.agendamento.listTags.length] = tag; 
    	}
    	if(set && !tag.check){
    		var list = new Array(); 
    		var i = -1;
        	$.each($scope.agendamento.listTags, function(index, t) {  
        		if(t.codigo != tag.codigo){
        			list[++i] = t ;
        		} 
        	});
        	
    		$scope.agendamento.listTags = list;
    	}
    };
    
    $scope.novo = function () {    
    	$scope.agendamento = {}; 
    	$scope.agendamento.ativo = true; 
    	$scope.agendamento.listTags = new Array();
    	$scope.codCategoriaPai = 1; 
    	$scope.listCategoriasFilhas = new Array();
    	$scope.setSubCategorias(); 
        $('#mpAgendamento').modal('show');
        

    	$.each($scope.listTags, function(index, t) {   
        	t.check = false ;
    	});
    };

    $scope.setSubCategorias = function() {     
	    var i = -1;
    	$.each($scope.listCategorias, function(index, c) {  
    		if(c.categoriaPai && c.categoriaPai.codigo == $scope.codCategoriaPai){ 
				 $scope.listCategoriasFilhas[++i] = c; 
    		}
    	});   
    };
    
    $scope.init = function () {     
    	$scope.AgendamentoService.pesquisar("/list", resultList ); 

    	$scope.Parametros.pesquisar("/listPeriodos", function (data) {$scope.listPeriodos = data;}); 
    	
    	$scope.Parametros.pesquisar("/listCategorias", resultListCategorias); 
    	
    	$scope.Parametros.pesquisar("/listTags", resultListTags); 
  
    }; 

    function resultList(data) {    
		if($scope.tabela){ 
			$scope.tabela.fnClearTable();
			$scope.tabela.fnAddData(data); 
		}else{
			$scope.tabela = createTable("lista", data, $scope.columnDefs, $scope.onclick);
		}
    }

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
    	$.each(data, function(index, t) {  
    		t.check = false ;
    	});
    	$scope.listTags = data;  
    }

    
    $scope.init();
}; 
 