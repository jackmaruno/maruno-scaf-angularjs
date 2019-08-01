 
function dashboardCtrl($scope, $location, $http, $timeout) {   
	 
    $scope.formatDouble = function (valor) {      
    	return formatDouble(valor) ;  
    }; 

    $scope.formatInteger = function (valor) {      
    	return formatInteger(valor) ;  
    }; 

    $scope.formatCentavos = function (valor) {      
    	return formatCentavos(valor) ;  
    }; 
    
    $scope.formatDate = function (date) {      
    	return moment(date).format('DD/MM/YYYY') ; 
    };

    $scope.Servico = new Servico($http, $scope.menu) ;  
	

    $scope.init = function () {  

    	$scope.Servico.pesquisar("/listarResumoMes", $scope.resultListarResumoMes ); 
        
        $scope.Servico.pesquisar("/getResumoMeses",  $scope.resultGetResumoMeses); 

        $scope.Servico.pesquisar("/listarProximasAtividades", $scope.resultListarProximasAtividades); 

    	$scope.Servico.pesquisar("/listarUltimasAtividades", $scope.resultListarUltimasAtividades);
    	
    	$scope.Servico.pesquisar("/listarDespesasReceitas", $scope.resultListarDespesasReceitas); 
    	
    	$scope.Servico.pesquisar("/listarAgendaAtual", $scope.resultListarAgendaAtual);  
    	
    	$scope.Parametros.pesquisar("/listCategorias", $scope.resultListCategorias); 
    };
     

    $scope.resultListarResumoMes = function (data) {    
		$scope.listResumoMes = data;    
    	$scope.chartAtividatesMes();
    };
    
    $scope.resultGetResumoMeses = function (data) {     
    	$scope.resumoMeses = data;    
    	$scope.chartAtividatesMeses();
    	$('.knob').knob();  
    };
    
    $scope.resultListarProximasAtividades = function (data) {    
		$scope.listProximasAtividadesTemp = data;   
		if(data.length > $scope.rows){
			for(var i = 0; i < $scope.rows; i++){
				$scope.listProximasAtividades[i] = data[i];
			}
		}else{
			for(var i = 0; i < data.length; i++){
				$scope.listProximasAtividades[i] = data[i]; 
			}
		}  
    };
    
    
    $scope.resultListarUltimasAtividades = function (data) {   
		$scope.listUltimasAtividadesTemp = data;   
		if(data.length > $scope.rows){
			for(var i = 0; i < $scope.rows; i++){
				$scope.listUltimasAtividades[i] = data[i];
			}
		}else{
			for(var i = 0; i < data.length; i++){
				$scope.listUltimasAtividades[i] = data[i];
			}
		}   
    };
    
    $scope.resultListarDespesasReceitas = function (data) {      
		$scope.listaDespesasReceitas = data;      
		new Morris.Area({
			element: 'chartDespesasReceitas',
			resize: true,
			data: $scope.getLineChart(),
			xkey: 'y',
			ykeys: ['item1', 'item2'], 
			labels: ['Receitas', 'Despesas'],
			lineColors: ['#00a65a', '#f56954'],
			hideHover: 'auto'
		});  
    };
    
    $scope.resultListarAgendaAtual = function (data) {      
		$scope.listaAgendaAtual = data;    
		
		$('#calendar').fullCalendar({
			editable: false,  
			events: $scope.getEventosAgenda(),
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
    }; 


    $scope.resultListCategorias = function (data) {     
	    $scope.listCategorias = data; 
	    var i = -1;
		$.each(data, function(index, c) {  
			if(!c.categoriaPai){ 
				 $scope.listCategoriasPai[++i] = c; 
			}
		});   
    };
    
    $scope.init(); 
    
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

    $scope.lancarDespesasGerais = function (r) {     
    	if($scope.getCodTipo(r) == 3){
    		$scope.lancamento = {};  
    		$scope.lancamento.dataReferencia = new Date();  
    		$scope.lancamento.valor = 6.66;  
    		$scope.codCategoriaPai = null;  

    		$scope.lancamento.descricao = $scope.respres;  
    		$('#mpLancarDespesasGerais').modal('show'); 
    	}
    };
    
    $scope.salvarLancamentoDespesasGerais = function (mpForm) {   
    	$scope.error = !mpForm.$valid; 
		if ($scope.error) {  
			return;
		} 
		if(validar()){   
			var config = {params: {"codFormaPagamento":0,"numParcelas": ''+0}}; 
			
			$scope.LancamentoService.salvar(null, $scope.lancamento, config, 'mpLancarDespesasGerais', function (obj) {$scope.goMainPage();});  
			 
		}else{
			return;
		} 
    	
    };

    function validar() {     
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
    
    $scope.getClassResumoMes = function (resumo) {       
    	if(resumo.descricao == 'Receitas' || resumo.descricao == 'Saldo'){
			return 'col-lg-3' ; 
    	}
    	return 'col-lg-2' ;
    };  
    
    $scope.getTitleResumoMes = function (r) {       
    	if(r.descricao == 'Parcelas' || r.descricao == 'Agendamentos'){
			return 'Total Previsto:	' +formatDouble(r.valorPrevisto) + ' \nTotal Pago:	' +formatDouble(r.valorPago); 
    	}
    	return 'Total:	' +formatDouble(r.valorPago) ; 
    }; 

    
    $scope.showModalMaisInformacoes = function (r) {   
    	$scope.resumo = r; 
    	$scope.resumo.codTipo = $scope.getCodTipo(r); 
    	
		$scope.listMaisInformacoes = new Array(); 
		
		var config = {params: {"codTipo": $scope.getCodTipo(r)}};  
		
        $scope.Servico.pesquisar("/listarRelacaoLancamentos", $scope.resultListarRelacaoLancamentos, config); 
        
//    	$scope.listMaisInformacoes[0] = {descCategoria:'Energia', descTags: 'Meu AP', dataReferencia:moment(), dataLancamento: moment(), valorPrevisto: 101.99, valorPago: 120.89};
//    	$scope.listMaisInformacoes[1] = {descCategoria:'Aluguel', descTags: 'Meu AP', dataReferencia:moment(), dataLancamento: moment(), valorPrevisto: 101.99, valorPago: 120.89};
//    	$scope.listMaisInformacoes[2] = {descCategoria:'Cinema', descTags: 'miguel, namorada', dataReferencia:moment(), dataLancamento: moment(), valorPrevisto: 101.99, valorPago: 120.89};
    };
    
    $scope.resultListarRelacaoLancamentos = function (data) {    
    	$scope.listMaisInformacoes = data;
		$('#mpMaisInformacoes').modal('show'); 
    };  

    $scope.getCodTipo = function (resumo) {       
    	if(resumo.descricao == 'Agendamentos'){
			return 1;
    	}else if(resumo.descricao == 'Parcelas'){
			return 2 ;
    	}else if(resumo.descricao == 'Despesas Gerais'){
			return 3 ;
    	}else if(resumo.descricao == 'Receitas'){
			return 4 ; 
    	}else {
			return 0;
    	}
    }; 
    
    $scope.getSmallboxClassResumoMes = function (resumo) {       
    	if(resumo.descricao == 'Agendamentos'){
			return 'bg-orange' ;
    	}else if(resumo.descricao == 'Parcelas'){
			return 'bg-yellow' ;
    	}else if(resumo.descricao == 'Despesas Gerais'){
			return 'bg-red ponteiro' ;
    	}else if(resumo.descricao == 'Receitas'){
			return 'bg-green' ;
    	}else if(resumo.descricao == 'Saldo'){
			return 'bg-aqua' ;
    	}else {
			return '' ;
    	}
    }; 
    
    $scope.getSmallboxIconClassResumoMes = function (resumo) {       
    	if(resumo.descricao == 'Agendamentos'){
			return 'ion ion-ios7-calendar' ;
    	}else if(resumo.descricao == 'Parcelas'){
			return 'fa fa-th' ;
    	}else if(resumo.descricao == 'Despesas Gerais'){
			return 'ion ion-calculator' ;
    	}else if(resumo.descricao == 'Receitas'){
			return 'ion ion-document-text' ;
    	}else if(resumo.descricao == 'Saldo'){
			return 'ion ion-pie-graph' ;
    	}else {
    		return '' ;
    	}
    };  
    

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


    
	 
    $scope.getBarChart = function (desc, v) {     
    	var obj = {y: desc}; 

		$.each(v, function(i, r) {   
	    	obj[r.descricao] = r.valorPago;
		});     
    	return obj;
    };

    $scope.getkeys = function (v) {     
    	var keys = new Array();
		$.each(v, function(i, r) {   
			keys[i] = r.descricao ;
		});   
    	return keys;
    };

    $scope.getColors = function (v) {     
    	var keys = new Array();
		$.each(v, function(i, r) {   
	    	if(r.descricao == 'Agendamentos'){
	    		keys[i] = '#ff9900' ;
	    	}else if(r.descricao == 'Parcelas'){
	    		keys[i] = '#ffcc00' ;
	    	}else if(r.descricao == 'Despesas Gerais'){
	    		keys[i] = '#f56954' ;
	    	}else if(r.descricao == 'Receitas'){
	    		keys[i] = '#00a65a' ;
	    	}else if(r.descricao == 'Saldo'){
	    		keys[i] = 'bg-aqua' ;
	    	}else {
	    		keys[i] = '' ;
	    	}
		});   
    	return keys;
    };

    $scope.getColor = function (r) {     
    	if(r.descricao == 'Agendamentos'){
    		return '#ff9900' ;
    	}else if(r.descricao == 'Parcelas'){
    		return '#ffcc00' ;
    	}else if(r.descricao == 'Despesas Gerais'){
    		return '#f56954' ;
    	}else if(r.descricao == 'Receitas'){
    		return '#00a65a' ;
    	}else if(r.descricao == 'Saldo'){
    		return 'bg-aqua' ;
    	}else {
    		return '' ;
    	}  
    };
    
 
    
    //Bar chart
    $scope.chartAtividatesMes = function () {     

    	$scope.listChartAtividatesMes  = new Array();
    	
    	var valorTotal = 0;
    	
		$.each($scope.listResumoMes, function(i, r) {   
			if(r.descricao != 'Saldo'){
				$scope.listChartAtividatesMes[i] = {descricao: r.descricao, valorPago:r.valorPago};  
				valorTotal += r.valorPago;
			}
		});    

		var perc = 0;
		$.each($scope.listChartAtividatesMes, function(i, r) {    
			perc = ((r.valorPago / valorTotal) * 100);
			r.percentual = formatInteiro(perc);
			r.percentualString = $scope.formatDouble(perc);
			r.cor = $scope.getColor(r);
			
			$scope.addKnob('#knobAtividatesMes', r);
		});    
    	$('.knob').knob();  
		
       new Morris.Bar({
            element: 'chartAtividatesMes',
            resize: true,
            data: [ $scope.getBarChart(moment().format('MM/YYYY'), $scope.listChartAtividatesMes) ],
            barColors: $scope.getColors($scope.listChartAtividatesMes),
            xkey: 'y',
            ykeys: $scope.getkeys($scope.listChartAtividatesMes),
            labels: $scope.getkeys($scope.listChartAtividatesMes),
            hideHover: 'auto'
        });

    }; 
    
    $scope.addKnob = function (id, r) {    
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
    };

    $scope.getClassProgressbar = function (o) {       
    	if(o.descricao == 'Agendamentos'){
			return 'progress-bar-orange' ;
    	}else if(o.descricao == 'Parcelas'){
			return 'progress-bar-yellow' ;
    	}else if(o.descricao == 'Despesas Gerais'){
			return 'progress-bar-red' ;
    	}else if(o.descricao == 'Receitas'){
			return 'progress-bar-green' ; 
    	}else {
			return '' ;
    	}
    }; 
  
    
	$scope.formatOptions = function(data) {
		data.formattedOptions = JSON.stringify(data.options).replace(/,/g,"\n");
		return data;
	};
	

    //Bar chart meses
    $scope.chartAtividatesMeses = function () {      
    	 
    	 
    	$.each($scope.resumoMeses.listaTotal, function(i, r) {      
    		r.percentualString = $scope.formatDouble(r.percentual);
    		r.cor = $scope.getColor(r); 
			$scope.addKnob('#knobAtividatesMeses', r);
    	});    
    	  
    	new Morris.Bar({
    		element: 'chartAtividatesMeses',
    		resize: true,
    		data: $scope.getBarCharts($scope.resumoMeses.lista),
    		barColors: $scope.getColors($scope.resumoMeses.listaTotal),
    		xkey: 'y',
    		ykeys: $scope.getkeys($scope.resumoMeses.listaTotal),
    		labels: $scope.getkeys($scope.resumoMeses.listaTotal),
    		hideHover: 'auto'
    	}); 
    	


        //Donut Chart
        new Morris.Donut({
            element: 'sales-chart2',
            resize: true,
            colors: $scope.getColors($scope.resumoMeses.listaTotal),
            data: $scope.getDonutObjects($scope.resumoMeses.listaTotal),
            hideHover: 'auto'
        });
    };  
    
    $scope.getBarCharts = function (list) {     
    	var dados  = new Array();
    	$.each(list, function(i, o) {    
    		dados[i] = $scope.getBarChart(o.competencia, o.lista);
    	});    
    	return dados;
    }; 

    $scope.getDonutObjects = function (list) {     
    	var dados  = new Array();
    	$.each(list, function(i, o) {    
    		dados[i] = {label: o.descricao, value: o.valorPago};
    	});    
    	return dados;
    }; 

    $scope.getLineChart = function () {     
    	var dados  = new Array();
    	$.each($scope.listaDespesasReceitas, function(i, o) {    
    		dados[i] = {y: o.competencia.replace('/','-'), item1: o.valorReceitaPaga, item2: o.valorDespesaPaga};
    	});    
    	return dados;
    };  
    
    $scope.registrarAgenda = function (o) {  
    	o.valorPago = o.valorPrevisto;
    	
    	o.dataPagamento = o.dataPagamento ? new Date(o.dataPagamento) : new Date();  
    	
    	$scope.agenda = o; 
        $('#mpLancarAgenda').modal('show'); 
    };
     
    $scope.lancarAgenda = function (mpForm) {   
    	$scope.error = !mpForm.$valid; 
		if ($scope.error) {  
			return;
		}  
		if($scope.validar()){  
			$scope.Servico.salvar("/lancarAgenda", $scope.agenda, {}, 'mpLancarAgenda', function (obj) {$scope.goMainPage();});
		} 
    	
    };
 

    $scope.validar = function () {    
    	if($scope.agenda.valorPago <= 0){   
			showMessage(false, 'O campo "Valor Realizado" tem que ser maior que 0. <BR>'); 
			return false;
    	}  
    	return true;
    }; 

    $scope.getEventosAgenda = function () {    
    	var dados  = new Array();
    	$.each($scope.listaAgendaAtual, function(i, o) {    
    		dados[i] = {title: getDescricaoAgenda(o), 
    				    start: o.dataPrevista, 
    				    backgroundColor: o.dataPagamento ? '#4C4': "#F99", 
    				    borderColor: "#000",  
    				    agenda: o};
    	});    
    	return dados;
    };
    
    function getDescricaoAgenda(o){
    	var txt = o.desCategoria +' \nValor Previsto: R$ '+ formatDouble(o.valorPrevisto); 
    	if(o.dataPagamento){
    		txt += '\nData Realizada: ' + $scope.formatDate(o.dataPagamento);
    		txt += '\nValor Realizado: R$ ' + $scope.formatDouble(o.valorPago);
    	}
    	return txt;
    }
    
} 
 