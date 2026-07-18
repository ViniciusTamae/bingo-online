// ============================================================
// Bingo Online — tela de controle
// Pop-ups de confirmação (desmarcar um número e reiniciar o jogo).
// Depende do estado e das funções definidas em tabuleiro.js.
// ============================================================

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
