const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const restartBtn = document.getElementById('restart-btn');

const cellCount = 25; // 🔧 Grid will be 25x25 to fit well in most screens
const totalCells = cellCount * cellCount;

let snake = [2, 1, 0];
let direction = 1;
let foodIndex = 0;
let intervalTime = 200;
let timerId = null;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;

// Sounds
const moveSound = new Audio('move.mp3');
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

// Setup grid
board.style.gridTemplateColumns = `repeat(${cellCount}, 1fr)`;
board.innerHTML = '';
for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  board.appendChild(cell);
}
const cells = document.querySelectorAll('.cell');

function startGame() {
  snake = [2, 1, 0];
  direction = 1;
  score = 0;
  intervalTime = 70;
  scoreDisplay.textContent = `Score: ${score}`;
  highScoreDisplay.textContent = `High Score: ${highScore}`;
  restartBtn.style.display = "none";

  cells.forEach(cell => cell.className = 'cell');

  drawSnake();
  generateFood();
  clearInterval(timerId);
  timerId = setInterval(move, intervalTime);
}

function drawSnake() {
  cells.forEach(cell => cell.classList.remove('snake-head', 'snake-body', 'snake-tail'));
  snake.forEach((index, i) => {
    if (i === 0) cells[index].classList.add('snake-head');
    else if (i === snake.length - 1) cells[index].classList.add('snake-tail');
    else cells[index].classList.add('snake-body');
  });
}

function move() {
  moveSound.currentTime = 0;
  moveSound.play();

  const head = snake[0];
  const next = head + direction;

  const hitLeft = head % cellCount === 0 && direction === -1;
  const hitRight = head % cellCount === cellCount - 1 && direction === 1;
  const hitTop = head < cellCount && direction === -cellCount;
  const hitBottom = head >= totalCells - cellCount && direction === cellCount;

  if (
    hitLeft || hitRight || hitTop || hitBottom ||
    cells[next].classList.contains('snake-body') ||
    cells[next].classList.contains('snake-tail')
  ) {
    return gameOver();
  }

  const tail = snake.pop();
  cells[tail].classList.remove('snake-head', 'snake-body', 'snake-tail');
  snake.unshift(next);

  if (next === foodIndex) {
    eatSound.play();
    cells[foodIndex].classList.remove('food');
    snake.push(tail);
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
  }

  drawSnake();
}

function generateFood() {
  do {
    foodIndex = Math.floor(Math.random() * totalCells);
  } while (
    cells[foodIndex].classList.contains('snake-head') ||
    cells[foodIndex].classList.contains('snake-body') ||
    cells[foodIndex].classList.contains('snake-tail')
  );
  cells[foodIndex].classList.add('food');
}

function gameOver() {
  clearInterval(timerId);
  gameOverSound.play();
  if (score > highScore) {
    localStorage.setItem("snakeHighScore", score);
    highScore = score;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }
  restartBtn.style.display = "inline-block";
  alert('Ah! Bobo! Mete ka!');
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction !== cellCount) direction = -cellCount;
  else if (e.key === 'ArrowDown' && direction !== -cellCount) direction = cellCount;
  else if (e.key === 'ArrowLeft' && direction !== 1) direction = -1;
  else if (e.key === 'ArrowRight' && direction !== -1) direction = 1;
});

restartBtn.addEventListener('click', startGame);
startGame();
