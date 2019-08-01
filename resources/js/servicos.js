
var showMessage = function(success, message) {   
	$('#mpMessageBody').html('<div class="alert alert-'+(success ? 'success':'danger')+' alert-dismissable">'+message+'</div>');  
	$('#mpMessage').modal('show');  
};   

var sessionExpired = function() {   
	$('#mpSessionExpired').modal('show');  
};   

var mpLoading = {
	show:function() {$('#mpLoading').modal('show');},
	hide:function() {$('#mpLoading').modal('hide');}
};  


function Service(http_, servico_){
		var http = http_;
		var servico = servico_;

		function getUrl(path) {     
			if(path != null && path.length > 0){
				return servico.path + path;
			}
			return servico.path;
		}  
		
		function pesquisar(path, listener, config) {  
		    http.get(getUrl(path), config)
		    	.success(function(data, status, headers, config) { 
					if(data.sucesso == null){ 
						sessionExpired();
					}else{
						if(!data.sucesso){ 
							showMessage(data.sucesso, data.msg);  
						} 
						if(listener){
							listener(data.dados.RESPOSTA);
						}
					} 
		    	 }); 
		} 

		function salvar(path, obj, config, idModal, listener) {  
			mpLoading.show();
			http.post(getUrl(path), obj, config)
				.success(function (data, status, headers, config) {
					if(data.sucesso == null){ 
						sessionExpired();
						mpLoading.hide();
					}else{
						showMessage(data.sucesso, data.msg);  
						mpLoading.hide();
						if(listener){
							listener(data.dados.RESPOSTA);
						}
					}
			    	$('#'+idModal).modal('hide');  
				})
				.error(function(data, status, headers, config) { 
					mpLoading.hide();
					showMessage(false, data); 
					$('#'+idModal).modal('show'); 
				});
		}
		
		function alterar(path, obj, config, idModal, listener) {  
			mpLoading.show();
			http.put(getUrl(path), obj, config)
			.success(function (data, status, headers, config) {
				if(data.sucesso == null){ 
					sessionExpired();
					mpLoading.hide();
				}else{
					showMessage(data.sucesso, data.msg);  
					mpLoading.hide();
					if(listener){
						listener(data.dados.RESPOSTA);
					}
				}
				$('#'+idModal).modal('hide');  
			})
			.error(function(data, status, headers, config) { 
				mpLoading.hide();
				showMessage(false, data); 
				$('#'+idModal).modal('show'); 
			});
		}
		
		function excluir(path, config, idModal, listener) {  
			mpLoading.show();
			http({method: 'DELETE',url: getUrl(path), config:config})
			.success(function (data, status, headers, config) {
				if(data.sucesso == null){ 
					sessionExpired();
					mpLoading.hide();
				}else{
					showMessage(data.sucesso, data.msg);  
					mpLoading.hide();
					if(listener){
						listener();
					}
				}
				$('#'+idModal).modal('hide');  
			})
			.error(function(data, status, headers, config) { 
				mpLoading.hide();
				showMessage(false, data); 
				$('#'+idModal).modal('show'); 
			});
		} 
		
		return {
			'pesquisar': pesquisar
		     , 'salvar': salvar 
			, 'alterar': alterar 
			, 'excluir': excluir 
		}
};
	  

function Parametros(http_){
		var http = http_;  
		
		function pesquisar(path, listener, config) {  
		    http.get('/rest/parametros'+path, config)
		    	.success(function(data, status, headers, config) {
					if(data.sucesso == null){ 
						sessionExpired();
					}else{
						if(!data.sucesso){ 
							showMessage(data.sucesso, data.msg);  
						} 
						if(listener){
							listener(data.dados.RESPOSTA);
						}
					}  
		    	 }); 
		}   
		
		return {
			'pesquisar': pesquisar 
		   ,'find':find
		}
};
