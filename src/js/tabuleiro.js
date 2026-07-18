// ============================================================
// Bingo Online — tela de controle
// Estado do jogo, tabuleiro e sorteio/desmarcação de números.
// A criação da pedra fica em pedra.js (compartilhado com a tela de
// transmissão); os pop-ups de confirmação ficam em modais.js.
// ============================================================

const form = document.getElementById("form-numero");
const input = document.getElementById("input-numero");
const mensagemErro = document.getElementById("mensagem-erro");
const dica = document.getElementById("dica");
const palco = document.getElementById("palco");
const tabuleiro = document.getElementById("tabuleiro");
const btnLimpar = document.getElementById("btn-limpar");
const btnDesfazer = document.getElementById("btn-desfazer");

// Números já sorteados (persistem ao recarregar a página)
let sorteados = JSON.parse(localStorage.getItem("bingo-sorteados") || "[]");

// ---------- Tabuleiro de 1 a 75 (clique na bolinha para sortear) ----------
// Uma linha por faixa do bingo (B 1-15, I 16-30, N 31-45, G 46-60,
// O 61-75), com o selo da letra à esquerda — a mesma separação usada
// na pedra sorteada.
function montarTabuleiro() {
  tabuleiro.innerHTML = "";

  for (let inicio = 1; inicio <= 75; inicio += 15) {
    const letra = letraDoNumero(inicio);

    const linha = document.createElement("div");
    linha.className = "linha-tabuleiro";

    const selo = document.createElement("div");
    selo.className = `letra-linha cor-${letra.toLowerCase()}`;
    selo.textContent = letra;
    linha.appendChild(selo);

    const celulas = document.createElement("div");
    celulas.className = "celulas-linha";

    for (let n = inicio; n < inicio + 15; n++) {
      const celula = document.createElement("div");
      celula.className = "celula";
      celula.id = `celula-${n}`;
      celula.textContent = n;
      celula.title = `Clique para sortear o ${n}`;
      if (sorteados.includes(n)) celula.classList.add("sorteado");
      celula.addEventListener("click", () => {
        if (sorteados.includes(n)) {
          abrirModalDesmarcar(n);
        } else {
          realizarSorteio(n);
        }
      });
      celulas.appendChild(celula);
    }

    linha.appendChild(celulas);
    tabuleiro.appendChild(linha);
  }
}

function mostrarErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.hidden = false;
}

function limparErro() {
  mensagemErro.hidden = true;
}

// ---------- Pedra com animação (prévia na tela de controle) ----------
// Trocar a pedra pode mudar a altura do palco, o que desloca o conteúdo
// abaixo dele (ex.: o tabuleiro). Guardamos o scroll e restauramos depois
// para quem clicou numa bolinha do tabuleiro não ver a tela "pular".
function sortearPedra(numero) {
  const scrollAntes = window.scrollY;
  dica.hidden = true;
  const containerAntigo = palco.querySelector(".pedra-container");
  if (containerAntigo) containerAntigo.remove();
  palco.appendChild(criarPedraElemento(numero));
  window.scrollTo(0, scrollAntes);
}

// Avisa a tela de transmissão qual foi a última pedra sorteada
function avisarTransmissao(numero) {
  localStorage.setItem(
    "bingo-ultimo",
    JSON.stringify({ numero: numero, ts: Date.now() })
  );
}

// ---------- Sorteio (usado pelo formulário e pelo clique no tabuleiro) ----------
function realizarSorteio(numero) {
  limparErro();

  if (isNaN(numero) || numero < 1 || numero > 75) {
    mostrarErro("Digite um número válido entre 1 e 75.");
    return;
  }

  if (sorteados.includes(numero)) {
    mostrarErro(`O número ${numero} já foi sorteado!`);
    return;
  }

  sorteados.push(numero);
  localStorage.setItem("bingo-sorteados", JSON.stringify(sorteados));

  sortearPedra(numero);
  avisarTransmissao(numero);
  document.getElementById(`celula-${numero}`).classList.add("sorteado");

  input.value = "";
  input.focus();
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  realizarSorteio(parseInt(input.value, 10));
});

// Some com a pedra do palco sem deixar a página "pular" para cima:
// remover a pedra encolhe o palco, e o navegador mantém o scrollY fixo,
// então o conteúdo abaixo sobe visualmente. Restauramos o scroll depois.
function esconderPedraSemPular() {
  const scrollAntes = window.scrollY;
  const container = palco.querySelector(".pedra-container");
  if (container) container.remove();
  dica.hidden = false;
  window.scrollTo(0, scrollAntes);
}

// ---------- Desmarcar um número (corrige clique/digitação errada) ----------
function desmarcarNumero(numero) {
  const indice = sorteados.indexOf(numero);
  if (indice === -1) return;

  sorteados.splice(indice, 1);
  localStorage.setItem("bingo-sorteados", JSON.stringify(sorteados));
  document.getElementById(`celula-${numero}`).classList.remove("sorteado");

  // Se o número desmarcado era a última pedra mostrada, some com ela
  // também na tela de controle e avisa a tela de transmissão.
  const ultimo = JSON.parse(localStorage.getItem("bingo-ultimo") || "null");
  if (ultimo && ultimo.numero === numero) {
    localStorage.removeItem("bingo-ultimo");
    esconderPedraSemPular();
  }
}

btnDesfazer.addEventListener("click", () => {
  if (sorteados.length === 0) return;
  desmarcarNumero(sorteados[sorteados.length - 1]);
});

montarTabuleiro();
