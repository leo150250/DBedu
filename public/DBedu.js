const buttonFerramentaEntidade = document.getElementById("buttonFerramentaEntidade");
const buttonFerramentaAtributo = document.getElementById("buttonFerramentaAtributo");
const divWorkspace = document.getElementById("workspace");

var ferramentaSelecionada=null;
var botaoFerramenta=null;

function selecionarFerramenta(argFerramenta) {
	if (ferramentaSelecionada!=null) {
		botaoFerramenta.classList.remove("selecionado");
	}
	switch (argFerramenta) {
		case "E":
			botaoFerramenta=buttonFerramentaEntidade;
			ferramentaSelecionada="E";
			break;
		case "A":
			botaoFerramenta=buttonFerramentaAtributo;
			ferramentaSelecionada="A";
			break;
		default:
			ferramentaSelecionada=null;
			botaoFerramenta=null;
	}
	if (ferramentaSelecionada!=null) {
		botaoFerramenta.classList.add("selecionado");
	}
}

var entidades = [];
var numEntidades = 0;
class Entidade {
	constructor(argNome="entidade"+numEntidades) {
		this.nome = argNome;
		this.atributos = [];
		this.elemento = document.createElement("div");
		this.elemento.classList.add("elemento");
		divWorkspace.appendChild(this.elemento);
		entidades.push(this);
		numEntidades++;
		console.log("Entidade criada!");
	}
}

var atributos = [];
var numAtributos = 0;
class Atributo {
	constructor(argNome) {
		this.nome = argNome;
		this.primario = false;
		this.entidade = null;
		this.elemento = document.createElement("div");
		this.elemento.classList.add("atributo");
		divWorkspace.appendChild(this.atributo);
		atributos.push(this);
		numAtributos++;
	}
}

function criarEntidade(argNome) {
	let novaEntidade = new Entidade();
	return novaEntidade;
}

criarEntidade("oi!");