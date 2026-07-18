// ============================================================
// Bingo Online — tela de controle
// (a criação da pedra fica em pedra.js, compartilhado com a
//  tela de transmissão)
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
function montarTabuleiro() {
  tabuleiro.innerHTML = "";
  for (let n = 1; n <= 75; n++) {
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
    tabuleiro.appendChild(celula);
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

// ---------- Pop-up de confirmação ao desmarcar um número ----------
const modalDesmarcar = document.getElementById("modal-desmarcar");
const textoDesmarcar = document.getElementById("texto-desmarcar");
const btnCancelarDesmarcar = document.getElementById("btn-cancelar-desmarcar");
const btnConfirmarDesmarcar = document.getElementById("btn-confirmar-desmarcar");
let numeroParaDesmarcar = null;

function abrirModalDesmarcar(numero) {
  numeroParaDesmarcar = numero;
  textoDesmarcar.textContent = `Desmarcar o número ${numero}? Ele volta a ficar disponível para sorteio.`;
  modalDesmarcar.hidden = false;
}

function fecharModalDesmarcar() {
  modalDesmarcar.hidden = true;
  numeroParaDesmarcar = null;
}

btnCancelarDesmarcar.addEventListener("click", fecharModalDesmarcar);

btnConfirmarDesmarcar.addEventListener("click", () => {
  if (numeroParaDesmarcar !== null) desmarcarNumero(numeroParaDesmarcar);
  fecharModalDesmarcar();
});

modalDesmarcar.addEventListener("click", (evento) => {
  if (evento.target === modalDesmarcar) fecharModalDesmarcar();
});

// ---------- Reiniciar o jogo (com pop-up de confirmação) ----------
const modalReiniciar = document.getElementById("modal-reiniciar");
const btnCancelarReinicio = document.getElementById("btn-cancelar-reinicio");
const btnConfirmarReinicio = document.getElementById("btn-confirmar-reinicio");

btnLimpar.addEventListener("click", () => {
  modalReiniciar.hidden = false;
});

btnCancelarReinicio.addEventListener("click", () => {
  modalReiniciar.hidden = true;
});

// Fecha o pop-up ao clicar fora da caixa ou apertar Esc
modalReiniciar.addEventListener("click", (evento) => {
  if (evento.target === modalReiniciar) modalReiniciar.hidden = true;
});

document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;
  modalReiniciar.hidden = true;
  if (!modalDesmarcar.hidden) fecharModalDesmarcar();
});

btnConfirmarReinicio.addEventListener("click", () => {
  modalReiniciar.hidden = true;
  sorteados = [];
  localStorage.removeItem("bingo-sorteados");
  localStorage.removeItem("bingo-ultimo");
  montarTabuleiro();
  esconderPedraSemPular();
});

montarTabuleiro();
