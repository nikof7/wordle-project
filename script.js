const height = 6;
const width = 5;

let row = 0;
let col = 0;
let word = "";
let hintText = "";
let gameOver = false;

window.onload = () => {
  loadWord().then(initializeGame);
};

async function loadWord() {
  try {
    const response = await fetch('words.json');
    if (!response.ok) throw new Error('No se pudo cargar el archivo');

    const data = await response.json();
    const random = data[Math.floor(Math.random() * data.length)];
    word = random.word;
    hintText = random.def;
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
  }
}

function initializeGame() {
  createBoard();
  setupInput();
  setupHint();
}

function createBoard() {
  const board = document.getElementById("board");
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const tile = document.createElement("span");
      tile.id = `${r}-${c}`;
      tile.classList.add("tile");
      board.appendChild(tile);
    }
  }
}

function setupInput() {
  document.addEventListener("keyup", (e) => {
    if (gameOver || row >= height) return;

    if (/^[a-zA-Z]$/.test(e.key) && col < width) {
      const tile = document.getElementById(`${row}-${col}`);
      tile.innerText = e.key.toUpperCase();
      col++;
      if (col === width) checkWord();
    } else if (e.key === "Backspace" && col > 0) {
      col--;
      document.getElementById(`${row}-${col}`).innerText = "";
    }
  });
}

function setupHint() {
  const hintCall = document.querySelector('.hint-call');
  const hint = document.querySelector('.hint');

  hintCall.addEventListener('click', () => {
    hintCall.style.visibility = 'hidden';
    hint.style.visibility = 'visible';
    hint.innerText = hintText;
    hint.classList.add('show');
  });
}

function checkWord() {
  let guess = [];

  for (let i = 0; i < width; i++) {
    const tile = document.getElementById(`${row}-${i}`);
    const letter = tile.innerText.toLowerCase();
    guess.push(letter);

    setTimeout(() => {
      tile.classList.add("flipped");

      if (word[i] === letter) {
        tile.classList.add("correct");
      } else if (word.includes(letter)) {
        tile.classList.add("regular");
      } else {
        tile.classList.add("incorrect");
      }
    }, i * 300);
  }

  setTimeout(() => {
    const guessWord = guess.join("");
    if (guessWord === word) {
      endGame("¡Ganaste!");
    } else if (row === height - 1) {
      endGame("Perdiste :/");
    } else {
      row++;
      col = 0;
    }
  }, width * 300);
}

function endGame(message) {
  gameOver = true;
  document.getElementById("gameOverResult").innerText = message;
  document.getElementById("gameOver").classList.remove("hidden");
}
