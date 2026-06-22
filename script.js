const COLS = 10;
const ROWS = 20;
const DROP_INTERVAL = 800;

const LINE_SCORES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]] },
  O: { shape: [[1, 1], [1, 1]] },
  T: { shape: [[0, 1, 0], [1, 1, 1]] },
  S: { shape: [[0, 1, 1], [1, 1, 0]] },
  Z: { shape: [[1, 1, 0], [0, 1, 1]] },
  J: { shape: [[1, 0, 0], [1, 1, 1]] },
  L: { shape: [[0, 0, 1], [1, 1, 1]] },
};

const PIECE_TYPES = Object.keys(TETROMINOES);
const DEFAULT_PIECE_TYPE = "T";

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const gameStatusEl = document.getElementById("game-status");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let board = createEmptyBoard();
let currentPiece = null;
let cells = [];
let dropTimer = null;
let keyboardInitialized = false;
let score = 0;
let isGameOver = false;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function isInsideBoard(row, col) {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function forEachOccupiedCell(piece, rowOffset, colOffset, callback) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) {
        continue;
      }

      callback(piece.row + r + rowOffset, piece.col + c + colOffset);
    }
  }
}

function createPiece(type) {
  const pieceType = TETROMINOES[type] ? type : DEFAULT_PIECE_TYPE;
  const def = TETROMINOES[pieceType];

  return {
    type: pieceType,
    shape: def.shape.map((row) => [...row]),
    row: 0,
    col: Math.floor((COLS - def.shape[0].length) / 2),
  };
}

function canMove(piece, dx, dy, matrix) {
  let canPlace = true;

  forEachOccupiedCell(piece, dy, dx, (row, col) => {
    if (!isInsideBoard(row, col) || matrix[row][col] !== null) {
      canPlace = false;
    }
  });

  return canPlace;
}

function rotateMatrix(matrix) {
  const rowCount = matrix.length;
  const colCount = matrix[0].length;
  const rotated = Array.from({ length: colCount }, () => Array(rowCount).fill(0));

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      rotated[c][rowCount - 1 - r] = matrix[r][c];
    }
  }

  return rotated;
}

function isRowFull(row) {
  return row.every((cell) => cell !== null);
}

function clearLines() {
  let clearedLineCount = 0;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (!isRowFull(board[row])) {
      continue;
    }

    board.splice(row, 1);
    board.unshift(Array(COLS).fill(null));
    clearedLineCount += 1;
    row += 1;
  }

  return clearedLineCount;
}

function addScore(linesCleared) {
  if (linesCleared <= 0) {
    return;
  }

  const points = LINE_SCORES[linesCleared] ?? linesCleared * 100;
  score += points;
  scoreEl.textContent = String(score);
}

function showGameOver() {
  isGameOver = true;
  gameStatusEl.textContent = "게임 오버";
  gameStatusEl.classList.remove("hidden");
}

function hideGameOver() {
  isGameOver = false;
  gameStatusEl.textContent = "";
  gameStatusEl.classList.add("hidden");
}

function isGameRunning() {
  return dropTimer !== null && !isGameOver;
}

function finishGame() {
  currentPiece = null;
  stopDropTimer();
  showGameOver();
}

function lockPiece() {
  if (!currentPiece) {
    return;
  }

  forEachOccupiedCell(currentPiece, 0, 0, (row, col) => {
    if (!isInsideBoard(row, col)) {
      return;
    }

    board[row][col] = currentPiece.type;
  });
}

function lockAndSpawn() {
  lockPiece();
  addScore(clearLines());

  if (!spawnPiece()) {
    finishGame();
  }
}

function spawnPiece() {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  currentPiece = createPiece(type);

  if (!canMove(currentPiece, 0, 0, board)) {
    currentPiece = null;
    return false;
  }

  return true;
}

function tryMovePiece(dx, dy) {
  if (!currentPiece || isGameOver) {
    return false;
  }

  if (canMove(currentPiece, dx, dy, board)) {
    currentPiece.col += dx;
    currentPiece.row += dy;
    return true;
  }

  if (dx === 0 && dy === 1) {
    lockAndSpawn();
  }

  return false;
}

function tryRotatePiece() {
  if (!currentPiece || isGameOver) {
    return false;
  }

  const previousShape = currentPiece.shape;
  currentPiece.shape = rotateMatrix(currentPiece.shape);

  if (!canMove(currentPiece, 0, 0, board)) {
    currentPiece.shape = previousShape;
    return false;
  }

  return true;
}

function hardDrop() {
  if (!currentPiece || isGameOver) {
    return;
  }

  while (canMove(currentPiece, 0, 1, board)) {
    currentPiece.row += 1;
  }

  lockAndSpawn();
}

function dropPiece() {
  if (isGameOver) {
    return;
  }

  tryMovePiece(0, 1);
}

function drawPiece(grid, piece) {
  const display = grid.map((row) => row.slice());

  if (!piece) {
    return display;
  }

  forEachOccupiedCell(piece, 0, 0, (row, col) => {
    if (isInsideBoard(row, col)) {
      display[row][col] = piece.type;
    }
  });

  return display;
}

function renderBoard() {
  const display = drawPiece(board, currentPiece);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = cells[row * COLS + col];
      const pieceType = display[row][col];

      cell.className = "cell";
      if (pieceType) {
        cell.classList.add("filled", `piece-${pieceType}`);
      }
    }
  }
}

function initBoardCells() {
  boardEl.innerHTML = "";
  cells = [];

  for (let i = 0; i < ROWS * COLS; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    boardEl.appendChild(cell);
    cells.push(cell);
  }
}

function startDropTimer() {
  stopDropTimer();
  dropTimer = setInterval(() => {
    dropPiece();
    renderBoard();
  }, DROP_INTERVAL);
}

function stopDropTimer() {
  if (dropTimer !== null) {
    clearInterval(dropTimer);
    dropTimer = null;
  }
}

function resetGame() {
  stopDropTimer();
  board = createEmptyBoard();
  score = 0;
  hideGameOver();
  scoreEl.textContent = "0";

  if (!spawnPiece()) {
    renderBoard();
    finishGame();
    return;
  }

  renderBoard();
  startDropTimer();
}

function handleKeyDown(event) {
  if (!isGameRunning() || !currentPiece) {
    return;
  }

  const actions = {
    ArrowLeft: () => tryMovePiece(-1, 0),
    ArrowRight: () => tryMovePiece(1, 0),
    ArrowDown: () => tryMovePiece(0, 1),
    ArrowUp: () => tryRotatePiece(),
    " ": () => hardDrop(),
  };

  const action = actions[event.key];
  if (!action) {
    return;
  }

  event.preventDefault();
  action();
  renderBoard();
}

function initKeyboardControls() {
  if (keyboardInitialized) {
    return;
  }

  document.addEventListener("keydown", handleKeyDown);
  keyboardInitialized = true;
}

function initGame() {
  initBoardCells();
  initKeyboardControls();
  board = createEmptyBoard();
  currentPiece = createPiece(DEFAULT_PIECE_TYPE);
  renderBoard();
}

startBtn.addEventListener("click", resetGame);
restartBtn.addEventListener("click", resetGame);

initGame();
