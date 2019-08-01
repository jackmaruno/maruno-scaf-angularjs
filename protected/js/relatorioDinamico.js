 
function relatorioDinamicoCtrl($scope, $location, $http, $timeout, ngTreetableParams) {    
   
     
	$scope.lista = new Array();
	$scope.listRelatorioDinamico = new Array();
	$scope.tree = new Array();

	$scope.filtros = new Array(); 
	$scope.grupos = new Array();
	$scope.listTags = new Array();
	$scope.listCategorias = new Array();
	$scope.meses = new Array();
  
	$scope.formatoCompetencia = 'YYYY/MM';

    $scope.getFiltroClass = function (filtro) {       
    	if(filtro.check == 1){
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


	function getNomeGrupo(id){
		if(id == 1){
			return "Pagamentos Agendados"; 
		}else if(id == 2){
			return "Parcelas"; 
		}else if(id == 3){
			return "Despesas Gerais"; 
		}else if(id == 4){
			return "Receitas"; 
		}else if(id == 5){
			return "Faturas"; 
		} 
		return "";
	}
 

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
	
	function addMeses(nome){
		var set = false;  
		$.each($scope.meses, function(i, o) {   
			if(o.nome == nome){
				set = true; 
			}
		});  
		
		if(!set){
			$scope.meses[$scope.meses.length] = {codigo:$scope.meses.length, nome:nome, check: 1, valor: 0.00, valorReceita: 0.00};
		} 
	}


    function getkeys(lista) {     
    	var keys = new Array();
		$.each(lista, function(i, o) {   
			keys[i] = o.nome ;
		});   
    	return keys;
    }
 /*
  
Morris.Bar({
  element: 'bar-example',
  data: [
  
    { y: 'Moradia', a: 100},
    { y: 'Dependentes', a: 75},
    { y: 'Coisas Pessoais', a: 50},
    { y: 'Alimentação', a: 75},
    { y: 'Saúde e Cuidados', a: 50},
    { y: 'Transporte', a: 75},
    { y: 'Lazer', a: 100}
  ],
  xkey: 'y',
  ykeys: ['a'],
  labels: ['Pago']
}); 
  * */
    
    function getBarCharts(list) {     
    	var dados  = new Array();
    	$.each(list, function(i, o) {    
    		dados[dados.length] = {y: o.nome, valorPrevisto: o.valorPrevisto, valorPago: o.valorPago};
    	});    
    	return dados;
    } 
   
    function getBarChart(desc, lista) {     
    	var obj = {y: desc}; 

		$.each(lista, function(i, o) {   
	    	obj[o.nome] = o.valorPago;
		});     
    	return obj;
    }
    
    var chartCategorias = null;
    
    function gerarChartCategorias() {     
/*
    	var listChartCategorias = new Array();
    	 
    	
		$.each($scope.tree, function(i, mes) {   
			
			$.each(mes.lista, function(i, cat) {   
				
				var set = false;
				$.each(listChartCategorias, function(i, chart) {   
					if(chart.nome == cat.nome){ 
						chart.valorPrevisto = chart.valorPrevisto + cat.valorPrevisto;
						chart.valorPago = arredDouble(chart.valorPago + cat.valorPago);
						set = true;
					}
				});     
				if(!set){ 
					listChartCategorias[listChartCategorias.length] = {nome: cat.nome, valorPrevisto:cat.valorPrevisto, valorPago: cat.valorPago};
				}  
			});     
			 
		});      
		
		document.getElementById('x').innerHTML += listToString(getBarCharts(listChartCategorias)) + "</br></br>";
			
		//Morris.Bar('chartCategorias').setData(listChartCategorias);
		if(!chartCategorias){
			chartCategorias = new Morris.Bar({
				element: 'chartCategorias',
				resize: true,
				data: [ getBarCharts(listChartCategorias) ],
				//  barColors: getColors($scope.listChartAtividatesMes),
				xkey: 'y',
				ykeys: ['valorPrevisto', 'valorPago'],
				labels: ['Valor Previsto', 'Valor Pago'],
			    parseTime: false,
				hideHover: true
			}); 
			
		}else{
			chartCategorias.setData(getBarChart('Categorias', listChartCategorias));  
		}
*/
    }
    
    function getTags(t){
    	var txt = '';
    	if(t.lisTags && t.lisTags.length > 0){
    		for(var i = 0; i < t.lisTags.length; i++){
    			txt += ""+t.lisTags[i].nome+', ' ;
    		} 
    		txt = txt.substring(0, txt.length - 2);
    	}
		return txt;
    }
	
	function getNode(nome, tipo){ 
		return {nome: nome, 
		        tipo: tipo,
		        grupo: '-',
		        codCategoria: 0,
		        competencia: '-', 
		        dataReferencia: '-', 
		        dataLancamento: '-',
				valorPrevisto: 0.0,
				valorPago: 0.0,
				tags: '-',
				listTags : [],
				lista: new Array()
			}; 
	} 
		 
	function getNodeLancamento(o){ 
		return {     
			nome: o.codLancamento + '', 
			tipo: 'Lançamento',
			grupo: getNomeGrupo(o.codTipo),
			codCategoria: o.codCategoria,
	        competencia: moment(o.dataReferencia).format($scope.formatoCompetencia), 
			dataReferencia: formatDate(o.dataReferencia), 
			dataLancamento: moment(o.dataLancamento).format('DD/MM/YYYY HH:mm:ss') ,
			valorPrevisto: o.valorPrevisto, 
			valorPago: o.valorPago,
			tags: getTags(o),
			listTags: o.lisTags,
			lista:[]
		}; 
	}

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
				selecionarTodos(filtro.check, o.listSubCategorias);
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
			$.each(catPai.listSubCategorias, function(i, cat) {   
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
			$.each(catPai.listSubCategorias, function(i, cat) {   
				if(cat.codigo == lancamento.codCategoria){  
					catPai.valor = catPai.valor + lancamento.valorPago;
					cat.valor = cat.valor + lancamento.valorPago;
				} 
			}); 
		});
	}
	
    /*#######################################################################################
    #                         INIT                                                          #
    ########################################################################################*/
    
    $scope.init = function () {   
    	
    	addToList($scope.filtros, 1, 'Grupos');
    	addToList($scope.filtros, 2, 'Marcadores/Tags');
    	addToList($scope.filtros, 3, 'Meses');
    	addToList($scope.filtros, 4, 'Categorias');
    	 
    	$scope.RelatorioService.pesquisar("/relatorioDinamico", resultRelatorioDinamico);  
    };
    
	 
	
    function resultRelatorioDinamico(data) {      
    	$scope.listRelatorioDinamico = data;  
    	$scope.lista = data;  

    	$scope.grupos = new Array();
    	$scope.listTags = new Array();
    	$scope.listCategorias = new Array();
    	$scope.meses = new Array();

		addToList($scope.listTags, 0, 'Sem Marcador'); 
		$.each($scope.lista, function(i, o) {   
			addToList($scope.listCategorias, o.codCategoriaPai, o.nomeCategoriaPai);
			addToList($scope.grupos, o.codTipo, getNomeGrupo(o.codTipo));
			addMeses(moment(o.dataReferencia).format('YYYY/MM'));  

			
			$.each(o.lisTags, function(i3, t) {   
				addToList($scope.listTags, t.codigo, t.nome); 
			});
		});   
		


		$.each($scope.listCategorias, function(i2, c) {   
			c.listSubCategorias = new Array();
			$.each($scope.lista, function(i, o) {    
				if(o.codCategoriaPai == c.codigo){
					addToList(c.listSubCategorias, o.codCategoria, o.nomeCategoria);  
				}
			});
		});
		atualizar();
    }
 
	
    function validar(lancamento) {    
    	var set = true;
		$.each($scope.meses, function(i, mes) {   
			if(mes.nome == lancamento.competencia && mes.check == 0){
//				document.getElementById('x').innerHTML += lancamento.nome + ' - '+mes.nome + "</br>";
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
			$.each(catPai.listSubCategorias, function(i, cat) {   
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
		
		$.each($scope.meses, function(i, m) { 
			var root = getNode(m.nome, 'Competência');
	 
			$.each($scope.listCategorias, function(i, categoriaPai) {    
				var cat = getNode(categoriaPai.nome, 'Categoria');
				
				$.each(categoriaPai.listSubCategorias, function(i, categoria) {    
					var catFilha = getNode(categoria.nome, 'SubCategoria'); 

					$.each($scope.lista, function(i, o) {    
						if(moment(o.dataReferencia).format('YYYY/MM') == root.nome && o.codCategoria == categoria.codigo){
							var lancamento = getNodeLancamento(o); 
							if(validar(lancamento)){
								somarNode(catFilha, lancamento);
								somarAnalitico(lancamento);
								catFilha.lista[catFilha.lista.length] = lancamento;
							}
						}
					});  
					if(catFilha.lista.length > 0){
						somarNode(cat, catFilha);
						cat.lista[cat.lista.length] = catFilha;
					}
				});  
 
				if(cat.lista.length > 0){
					somarNode(root, cat);
					root.lista[root.lista.length] = cat;
				}
			});  

			if(root.lista.length > 0){ 
				$scope.tree[$scope.tree.length] = root;
			}
		}); 
		
		$scope.dynamic_params.refresh(); 
		gerarChartCategorias();
    } 
    
    $scope.init(); 
 


} 
 