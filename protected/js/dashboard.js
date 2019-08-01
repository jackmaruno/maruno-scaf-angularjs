 
function dashboardCtrl($scope, $location, $http, $timeout) {    
  
	$scope.listResumoMes  = new Array();    
	$scope.resumoMeses = {};
    
	$scope.listProximasAtividades  = new Array();
	$scope.listProximasAtividadesTemp  = new Array();   
	$scope.paginaProximasAtividades = 1;

	$scope.listaDespesasReceitas  = new Array();  

	$scope.listaAgendaAtual  = new Array();  



	$scope.listUltimasAtividades  = new Array();
	$scope.listUltimasAtividadesTemp  = new Array();  

	$scope.rows = 6;
	$scope.pagina = 1;

	$scope.listChartAtividatesMes  = new Array();
	

    $scope.agenda = {};
    
	$scope.resumo = {};

	$scope.listMaisInformacoes  = new Array();

	$scope.lancamento = {};
	$scope.codCategoriaPai; 
    $scope.listCategorias = new Array();
    $scope.listCategoriasPai = new Array();
    $scope.listCategoriasFilhas = new Array(); 
	$scope.listTags= new Array();

    $scope.paginasProximasAtividades;
    $scope.paginasUltimasAtividades;
    
    function newArray(rows, page) {   
    	var v = new Array();
		for(var i = 0; i < (rows / page); i++){
			v[i] = i + 1;
		}
    	return v;
    }

    /*#######################################################################################
    #                         RESUMO DO MÊS                                                 #
    ########################################################################################*/
    
    $scope.getTitleResumoMes = function (r) {       
    	if(r.descricao == 'Parcelas' || r.descricao == 'Agendamentos'){
			return 'Total Previsto:	' +formatDouble(r.valorPrevisto) + ' \nTotal Pago:	' +formatDouble(r.valor); 
    	}
    	return 'Total:	' +formatDouble(r.valor) ; 
    };   
    
    $scope.showModalMaisInformacoes = function (r) {   
    	$scope.resumo = r;  
    	
		$scope.listMaisInformacoes = new Array(); 
		
		var config = {params: {"codTipo": $scope.resumo.codTipo}};   
        $scope.DashBoardService.pesquisar("/listarRelacaoLancamentos", resultListarRelacaoLancamentos, config); 
         
    };

    function getColunasMaisInformacoes(){ 
    	var i = -1; 
    	$scope.colunasMaisInformacoes = new Array();  
    	$scope.colunasMaisInformacoes[++i] = getColumnFunction(function (o) { return '<span class="esquerda">'+(o.codTipo == 1 ? o.nomeAgendamento+' - ' : o.codTipo == 2 ? 'Nº'+o.numParcela+' - ' : '') +  o.desCategoria+'</span>' ;  }, i) ;
    	$scope.colunasMaisInformacoes[++i] = getColumn("tags", i) ;
    	$scope.colunasMaisInformacoes[++i] = getColumn("dataReferencia", i) ;
    	$scope.colunasMaisInformacoes[++i] = getColumn("dataLancamento", i) ;
    	$scope.colunasMaisInformacoes[++i] = getColumnFunction(function (o) { return o.codTipo < 3 ? '<span class="money">R$ '+formatDouble(o.valorPrevisto)+'</span>' : '';  }, i) ;
    	$scope.colunasMaisInformacoes[++i] = getColumnFunction(function (a) { return '<span class="money">R$ '+formatDouble(a.valorPago)+'</span>' ;  }, i) ;
 
        
    	return $scope.colunasMaisInformacoes;
    }

    
    $scope.tabelaMaisInformacoes;  
    
    function resultListarRelacaoLancamentos(data) {     
    	$scope.listMaisInformacoes = data;
		$('#mpMaisInformacoes').modal('show'); 
		
  
		 if($scope.tabelaMaisInformacoes){  
			 $scope.tabelaMaisInformacoes.fnClearTable();  
			 $scope.tabelaMaisInformacoes.fnAddData(data);   
		 }else{
			 $scope.tabelaMaisInformacoes = createTable("listaMaisInformacoes", data, getColunasMaisInformacoes());
		 }
    } 
    
    $scope.getSmallboxClassResumoMes = function (resumo) {       
    	if(resumo.codTipo == 1){
			return 'bg-orange' ;
    	}else if(resumo.codTipo == 2){
			return 'bg-yellow' ;
    	}else if(resumo.codTipo == 3){
			return 'bg-red ponteiro' ;
    	}else if(resumo.codTipo == 4){
			return 'bg-green' ; 
    	}else if(resumo.codTipo == 5){
    		return 'bg-blue' ; 
    	}else {
			return '' ;
    	}
    }; 
    
    $scope.getSmallboxIconClassResumoMes = function (resumo) {     
    	if(resumo.codTipo == 1){
			return 'ion ion-ios7-calendar' ;
    	}else if(resumo.codTipo == 2){
			return 'fa fa-th' ;
    	}else if(resumo.codTipo == 3){
			return 'ion ion-calculator' ;
    	}else if(resumo.codTipo == 4){
			return 'ion ion-document-text' ; 
    	}else if(resumo.codTipo == 5){
			return 'fa fa-barcode' ; 
    	}else {
			return '' ;
    	}   
    };  

    /*#######################################################################################
    #                         LANÇAMENTO                                                    #
    ########################################################################################*/

    $scope.setSubCategorias = function() {      
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
    
    $scope.lancarDespesasGerais = function (r) {     
    	if(r.codTipo == 3){
    		$scope.lancamento = {};  
    		$scope.lancamento.dataReferencia = new Date();  
    		$scope.lancamento.valor = 0.0;  
    		$scope.codCategoriaPai = null;  
        	$scope.lancamento.listTags = new Array();

    		$scope.lancamento.descricao = '';  
    		$('#mpLancarDespesasGerais').modal('show'); 
    	}
    };
    
    $scope.salvarLancamentoDespesasGerais = function (mpForm) {   
    	$scope.error = !mpForm.$valid; 
		if ($scope.error) {  
			return;
		} 
		if(validarLancamentoDespesasGerais()){   
			var config = {params: {"codFormaPagamento":0,"numParcelas": ''+0}}; 
			
			$scope.LancamentoService.salvar(null, $scope.lancamento, config, 'mpLancarDespesasGerais', function (obj) {$scope.goMainPage();});  
			 
		}else{
			return;
		} 
    	
    };

    function validarLancamentoDespesasGerais() {     
    	if($scope.lancamento.valor <= 0){  
			 showMessage(false, 'O campo "Valor" tem que ser maior que 0.'); 
			 return false;
    	}
    	
    	if(!$scope.lancamento.dataReferencia){  
			 showMessage(false, 'O campo "Data Refêrencia" é de preenchimento obrigatório.'); 
			 return false;
    	} 
    	return true;
    }

    /*#######################################################################################
    #                         ATIVIDADES                                                    #
    ########################################################################################*/
    $scope.nextPageProximasAtividades = function (pagina) {    
    	$scope.paginaProximasAtividades = pagina;
    	var limite = pagina * $scope.rows;
    	$scope.listProximasAtividades  = new Array();
    	if(limite == $scope.rows){
			var tamanho = ($scope.listProximasAtividadesTemp.length > limite ? limite : $scope.listProximasAtividadesTemp.length);
			for(var i = 0; i < tamanho; i++){
				$scope.listProximasAtividades[i] = $scope.listProximasAtividadesTemp[i];
			}
		}else {
			if($scope.listProximasAtividadesTemp.length > (limite - $scope.rows) ){
				
				var tamanho = ($scope.listProximasAtividadesTemp.length > limite ? limite : $scope.listProximasAtividadesTemp.length);
				var j = -1;
				for(var i = (limite - $scope.rows); i < tamanho; i++){
					$scope.listProximasAtividades[++j] = $scope.listProximasAtividadesTemp[i];
				}
			}  
		}  
    };

 
     
    $scope.nextPage = function (pagina) {    
    	$scope.pagina = pagina;
    	var limite = pagina * $scope.rows;
    	$scope.listUltimasAtividades  = new Array();
    	if(limite == $scope.rows){
			var tamanho = ($scope.listUltimasAtividadesTemp.length > limite ? limite : $scope.listUltimasAtividadesTemp.length);
			for(var i = 0; i < tamanho; i++){
				$scope.listUltimasAtividades[i] = $scope.listUltimasAtividadesTemp[i];
			}
		}else {
			if($scope.listUltimasAtividadesTemp.length > (limite - $scope.rows) ){
				
				var tamanho = ($scope.listUltimasAtividadesTemp.length > limite ? limite : $scope.listUltimasAtividadesTemp.length);
				var j = -1;
				for(var i = (limite - $scope.rows); i < tamanho; i++){
					$scope.listUltimasAtividades[++j] = $scope.listUltimasAtividadesTemp[i];
				}
			}  
		}  
    };
 
    $scope.getTempo = function (atividade) {       
    	if(atividade.minutos <= 60 && atividade.minutos >= 0){
    		return atividade.minutos + ' minuto(s)';
    	}else if(atividade.horas <= 24){
    		return atividade.horas + ' hora(s)';
    	}else{
    		return atividade.dias + ' dia(s)';
    	}
    };
    
    $scope.getClass = function (atividade) {       
    	if(atividade.minutos <= 60){
    		return 'label label-warning';
    	}else if(atividade.horas <= 24){
    		return 'label label-info';
    	}else{
    		return 'label label-success';
    	}
    }; 

    $scope.getClassProximaAtividade = function (atividade) {       
    	if(atividade.dias <= 0){
    		return 'label label-danger';
    	}else if(atividade.dias > 0 && atividade.dias < 3){
    		return 'label label-warning';
    	}else {
    		return 'label label-success'; 
    	}
    };

    $scope.getIcone = function (atividade) {       
    	if(atividade.dias <= 0){
    		return 'fa fa-warning';
    	}else if(atividade.dias > 0 && atividade.dias < 3){
    		return 'glyphicon glyphicon-eye-open';
    	}else {
    		return 'fa fa-clock-o'; 
    	}
    };





    /*#######################################################################################
    #                         CHART FUNCTIONS                                               #
    ########################################################################################*/

    function getBarCharts(list) {     
    	var dados  = new Array();
    	$.each(list, function(i, o) {    
    		dados[i] = getBarChart(o.competencia, o.lista);
    	});    
    	return dados;
    } 
    
    function getBarChart(desc, v) {     
    	var obj = {y: desc}; 

		$.each(v, function(i, r) {   
	    	obj[r.descricao] = r.valor;
		});     
    	return obj;
    }

    function getDonutObjects(list) {     
    	var dados  = new Array();
    	$.each(list, function(i, o) {    
    		dados[i] = {label: o.descricao, value: o.valor};
    	});    
    	return dados;
    }

    function getLineChart() {     
    	var dados  = new Array();
    	$.each($scope.listaDespesasReceitas, function(i, o) {    
    		dados[i] = {y: o.data, item1: o.valorReceita, item2: o.valorDespesa};
    	});    
    	return dados;
    }
    
    $scope.getClassProgressbar = function (resumo) {        
    	if(resumo.codTipo == 1){
			return 'progress-bar-orange' ;
    	}else if(resumo.codTipo == 2){
			return 'progress-bar-yellow' ;
    	}else if(resumo.codTipo == 3){
			return 'progress-bar-red' ;
    	}else if(resumo.codTipo == 4){
			return 'progress-bar-green' ; 
    	}else if(resumo.codTipo == 5){
			return 'progress-bar-blue' ; 
    	}else {
			return '' ;
    	}     
    }; 
    
    
    function addKnob(id, r) {    
    	$(id).append('<div class="col-xs-3 text-center" >\n'+
		               '        <div style="display: inline; width: 60px; height: 60px;">\n'+
		               '		 	<input type="text" class="knob" data-readonly="true" value="'+r.percentual+'" data-width="60" data-height="60" readonly="readonly" '+
		               '				   data-fgcolor="'+r.cor+'" style="width: 34px; '+
		               '				   height: 20px; position: absolute; vertical-align: middle; margin-top: 20px; margin-left: -47px; border: 0px; '+
		               ' 				   font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal;font-size: 12px; line-height: normal;'+ 
		               ' 				   font-family: Arial; text-align: center; color: '+r.cor+'; padding: 0px; -webkit-appearance: none; background: none;">'+ 
		               '		</div>\n'+
		               '        <div class="knob-label" style="color: black; font-weight: bold">'+r.descricao+'</div>\n'+ 
		               '</div>');
    }

	$scope.formatOptions = function(data) {
		data.formattedOptions = JSON.stringify(data.options).replace(/,/g,"\n");
		return data;
	}; 
	

    function getColor(resumo) {          
    	if(resumo.codTipo == 1){
    		return '#ff9900' ;
    	}else if(resumo.codTipo == 2){
    		return '#ffcc00' ;
    	}else if(resumo.codTipo == 3){
    		return '#f56954' ;
    	}else if(resumo.codTipo == 4){
    		return '#00a65a' ;
    	}else if(resumo.codTipo == 5){
    		return '#59d' ;
    	}else {
			return '' ;
    	}      
    }


    function getColors(v) {     
    	var keys = new Array();
		$.each(v, function(i, resumo) {    
	    	if(resumo.codTipo == 1){
	    		keys[i] = '#ff9900' ;
	    	}else if(resumo.codTipo == 2){
	    		keys[i] = '#ffcc00' ;
	    	}else if(resumo.codTipo == 3){
	    		keys[i] = '#f56954' ;
	    	}else if(resumo.codTipo == 4){
	    		keys[i] = '#00a65a' ;
	    	}else if(resumo.codTipo == 5){
	    		keys[i] = '#59d' ;
	    	}else {
				return '' ;
	    	}      
		});   
    	return keys;
    }

    function getkeys(v) {     
    	var keys = new Array();
		$.each(v, function(i, r) {   
			keys[i] = r.descricao ;
		});   
    	return keys;
    }
    
    /*#######################################################################################
    #                         Atividades do Mês                                             #
    ########################################################################################*/
    function chartAtividatesMes() {     

    	$scope.listChartAtividatesMes  = new Array();
    	
    	var valorTotal = 0;
    	
		$.each($scope.listResumoMes, function(i, r) {   
			$scope.listChartAtividatesMes[i] = {descricao: r.descricao, codTipo: r.codTipo, valor: r.valor};  
			valorTotal += r.valor;
		});    

		var perc = 0;
		$.each($scope.listChartAtividatesMes, function(i, r) {    
			perc = ((r.valor / valorTotal) * 100);
			r.percentual = formatInteiro(perc);
			r.percentualString = formatDouble(perc);
			r.cor = getColor(r);
			
			addKnob('#knobAtividatesMes', r);
		});    
    	$('.knob').knob();  
		
       new Morris.Bar({
            element: 'chartAtividatesMes', 
            data: [ getBarChart(moment().format('MM/YYYY'), $scope.listChartAtividatesMes) ],
            barColors: getColors($scope.listChartAtividatesMes),
            xkey: 'y',
            ykeys: getkeys($scope.listChartAtividatesMes),
            labels: getkeys($scope.listChartAtividatesMes),
            hideHover: 'auto'
        	,yLabelFormat: function (x) { return formatDouble(x); }
        });
		
		
        //Donut Chart listResumoMes
        new Morris.Donut({
            element: 'sales-chart2', 
            colors: getColors($scope.listChartAtividatesMes),
            data: getDonutObjects($scope.listChartAtividatesMes),
            hideHover: 'auto'
            ,formatter: function (x) { return formatDouble(x); }
        });

    }
    
    

	

    /*#######################################################################################
    #                         Atividades dos Últimos 3 Meses                                #
    ########################################################################################*/
    //Bar chart meses
    function chartAtividatesMeses () {      
    	 
    	 
    	$.each($scope.resumoMeses.listaTotal, function(i, r) {      
    		r.percentualString = formatDouble(r.percentual);
    		r.cor = getColor(r); 
			addKnob('#knobAtividatesMeses', r);
    	});    
    	  
    	new Morris.Bar({
    		element: 'chartAtividatesMeses', 
    		data: getBarCharts($scope.resumoMeses.lista),
    		barColors: getColors($scope.resumoMeses.listaTotal),
    		xkey: 'y',
    		ykeys: getkeys($scope.resumoMeses.listaTotal),
    		labels: getkeys($scope.resumoMeses.listaTotal),
    		hideHover: 'auto'
    		,yLabelFormat: function (x) { return formatDouble(x); }
    	}); 
    	 
    }
    
 

    /*#######################################################################################
    #                         AGENDA                                                        #
    ########################################################################################*/
    $scope.registrarAgenda = function (o) {  
    	o.valor = $scope.formatDouble(o.valorPrevisto); 
    	o.dataPagamento = o.dataPagamento ? new Date(o.dataPagamento) : new Date();     
    	$scope.listParcelaFatura = new Array();
		$scope.agenda = o;  
    	
		if($scope.agenda.codCartaoCredito > 0){ 
			$scope.agenda.dataPrevista = stringToDate($scope.agenda.dataPrevista);
    		var config = {params: {"codCartaoCredito":$scope.agenda.codCartaoCredito,"dataReferencia": ''+$scope.formatDate($scope.agenda.dataPrevista)}}; 
    		$scope.ParcelaService.pesquisar("/listarPorCartaoCredito", resultPesquisarParcelas, config); 
//    		$('#mpLancarAgenda').modal('show'); 
		}else{
			$('#mpLancarAgenda').modal('show'); 
		}
    };

    function resultPesquisarParcelas(data) {    
    	$scope.listParcelaFatura = data; 
		$('#mpLancarAgenda').modal('show'); 

    }  
    
    $scope.lancarAgenda = function (mpForm) {   
    	$scope.error = !mpForm.$valid; 
		if ($scope.error) {  
			return;
		}  
		if(validar()){  
//			$scope.agenda.dataPrevista = stringToDate($scope.agenda.dataPrevista);
			$scope.DashBoardService.salvar("/lancarAgenda", $scope.agenda, {}, 'mpLancarAgenda', function (obj) {$scope.goMainPage();});
		} 
    	
    };
 

    function validar () {    
    	if($scope.agenda.valor <= 0){   
			showMessage(false, 'O campo "Valor Realizado" tem que ser maior que 0. <BR>'); 
			return false;
    	}  
    	return true;
    }

    function getEventosAgenda() {    
    	var dados  = new Array();
    	$.each($scope.listaAgendaAtual, function(i, o) {    
    		dados[i] = {title: getDescricaoAgenda(o), 
    				    start: o.dataPrevista, 
    				    backgroundColor: o.dataPagamento ? '#4C4': "#F99", 
    				    borderColor: "#000",  
    				    agenda: o};
    	});    
    	return dados;
    } 
    
    function getDescricaoAgenda(o){
    	var txt = o.desCategoria +' \nValor Previsto: R$ '+ formatDouble(o.valorPrevisto); 
    	if(o.dataPagamento){
    		txt += '\nData Realizada: ' + $scope.formatDate(o.dataPagamento);
    		txt += '\nValor Realizado: R$ ' + $scope.formatDouble(o.valor);
    	}
    	return txt;
    }

    /*#######################################################################################
    #                         PESQUISAS                                                     #
    ########################################################################################*/
    
    $scope.iniciarDashBoard = function () {  
    	$scope.DashBoardService.pesquisar("/findDashBoard", resultFindDashBoard); 
    	$scope.Parametros.pesquisar("/listCategorias", resultListCategorias); 
    	$scope.Parametros.pesquisar("/listTags", resultListTags); 
    };

    function resultFindDashBoard(data){ 

    	resultListarProximasAtividades(data.PROXIMAS_ATIVIDADES);
    	resultListarUltimasAtividades(data.ULTIMAS_ATIVIDADES);
    	
		$scope.listResumoMes = data.ATIVIDADES_MES;    
    	chartAtividatesMes();
    	 
    	$scope.resumoMeses = data.ATIVIDADES_3_MESES[0];    
    	chartAtividatesMeses();
    	$('.knob').knob();  
    	
    	resultListarDespesasReceitas(data.ATIVIDADES_12_MESES);
    	resultListarAgendaAtual(data.AGENDA);
    	 
    } 
    
    function resultListarProximasAtividades(data) {    
		$scope.listProximasAtividadesTemp = data;   
		$scope.paginasProximasAtividades = newArray(data.length, $scope.rows);
		
		if(data.length > $scope.rows){
			for(var i = 0; i < $scope.rows; i++){
				$scope.listProximasAtividades[i] = data[i];
			}
		}else{
			for(var i = 0; i < data.length; i++){
				$scope.listProximasAtividades[i] = data[i]; 
			}
		}   
    }
     
    function resultListarUltimasAtividades(data) {   
		$scope.listUltimasAtividadesTemp = data;   
		$scope.paginasUltimasAtividades = newArray(data.length, $scope.rows);
		
		if(data.length > $scope.rows){
			for(var i = 0; i < $scope.rows; i++){
				$scope.listUltimasAtividades[i] = data[i];
			}
		}else{
			for(var i = 0; i < data.length; i++){
				$scope.listUltimasAtividades[i] = data[i];
			}
		}    
    }


    function resultListarDespesasReceitas(data) {      
		$scope.listaDespesasReceitas = data;      
		new Morris.Line({
			element: 'chartDespesasReceitas', 
			data: getLineChart(),
			xkey: 'y',
			ykeys: ['item1', 'item2'], 
			labels: ['Receitas', 'Despesas'],
			lineColors: ['#00a65a', '#f56954']  
			,dateFormat: function (x) { return getCompetencia(new Date(x)); }
			,xLabelFormat: function (x) { return getCompetencia(new Date(x)); } 
		    ,yLabelFormat: function (x) { return formatDouble(x); }
		});  
    } 
    
    function resultListarAgendaAtual(data) {      
		$scope.listaAgendaAtual = data;    
		
		$('#calendar').fullCalendar({
			editable: false,  
			events: getEventosAgenda(), 
			eventClick: function(item, funcao, view) {
				$scope.$apply(function(){ 
					if(!item.agenda.dataPagamento){
						$scope.registrarAgenda(item.agenda); 
					}
				});
			},
			buttonText: {
				prev: "<span class='fa fa-caret-left'></span>",
				next: "<span class='fa fa-caret-right'></span>",
				today: 'hoje',
				month: 'mês',
				week: 'semana',
				day: 'dia'
			},
			header: {
				left: 'title',
				center: '', 
				right: 'prev,next'
			} ,
			dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
			monthNames : ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
			              'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] 
		});
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
    	$scope.listTags = data;  
    }
    
    $scope.iniciarDashBoard(); 
} 
 