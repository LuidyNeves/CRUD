//JAVASCRIPT

//quando a pagina carregar
window.onload=function(){
	listar();
	document.getElementById('frmCadastro').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('frmCadastro').addEventListener('submit', listar);
}

//variavel global
var idAlterar = null;

//Evento do botao cadastrar/salvar (verificação)
function adicionarOuAlterar(e){
	var nom = document.getElementById('txtNome').value;
	var p = {
		nome : !nom ? "sem nome": nom, //mesmo que if(nom = ""){ nom = "sem nome";}
		lanc : new Date(document.getElementById('dtpDataLancamento').value.replace("-","/")),
		tipo : document.getElementById('rdoNotebook').checked ? 'Notebook' : 'Celular',
		data : new Date()
	}

	if(idAlterar == null)	
		adicionar(p);
	else if(idAlterar > 0)
		alterar(p);
	else
		alert("Não foi possivel realizar a ação");	
	
	//bloqueia a ação de atualização do browser
	e.preventDefault();
}

function adicionar(p){	
	var produtos = [];	
	var idValido = 1;	
	//se já possuir o localStorage, adiciono no array	
	if(localStorage.getItem('value') !== null ){
		produtos = JSON.parse(localStorage.getItem('value')); //captura o array de objetos(JSON);
				
		if(produtos.length > 0)
			idValido = 	(function obterIdValido() {	//Função Auto-executável
							 //percorre verificando se tiver "buraco" entre os numeros
							for(var i = 0; i < produtos.length; i++)
								if(produtos[i].Id != i+1)
									return i + 1;							
							//se nao achar, retorna o id posterior da ultima pessoa
							return produtos[produtos.length - 1].Id + 1;
						})();
	}	
	
	var produto = {
		Id: idValido,
		Nome: p.nome,
		DataLancamento: p.lanc.toLocaleString("pt-BR").substring(0, 10),
		Tipo: p.tipo,
		DataCadastro : p.data.toLocaleString("pt-BR")
	};
	
	//Adiciona o objeto ao ultimo indice do array
	produtos.push(produto);	
	//Ordeno o array pelo ID do objeto
	produtos.sort(function(a,b) {
		return a.Id - b.Id;
	});			
	//armazena no Localstorage
	localStorage.setItem('value', JSON.stringify(produtos));	
	//reseta os campos do formulario
	document.getElementById('frmCadastro').reset();	
}

function alterar(p){
	var btn = document.getElementById('btnCadastrarSalvar');	

	produtos = JSON.parse(localStorage.getItem('value'));
	//substituir as informaçoes
	for(var i = 0; i < pessoas.length; i++){
		if(produtos[i].Id == idAlterar){
			produtos[i].Nome = p.nome;
			produtos[i].DataLancamento = p.lanc.toLocaleString("pt-BR").substring(0, 10);
			produtos[i].Tipo = p.tipo;
			produtos[i].DataCadastro = p.data.toLocaleString("pt-BR");
			
			btn.value = "Cadastrar";
			idAlterar = null;

			localStorage.setItem('value', JSON.stringify(produtos));	
			document.getElementById('frmCadastro').reset();			
			break;
		}
	}
}

//função do botao Alterar
function prepararAlterar(idRow){	
	document.getElementById('btnCadastrarSalvar').value = "Salvar";
	
	var txtNome = document.getElementById('txtNome'),
	    dtpDataLancamento = document.getElementById('dtpDataLancamento'),
	    rdoNotebook = document.getElementById('rdoNotebook'),
	    rdoCelular = document.getElementById('rdoCelular');

	var produtos = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < produtos.length; i++){
		if(produtos[i].Id == idRow){			
			//popular os campos
			txtNome.value = produtos[i].Nome;
			dtpDataLancamento.value = produtos[i].DataLancamento.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1'); //caso fosse tipo date toISOString().substring(0, 10);
			rdoNotebook.checked = !(rdoCelular.checked = (produtos[i].Tipo == 'Celular'));
			
			//recarrega a lista para limpar o th com background alterado
			listar();
			//coloco ID null (caso clicar varias vezes no botão de alterar)
			idAlterar = null;
			if(idAlterar === null){
				//mudar o background da nova linha
				var th = document.getElementById("rowTable"+i);				
				th.className = "estadoAlteracao";				
			}

			//atribuir o Id a variavel global
			idAlterar = produtos[i].Id;
			break;
		}
	}
}

function excluir(cod){
	var produtos = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < produtos.length; i++)
		if(produtos[i].Id == cod)
			produtos.splice(i, 1);
				
	
	localStorage.setItem('value', JSON.stringify(produtos));
	listar();
	
	//se nao possuir mais nenhum registro, limpar o storage
	if(produtos.length == 0)
		window.localStorage.removeItem("value");
}

function listar(){
	//se nao possuir nenhum local storage, nao fazer nada
	if(localStorage.getItem('value') === null)
		return;
	
	//captura os objetos de volta
	var produtos = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tbodyResultados");

	//limpar o body toda vez que atualizar
	tbody.innerHTML = '';
	
	for(var i = 0; i < produtos.length; i++){
		var	id = produtos[i].Id,
		    nome = produtos[i].Nome,
		    lanc = produtos[i].DataLancamento,
		    tipo = produtos[i].Tipo,
			data = produtos[i].DataCadastro
			       
		tbody.innerHTML += '<tr id="rowTable'+i+'">'+
								'<td>'+id+'</td>'+
								'<td>'+nome+'</td>'+
								'<td>'+lanc+'</td>'+
								'<td>'+tipo+'</td>'+
								'<td>'+data+'</td>'+
								'<td><button onclick="excluir(\'' + id + '\')">Excluir</button></td>'+
								'<td><button onclick="prepararAlterar(\'' + id + '\')">Alterar</button></td>'+
						   '</tr>';		
	}
}
							//'<td class="celTable'+i+'">'+id+'</td>'+
