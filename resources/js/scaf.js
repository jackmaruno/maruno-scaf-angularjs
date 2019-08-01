angular.module('mainApp', ['maskMoney','ngTreetable']);

var searchMatch = function (atributo, filtro) {
	var valor = ''+atributo;  
    if (!filtro) { 
        return true;
    } 
    return valor.toLowerCase().indexOf(filtro.toLowerCase()) !== -1;
};


function stringToDate(s) {   
	return new Date(moment(s)) ;
}

function formatDate(date) {   
	return moment(date).format('DD/MM/YYYY') ;  
}

function getCompetencia(date) {   
	return moment(date).format('YYYY/MM') ;   
}



function formatDateTime(date) {   
	data = new Date(date);
	var dia = data.getDate();
	var mes = (1 + data.getMonth());
	var ano = data.getFullYear();
	var hora = data.getHours();
	var min = data.getMinutes();
	return ajustarZero(dia)+ '/' + ajustarZero(mes) + '/' + ano + '&nbsp;&nbsp;&nbsp;'+ ajustarZero(hora) + 'hs &nbsp;'+ajustarZero(min) + 'min';
}


function formatDateTimeSecs(date) {   
	data = new Date(date);
	var dia = data.getDate();
	var mes = (1 + data.getMonth());
	var ano = data.getFullYear();
	var hora = data.getHours();
	var min = data.getMinutes();
	var sec = data.getSeconds();
	return ajustarZero(dia)+ '/' + ajustarZero(mes) + '/' + ano + '&nbsp;&nbsp;&nbsp;'+ ajustarZero(hora) + 'hs &nbsp;'+ajustarZero(min) + 'min &nbsp;' + ajustarZero(sec)+'s';
}

function fodrmatDouble(d) {   
	var t = '' + d;
	return  t.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

function formatInteger(d) {    
	var v = d.toString().split('.')[0];

	var j = 1;
	var real = '';
	
	for(var i = v.length-1; i > -1; i--){
		
		real=v.substr(i,1)+''+real;
		
		if(j==3){
			real='.'+real;
			j=1;
		}
		j++;
	}
	
	if (real.substr(0,1)=='.') {
		real=real.substr(1);
	}
	if(!real){
	  real='0';
	}
	return real;
	
}

function formatCentavos(valor) {   
	var v = valor.toString().split('.')[1]; 
	v = !v ? '00': v;
	v = v.length == 1 ? v + '0': v;
	v = v.length > 2 ? v.substring(0,2) : v;
	return v;
}

function formatDouble(d){
	var valor = d + '';
	return formatInteger(valor) +','+ formatCentavos(valor);
} 

function arredDouble(valor){ 
	var d = valor + '';
	return parseFloat(d.split('.')[0] +'.'+ formatCentavos(d));
} 

function formatNumber(valor){
	return valor.toString().split('.')[0] +'.'+ formatCentavos(valor);
} 


function formatInteiro(valor){
	return valor.toString().split('.')[0];
} 

function ajustarZero(i) {
    return (i < 10) ? "0" + i : "" + i;
}

function objToJsonString(obj) {
	var value = '{';
	for(var key in obj) {
		value += "'"+key+"' : '" +obj[key]+'", ';
	}
	return value.substring(0, value.length - 2) + '}';
}

function objToString(obj) {
	var value = '';
	for(var key in obj) {
		value += key+" : " +obj[key]+'<br>';
	}
	return value;
}

function listToString(list) {
	var txt = '[';
	for(var i = 0; i < list.length; i++){
		var value = '{';
		for(var key in list[i]) {
			value += "'"+key+"' : '" +list[i][key]+"', ";
		}
		txt += value.substring(0, value.length - 2) + '} <BR>, '; 
	}
	return txt.substring(0, txt.length - 2) + '}';
}


var createTable = function(id, data, aoColumnDefs, fnRowCallback) {    
   var tabela =  $('#'+id).dataTable({  
        "iCookieDuration": 2419200,  
		"bJQueryUI": true,
        "fnRowCallback": fnRowCallback,
        "aoColumnDefs":aoColumnDefs,
        "oLanguage": { 
            "sEmptyTable":     "Nenhum registro encontrado na tabela",
            "sInfo":           "Exibindo de _START_ até _END_ do _TOTAL_ registros",
            "sInfoEmpty":      "Exibindo 0 até 0 de 0 Registros", 
            "sInfoFiltered":   "(Filtrar de _MAX_ total registros)",
            "sInfoPostFix":    "",
            "sInfoThousands":  ".",
            "sLengthMenu":     "Mostrar _MENU_ registros por pagina",
            "sLoadingRecords": "Carregando...",
            "sProcessing":     "Processando...",
            "sZeroRecords":    "Nenhum registro encontrado", 
            "sSearch":         "Pesquisar",
            "oPaginate": {
                "sNext":     "Proximo",
                "sPrevious": "Anterior",
                "sFirst":    "Primeiro",
                "sLast":     "Ultimo"
            },
            "oAria": {
                "sSortAscending":  ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            },
            "sLengthMenu": '<select>'+
            '<option value="5">5</option>'+
            '<option value="10">10</option>'+
            '<option value="20">20</option>'+
            '<option value="30">30</option>'+
            '<option value="40">40</option>'+
            '<option value="50">50</option>'+
            '<option value="-1">All</option>'+
            '</select> Itens por página',
            "sZeroRecords" : 'Nenhum registro encontrado'
          }
    });  
   tabela.fnClearTable();
   tabela.fnAddData(data);  
   return tabela;
}; 
 




var daterangepickerOptions = {
  startDate: moment().subtract('days', 29),
  endDate: moment(),
  minDate: '01/01/2012', 
  dateLimit: { days: 60 }, 
  showWeekNumbers: false, 
  ranges: {
     'Hoje': [moment(), moment()],
     'Ontem': [moment().subtract('days', 1), moment().subtract('days', 1)],
     'Últimos 7 Dias': [moment().subtract('days', 6), moment()],
     'Últimos 30 Dias': [moment().subtract('days', 29), moment()],
     'Mês Atual': [moment().startOf('month'), moment().endOf('month')],
     'Mês Anterior': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
  },
  opens: 'left',
  buttonClasses: ['btn btn-default'],
  applyClass: 'btn-small btn-success',
  cancelClass: 'btn-small',
  format: 'DD/MM/YYYY',
  separator: ' a ',
  locale: {
      applyLabel: 'Aplicar',
      cancelLabel: 'Limpar',
      fromLabel: 'Início',
      toLabel: 'Fim',
      customRangeLabel: 'Manual',
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex','Sab'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      firstDay: 1
  }
};








function getBotaoEditar(mp) {    
	return '<a href="#'+mp+'" data-toggle="modal" role="button"><i class="fa fa-edit"></i></a>';
}

function getBotaoExcluir(mp) {    
	return '<a href="#'+mp+'" data-toggle="modal" role="button"><i class="fa fa-times-circle" style="color: red"></i></a>';
}

function getBotaoVisualizar(mp) {    
	return '<a href="#'+mp+'" data-toggle="modal" role="button" ><i class="fa fa-search" style="color: #48d;"></i></a>';
}

function getBotaoAtivar(mp, ativo) {     
	var styleClass = ativo ? 'minus-sign': 'ok-circle';
	var color = ativo ? 'red': 'green';
	var txt = ativo ? 'Desativar': 'Ativar';
	
	return '<a href="#'+mp+'" data-toggle="modal" title="'+txt+'" role="button" ><i class="glyphicon glyphicon-'+styleClass+'" style="color: '+color+'"></i></a>' ;
}

function getBotaoStatus(mp, obj) {     
	var ativo = obj.ativo+'' == 'true';
	var styleClass = ativo ? 'minus-sign': 'ok-circle';
	var color = ativo ? 'red': 'green';
	var txt = ativo ? 'Desativar': 'Ativar';
	
	return '<a href="#'+mp+'" data-toggle="modal" title="'+txt+'" role="button" ><i class="glyphicon glyphicon-'+styleClass+'" style="color: '+color+'"></i></a>' ;
}

function getColumn(name, count){
	return {"mDataProp": name, "aTargets":[count] };
}

function getColumnFunction(listener, count){
	return {"mDataProp": listener, "aTargets":[count] };
}

function getColumnStatus(count){
	return {"mDataProp": function (a, b) { return '<span>'+ (a.ativo + ''== 'true' ? 'Ativo':'Inativo') + '</span>';}, "aTargets":[count] };
}


