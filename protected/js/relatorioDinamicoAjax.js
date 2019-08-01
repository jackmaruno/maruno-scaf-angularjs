 
function relatorioDinamicoCtrl($scope, $location, $http, $timeout, ngTreetableParams) {    
   
     
	$scope.lista = new Array();
	$scope.listRelatorioDinamico = new Array();
	$scope.tree = new Array();

	$scope.filtros = new Array(); 
	$scope.grupos = new Array();
	$scope.listTags = new Array();
	$scope.listCategorias = new Array();
	$scope.meses = new Array();
  
	$scope.formatoCompetencia = 'YYYY/MMMMM';

    $scope.getFiltroClass = function (filtro) {        
    	if(filtro && filtro.check == 1){
			return 'glyphicon glyphicon-check' ; 
    	}
    	return 'glyphicon glyphicon-unchecked' ;
    };  
    
    $scope.getButtonClass = function (btn) {       
    	if(btn.check == 1){
    		return 'btn-success' ; 
    	}
    	return '' ;
    };  
 

    

	function addToList(lista, codigo, nome){
		var set = false;  
		$.each(lista, function(i, o) {   
			if(o.codigo == codigo){
				set = true; 
			}
		});  
		
		if(!set){
			lista[lista.length] = {codigo:codigo, nome:nome, check: 1, valor: 0.00, valorReceita: 0.00};
		} 
	}
	
    $scope.dynamic_params = new ngTreetableParams({
        getNodes: function(parent) {
            return parent ? parent.lista : $scope.tree;
        },
        getTemplate: function(node) {
            return 'tree_node';
        },
        options: {
          //  initialState: 'expanded'
        }
    });

 

	function somarNode(o1, o2){ 
		o1.valorPrevisto = o1.valorPrevisto + o2.valorPrevisto;
		o1.valorPago = o1.valorPago + o2.valorPago; 
	}

    $scope.selecionar = function (btn) {   
    	btn.check = btn.check == 1 ? 0 : 1;
    	atualizar();
    };
    
    function selecionarTodos(check, lista) {    
		$.each(lista, function(i, o) {   
			o.check = check;
		});
    } 
    $scope.selecionarFiltro = function (filtro) {   
    	filtro.check = filtro.check == 1 ? 0 : 1;

		if(filtro.codigo == 1){ 
			selecionarTodos(filtro.check, $scope.grupos);
		}else if(filtro.codigo == 2){ 
			selecionarTodos(filtro.check, $scope.listTags);
		}else if(filtro.codigo == 3){ 
			selecionarTodos(filtro.check, $scope.meses);
		}else if(filtro.codigo == 4){ 
			$.each($scope.listCategorias, function(i, o) {    
				selecionarTodos(filtro.check, o.lista);
			});
		} 
    	atualizar();
    };


	function cleanAnalitico(){    
		$.each($scope.meses, function(i, mes) {   
			mes.valor = 0.0;
			mes.valorReceita = 0.0;
		});

		$.each($scope.grupos, function(i, grupo) {   
			grupo.valor = 0.0; 
			grupo.valorReceita = 0.0; 
		});

		$.each($scope.listTags, function(i, tag) {    
			tag.valor = 0.0;  
			tag.valorReceita = 0.0;  
		}); 

		$.each($scope.listCategorias, function(i, catPai) {   
			catPai.valor = 0;  
			catPai.valorReceita = 0;  
			$.each(catPai.lista, function(i, cat) {   
				cat.valor = 0.0;  
				cat.valorReceita = 0.0;  
			}); 
		});
	}


	function somarAnalitico(lancamento){    
		$.each($scope.meses, function(i, mes) {   
			if(mes.nome == lancamento.competencia){  
				if(lancamento.grupo == "Receitas"){
					mes.valorReceita = mes.valorReceita + lancamento.valorPago;
					
				}else{
					mes.valor = mes.valor + lancamento.valorPago;
				}
			} 
		});

		$.each($scope.grupos, function(i, grupo) {   
			if(grupo.nome == lancamento.grupo){ 
				grupo.valor = grupo.valor + lancamento.valorPago;
			} 
		});

		if(lancamento.listTags.length == 0){  
			if(lancamento.grupo == "Receitas"){ 
				$scope.listTags[0].valorReceita = $scope.listTags[0].valorReceita + lancamento.valorPago;
				
			}else{
				$scope.listTags[0].valor = $scope.listTags[0].valor + lancamento.valorPago;
			}
			
		}else{ 
			$.each($scope.listTags, function(i, tag) {    
				$.each(lancamento.listTags, function(i, tl) {  
					if(tag.codigo == tl.codigo){     

						if(lancamento.grupo == "Receitas"){ 
							tag.valorReceita = tag.valorReceita + lancamento.valorPago;
							
						}else{
							tag.valor = tag.valor + lancamento.valorPago;
						}
						
					}  
				});
			}); 
		}

		$.each($scope.listCategorias, function(i, catPai) {   
			$.each(catPai.lista, function(i, cat) {   
				if(cat.codigo == lancamento.codCategoria){  
					catPai.valor = catPai.valor + lancamento.valorPago;
					cat.valor = cat.valor + lancamento.valorPago; 
				} 
			}); 
		});
	}

	function getNode(obj){ 
		var n = angular.copy(obj);
		n.valorPrevisto = 0.00;
		n.valorPago = 0.00;  
		n.lista = new Array();
		return n;
	}

	
    function validar(lancamento) {    
    	var set = true; 
		$.each($scope.meses, function(i, mes) {   
			if(mes.nome == lancamento.competencia && mes.check == 0){ 
				set = false;
			} 
		});
		
		$.each($scope.grupos, function(i, grupo) {   
			if(grupo.nome == lancamento.grupo && grupo.check == 0){ 
				set = false; 
			} 
		});
		
		var countAll = 0, countUncheck = 0;
		$.each(lancamento.listTags, function(i, tl) {     
			$.each($scope.listTags, function(i, tag) {   
				if(tag.codigo == tl.codigo){   
					countAll++; 
					if(tag.check == 0){ 
						countUncheck++;  
					}
				} 
			}); 
			
		});
		
		if(countUncheck > 0 && countUncheck == countAll){ 
			set = false; 
		} 

		if($scope.listTags[0].check == 0 && lancamento.listTags.length == 0){  
			set = false; 
		}
		
		$.each($scope.listCategorias, function(i, catPai) {   
			$.each(catPai.lista, function(i, cat) {   
				if(cat.codigo == lancamento.codCategoria && cat.check == 0){ 
					set = false; 
				} 
			}); 
		});
	 
    	return set;
    }

    
    function atualizar() {    
    	cleanAnalitico(); 
    	$scope.tree = new Array();
 
		
		$.each($scope.root, function(i, m) { 
			var mes = getNode(m);
			$.each(m.lista, function(i, c) { 
				var cat = getNode(c);
				$.each(c.lista, function(i, sCat) { 
					var subCat = getNode(sCat);
					$.each(sCat.lista, function(i, lancamento) { 
//						document.getElementById('x').innerHTML += lancamento.nome + '<BR>';
						if(validar(lancamento)){ 
							somarNode(subCat, lancamento);
							somarAnalitico(lancamento);
							subCat.lista[subCat.lista.length] = lancamento;
						}
					}); 
					if(subCat.lista.length > 0){
						somarNode(cat, subCat);
						cat.lista[cat.lista.length] = subCat;
					}
				}); 
				if(cat.lista.length > 0){
					somarNode(mes, cat);
					mes.lista[mes.lista.length] = cat;
				}
			});

			if(mes.lista.length > 0){ 
				$scope.tree[$scope.tree.length] = mes;
			}
		}); 
		
		$scope.dynamic_params.refresh();  
    } 
    
    /*#######################################################################################
    #                         INIT                                                          #
    ########################################################################################*/
    
    $scope.init = function () {    
    	$scope.RelatorioService.pesquisar("/relatorioDinamico2", resultRelatorioDinamico2); 
    };
     
    function resultRelatorioDinamico2(dto) {      
    	$scope.listRelatorioDinamico = dto.lista;  
    	$scope.lista = dto.lista;  
    	$scope.tree = dto.root;
    	$scope.root = dto.root;

    	$scope.filtros = dto.listFiltros;
    	$scope.grupos = dto.listGrupos;
//    	$scope.listTags = dto.listTags;
    	$scope.listCategorias = dto.listCategorias;
    	$scope.meses = dto.listMeses;  

		addToList($scope.listTags, 0, 'Sem Marcador');  

		$.each(dto.listTags, function(i, t) { 
			$scope.listTags[i +1] = t;
		});
		
		cleanAnalitico();
		$.each($scope.tree, function(i, mes) { 
			$.each(mes.lista, function(i, cat) { 
				$.each(cat.lista, function(i, subCat) { 
					$.each(subCat.lista, function(i, l) { 
					
                        l.competencia = moment(l.dataReferencia).format('YYYY/MMMMM'); 
						somarAnalitico(l);
					});
				});
			});
		});
		
		$scope.dynamic_params.refresh(); 
    }
    
    $scope.init();  
 


} 
 