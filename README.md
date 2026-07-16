# 🎱 Bingo Online

Aplicativo de bingo onde você digita um número de 1 a 75, a pedra sobe com
animação e o nome da pessoa correspondente aparece embaixo.

## Como usar

1. Abra o arquivo `index.html` no navegador (basta dar dois cliques nele).
2. Digite um número de 1 a 75 e clique em **Enviar**.
3. A pedra sobe com animação, mostrando a letra do bingo (B-I-N-G-O), o
   número e o nome da pessoa embaixo.
4. O tabuleiro na parte de baixo marca todos os números já sorteados.
5. Números repetidos são bloqueados. Os sorteios ficam salvos mesmo se você
   fechar a página — use o botão **🔄 Reiniciar** para começar um novo jogo.

## Como cadastrar os nomes

Edite o arquivo `nomes.js`. Cada número tem um nome:

```js
const NOMES = {
  1: "Vinicius",
  2: "Tamae",
  3: "Maria",
  ...
};
```

## Fotos das pedras (opcional)

Coloque fotos na pasta `img/` com o número como nome do arquivo
(`img/1.jpg`, `img/2.png`, etc.). Se a foto existir, ela aparece no lugar
da bola desenhada.

## Arquivos

| Arquivo      | O que é                                    |
| ------------ | ------------------------------------------ |
| `index.html` | Página principal                           |
| `style.css`  | Visual e animações                         |
| `script.js`  | Lógica do jogo                             |
| `nomes.js`   | Lista de nomes (edite aqui!)               |
| `img/`       | Fotos opcionais das pedras                 |

## Baixar como programa para Windows (.exe)

Não precisa de navegador nem internet: baixe o instalador na
[página de Releases](../../releases) deste repositório e execute o
`Bingo Online Setup.exe` (ou a versão portátil, que não precisa instalar).

## Gerando o .exe você mesmo (desenvolvimento)

O app é empacotado com [Electron](https://www.electronjs.org/). Um workflow
do GitHub Actions (`.github/workflows/build.yml`) já gera o `.exe`
automaticamente sempre que uma tag `vX.Y.Z` é publicada — o arquivo aparece
sozinho na aba Releases.

Para rodar localmente:

```bash
npm install
npm start        # abre o app em uma janela desktop
npm run dist      # gera o instalador em dist/
```
