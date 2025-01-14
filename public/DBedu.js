const buttonFerramentaEntidade = document.getElementById("buttonFerramentaEntidade");
const buttonFerramentaAtributo = document.getElementById("buttonFerramentaAtributo");
const divWorkspace = document.getElementById("workspace");

var ferramentaSelecionada=null;
var botaoFerramenta=null;
const ferramentas = {
	AdicionarEntidade: "E",
	AdicionarAtributo: "A"
};

var entidades = [];
var numEntidades = 0;
var atributos = [];
var numAtributos = 0;

var elementoMover = null;

class Entidade {
	constructor(argNome="",argX=-1, argY=-1) {
		if (argNome=="") {
			argNome="entidade"+numEntidades;
		}
		this.nome = argNome;
		this.atributos = [];
		this.atributoPrimario = null;
		this.posX = argX;
		this.posY = argY;
		
		this.elemento = document.createElement("div");
		this.elemento.classList.add("elemento");
		this.elemento.innerHTML = this.nome;
		this.elemento.contentEditable = false;
		this.el_opcoes = document.createElement("div");
		this.el_opcoes.classList.add("opcoes");
		this.elemento.appendChild(this.el_opcoes);
		
		this.elemento.onmouseenter = (e)=>{
			if (this.elemento.contentEditable=="false") {
				if (ferramentaSelecionada==ferramentas.AdicionarAtributo) {
					this.elemento.style.cursor = "copy";
				} else {
					this.elemento.style.cursor = "grab";
				}
			}
		}
		this.elemento.onmouseleave = (e)=>{
			this.elemento.style.cursor = null;
		}
		this.elemento.onmousedown = (e)=>{
			if (this.elemento.contentEditable=="false") {
				this.elemento.style.cursor = null;
				moverElemento(this);
			}
		}
		this.elemento.onmouseup = (e)=>{
			if (this.elemento.contentEditable=="false") {
				this.elemento.style.cursor = "grab";
			}
		}
		this.elemento.ondblclick = (e)=>{
			this.alterarNome();
		}
		
		divWorkspace.appendChild(this.elemento);
		entidades.push(this);
		numEntidades++;
		console.log("Entidade criada!");
		
		if (this.posX==-1 && this.posY==-1) {
			this.mover((document.body.offsetWidth / 2) - 100,(document.body.offsetHeight / 2) - 50, false);
		} else {
			this.mover(this.posX,this.posY,false);
		}
	}
	mover(argX,argY,argRelativo=true) {
		if (argRelativo) {
			this.posX += argX;
			this.posY += argY;
			this.atributos.forEach(atributo=>{
				atributo.mover(argX,argY);
			});
		} else {
			this.posX = argX;
			this.posY = argY;
		}
		this.elemento.style.left = this.posX + "px";
		this.elemento.style.top = this.posY + "px";
	}
	adicionarAtributo(argNome="",argOrganizar=true) {
		if (argNome=="") {
			argNome="atributo"+this.atributos.length;
		}
		let novoAtributo = new Atributo(this,argNome);
		if (this.atributos.length == 1) {
			novoAtributo.definirPrimario();
		}
		if (argOrganizar) {
			this.organizarAtributos();
		}
		return novoAtributo;
	}
	organizarAtributos() {
		let lado=0;
		let divOrganizador = document.createElement("div");
		divOrganizador.classList.add("organizador");
		divOrganizador.style.width="10px";
		divOrganizador.style.height=this.elemento.offsetHeight;
		divWorkspace.appendChild(divOrganizador);
		let posicoes=[];
		this.atributos.forEach(atributo=>{
			divOrganizador.appendChild(atributo.elemento);
		});
		this.atributos.forEach(atributo=>{
			let novaPosicao=[
				this.posX + this.elemento.offsetWidth + atributo.elemento.offsetLeft,
				this.posY + atributo.elemento.offsetTop
			]
			posicoes.push(novaPosicao);
		});
		//console.log(posicoes);
		for (let i = 0; i < this.atributos.length; i++) {
			divWorkspace.appendChild(this.atributos[i].elemento);
			this.atributos[i].mover(posicoes[i][0],posicoes[i][1],false);
		}
		divWorkspace.removeChild(divOrganizador);
	}
	alterarNome(argNome=null) {
		if (argNome==null) {
			this.elemento.contentEditable = true;
			this.elemento.style.cursor = null;
			if (window.getSelection && document.createRange) {
				let range = document.createRange();
				range.selectNodeContents(this.elemento);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);
			}
			this.elemento.focus();
			this.elemento.onblur=(e)=>{
				this.alterarNome(this.elemento.innerHTML);
			}
			this.elemento.onkeydown=(e)=>{
				if (e.code=="Enter") {
					this.alterarNome(this.elemento.innerHTML);
				}
			};
		} else {
			window.getSelection().removeAllRanges();
			this.elemento.onblur=null;
			this.elemento.onkeydown=null;
			this.elemento.contentEditable = false;
			this.nome = argNome;
			this.elemento.innerHTML = this.nome;
		}
	}
}
class Atributo {
	constructor(argEntidade, argNome) {
		this.nome = argNome;
		this.primario = false;
		this.entidade = argEntidade;
		this.entidade.atributos.push(this);
		this.posX = -1;
		this.posY = -1;

		this.elemento = document.createElement("div");
		this.elemento.classList.add("atributo");
		this.el_icone = document.createElement("div");
		this.el_icone.classList.add("icone");
		this.elemento.appendChild(this.el_icone);
		this.el_texto = document.createElement("div");
		this.el_texto.classList.add("texto");
		this.el_texto.innerHTML = this.nome;
		this.elemento.appendChild(this.el_texto);

		this.elemento.ondblclick = (e)=>{
			this.alterarNome();
		}
		
		divWorkspace.appendChild(this.elemento);
		atributos.push(this);
		numAtributos++;
	}
	mover(argX,argY,argRelativo=true) {
		if (argRelativo) {
			this.posX += argX;
			this.posY += argY;
		} else {
			this.posX = argX;
			this.posY = argY;
		}
		this.elemento.style.left = this.posX + "px";
		this.elemento.style.top = this.posY + "px";
	}
	definirPrimario() {
		if (this.entidade.atributoPrimario!=null) {
			this.entidade.atributoPrimario.el_icone.classList.remove("primario");
			this.entidade.atributoPrimario = null;
		}
		this.el_icone.classList.add("primario");
		this.entidade.atributoPrimario = this;
	}
	alterarNome(argNome=null) {
		if (argNome==null) {
			this.el_texto.contentEditable = true;
			if (window.getSelection && document.createRange) {
				let range = document.createRange();
				range.selectNodeContents(this.el_texto);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);
			}
			this.el_texto.focus();
			this.el_texto.onblur=(e)=>{
				this.alterarNome(this.el_texto.innerHTML);
			}
			this.el_texto.onkeydown=(e)=>{
				if (e.code=="Enter") {
					this.alterarNome(this.el_texto.innerHTML);
				}
			};
		} else {
			window.getSelection().removeAllRanges();
			this.el_texto.onblur=null;
			this.el_texto.onkeydown=null;
			this.el_texto.contentEditable = false;
			this.nome = argNome;
			this.el_texto.innerHTML = this.nome;
		}
	}
}

//#region Funções
function selecionarFerramenta(argFerramenta) {
	if (ferramentaSelecionada!=null) {
		botaoFerramenta.classList.remove("selecionado");
	}
	switch (argFerramenta) {
		case "E":
			botaoFerramenta=buttonFerramentaEntidade;
			ferramentaSelecionada="E";
			divWorkspace.style.cursor = "crosshair";
			break;
		case "A":
			botaoFerramenta=buttonFerramentaAtributo;
			ferramentaSelecionada="A";
			divWorkspace.style.cursor = "not-allowed";
			break;
		default:
			divWorkspace.style.cursor = null;
			if (botaoFerramenta!=null) {
				botaoFerramenta.blur();
				botaoFerramenta=null;
			}
			ferramentaSelecionada=null;
	}
	if (ferramentaSelecionada!=null) {
		botaoFerramenta.classList.add("selecionado");
	}
}
function moverElemento(argElemento) {
	elementoMover = argElemento;
	document.body.style.cursor = "grabbing";
	document.body.onmousemove=(e)=>{
		e.preventDefault();
		elementoMover.mover(e.movementX,e.movementY);
	};
	document.body.onmouseup=(e)=>{
		e.preventDefault();
		elementoMover = null;
		document.body.style.cursor = null;
		document.body.onmousemove=null;
	};
}
document.body.addEventListener("keydown",(e)=>{
	if (e.code=="Escape") {
		selecionarFerramenta(null);
	}
});
divWorkspace.addEventListener("click",(e)=>{
	switch (ferramentaSelecionada) {
		case "E": {
			let posX = e.clientX - divWorkspace.offsetLeft - 100;
			let posY = e.clientY - 50;
			let novaEntidade = new Entidade("",posX,posY);
			novaEntidade.alterarNome();
			selecionarFerramenta(null);
		} break;
		case "A": {
			entidades.forEach(entidade=>{
				if (entidade.elemento == e.target) {
					let novoAtributo = entidade.adicionarAtributo();
					novoAtributo.alterarNome();
					return;
				}
			});
			selecionarFerramenta(null);
		} break;
		default: {
			selecionarFerramenta(null);
		}
	}
});

//#endregion
let novaEntidade = new Entidade("pessoa");
novaEntidade.adicionarAtributo("id");
novaEntidade.adicionarAtributo("nome");
novaEntidade.adicionarAtributo("idade");
novaEntidade.adicionarAtributo("sqwimble");
novaEntidade.mover(-300,-100);

novaEntidade = new Entidade("departamento");
novaEntidade.adicionarAtributo("id");
novaEntidade.adicionarAtributo("nome");
novaEntidade.mover(200,150);