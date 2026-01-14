let seuvotoPara = document.querySelector(".d-1-1 span");
let cargo = document.querySelector(".d-1-2 span");
let descricao = document.querySelector(".d-1-4");
let aviso = document.querySelector(".d-2");

//area leteral

let area_lateral = document.querySelector(".d-1-right");
let numeros = document.querySelector(".d-1-3");

//variaveis de ambiente
let etapaAtual = 0;
let numeroHtml = "";
let numeroDigitado = "";
let branco = false;
let votos = [];

function comecarEtapa() {
  let etapa = etapas[etapaAtual];
  numeroHtml = "";
  numeroDigitado = "";
  branco = false;

  for (let i = 0; i < etapa.numeros; i++) {
    if (i == 0) {
      numeroHtml += `<div class="numero pisca"></div>`;
    } else {
      numeroHtml += `<div class="numero"></div>`;
    }
  }

  seuvotoPara.style.display = "none";
  cargo.innerHTML = etapa.titulo;
  descricao.innerHTML = "";
  aviso.style.display = "none";
  area_lateral.style.display = "none";
  numeros.innerHTML = numeroHtml;
}

function atualizainterface() {
  //Precisa saber quem a quem pertence os votos se é para prefeito ou vereador;

  let etapa = etapas[etapaAtual];
  let candidato = etapa.candidatos.filter((item) => {
    if (item.numero === numeroDigitado) {
      return true;
    } else return false;
  });

  if (candidato.length > 0) {
    candidato = candidato[0];
    seuvotoPara.style.display = "block"; //mostra o voto com display blcok;
    descricao.innerHTML = `
      Nome: ${candidato.nome}</br>
      Partido: ${candidato.partido}</br>
      Vice: ${candidato.vice || ""}
      `;
    aviso.style.display = "block";

    //com são varias fotos precisamos percorrer elas e montar suas estrutura;
    let fotosHtml = "";
    for (let i in candidato.fotos) {
      let small = candidato.fotos[i].small ? "small" : "";
      fotosHtml += `
        <div class = "d-1-image ${small}">
          <img src = "images/${candidato.fotos[i].url}" alt = ""/>
          ${candidato.fotos[i].legenda}
        </div>
      `;
    }
    area_lateral.innerHTML = fotosHtml;
    area_lateral.style.display = "block";
  } else {
    seuvotoPara.style.display = "block";
    aviso.style.display = "block";
    descricao.innerHTML =
      '<div class="aviso-grande pisca"><span>VOTO NULLO</span></div>';
  }
}

function clicou(n) {
  let elNumero = document.querySelector(".numero.pisca");
  if (elNumero !== null) {
    elNumero.innerHTML = n;
    numeroHtml = `${numeroHtml}${n}`;
    numeroDigitado += n;
    elNumero.classList.remove("pisca");

    if (elNumero.nextElementSibling !== null) {
      //nextElement significa proximo elemento.
      elNumero.nextElementSibling.classList.add("pisca");
    } else {
      atualizainterface();
    }
  }
}

function Branco() {
  numeroDigitado = "";
  branco = true;
  seuvotoPara.style.display = "block";
  aviso.style.display = "block";
  numeros.innerHTML = "";
  descricao.innerHTML =
    '<div class="aviso-grande pisca"><span>VOTO EM BRANCO</span></div>';
  area_lateral.innerHTML = "";
  area_lateral.style.display = "none";
}

function Corrige() {
  return comecarEtapa();
}

function Confirma() {
  let votoConfirmado = false;
  let etapa = etapas[etapaAtual];
  if (branco) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].titulo,
      numero: "Branco",
    });
  } else if (numeroDigitado.length === etapa.numeros) {
    votoConfirmado = true;
    votos.push({
      etapa: etapas[etapaAtual].titulo,
      numero: numeroDigitado,
    });

    atualizarPainelDeVotos();
  }

  if (votoConfirmado) {
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      comecarEtapa();
    } else {
      document.querySelector(".tela").innerHTML =
        '<div class="aviso-gigante pisca">FIM!</div>';
    }
  }
}

function atualizarPainelDeVotos() {
  let area_vereador = document.querySelector(".votos-vereador span");
  let area_prefeito = document.querySelector(".votos-prefeito span");

  area_vereador.innerHTML = "";
  area_prefeito.innerHTML = "";

  votos.forEach((voto) => {
    if (voto.etapa === "VEREADOR") {
      area_vereador.innerHTML += `${voto.numero}`;
    } else if (voto.etapa === "PREFEITO") {
      area_prefeito.innerHTML += `${voto.numero}`;
    }
  });
}
comecarEtapa();

//Na ultima etapa ele chega no fim!
