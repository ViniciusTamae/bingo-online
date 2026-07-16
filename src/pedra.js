// ============================================================
// Funções compartilhadas entre a tela de controle (index.html)
// e a tela de transmissão (transmissao.html)
// ============================================================

// Letra de cada faixa do bingo: B(1-15) I(16-30) N(31-45) G(46-60) O(61-75)
function letraDoNumero(n) {
  if (n <= 15) return "B";
  if (n <= 30) return "I";
  if (n <= 45) return "N";
  if (n <= 60) return "G";
  return "O";
}

// Cria o elemento completo da pedra (letra + bola + nome) já animado
function criarPedraElemento(numero) {
  const letra = letraDoNumero(numero);
  const nome = (typeof NOMES !== "undefined" && NOMES[numero]) || "";

  const container = document.createElement("div");
  container.className = "pedra-container";

  const letraEl = document.createElement("div");
  letraEl.className = `letra-bingo cor-${letra.toLowerCase()}`;
  letraEl.textContent = letra;

  const pedraEl = document.createElement("div");
  pedraEl.className = `pedra cor-${letra.toLowerCase()}`;

  const numeroEl = document.createElement("span");
  numeroEl.textContent = numero;
  pedraEl.appendChild(numeroEl);

  // Se existir uma foto em img/<numero>.jpg ou img/<numero>.png,
  // ela aparece por cima da bola desenhada.
  const foto = document.createElement("img");
  foto.alt = `Pedra ${numero}`;
  foto.hidden = true;
  foto.onload = () => { foto.hidden = false; };
  foto.onerror = () => {
    foto.onerror = null;
    foto.src = `img/${numero}.png`;
  };
  foto.src = `img/${numero}.jpg`;
  pedraEl.appendChild(foto);

  const nomeEl = document.createElement("div");
  if (nome) {
    nomeEl.className = "nome-pessoa";
    nomeEl.textContent = nome;
  } else {
    nomeEl.className = "nome-pessoa sem-nome";
    nomeEl.textContent = "";
  }

  container.appendChild(letraEl);
  container.appendChild(pedraEl);
  container.appendChild(nomeEl);

  const telefone = (typeof TELEFONES !== "undefined" && TELEFONES[numero]) || "";
  if (telefone) {
    const telEl = document.createElement("div");
    telEl.className = "telefone-pessoa";
    telEl.textContent = telefone;
    container.appendChild(telEl);
  }

  return container;
}
