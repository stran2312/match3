// Game configuration
const numRows = 8;
const numCols = 8;
const gemColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const gemSize = 60;
const gemMargin = 5;
const canvasSize = numRows * (gemSize + gemMargin) + gemMargin;

// Game board
let board = [];

// Initialize the game board
function initializeBoard() {
  for (let row = 0; row < numRows; row++) {
    board[row] = [];
    for (let col = 0; col < numCols; col++) {
      board[row][col] = getRandomGem();
    }
  }
}

// Get a random gem color
function getRandomGem() {
  const randomIndex = Math.floor(Math.random() * gemColors.length);
  return gemColors[randomIndex];
}

// Swap two gems on the board
function swapGems(row1, col1, row2, col2) {
  const temp = board[row1][col1];
  board[row1][col1] = board[row2][col2];
  board[row2][col2] = temp;
}

// Check for matches on the board
function checkMatches() {
  const matches = [];

  // Check for horizontal matches
  for (let row = 0; row < numRows; row++) {
    let col = 0;
    while (col < numCols - 2) {
      if (board[row][col] === board[row][col + 1] && board[row][col] === board[row][col + 2]) {
        matches.push({
          row,
          col,
          length: 3,
          direction: 'horizontal'
        });
        col += 3;
      } else {
        col++;
      }
    }
  }

  // Check for vertical matches
  for (let col = 0; col < numCols; col++) {
    let row = 0;
    while (row < numRows - 2) {
      if (board[row][col] === board[row + 1][col] && board[row][col] === board[row + 2][col]) {
        matches.push({
          row,
          col,
          length: 3,
          direction: 'vertical'
        });
        row += 3;
      } else {
        row++;
      }
    }
  }

  return matches;
}
// Draw the game board on the canvas
function drawBoard() {
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw each gem on the board
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const gemX = col * (gemSize + gemMargin) + gemMargin;
      const gemY = row * (gemSize + gemMargin) + gemMargin;
      const gemColor = board[row][col];
      
      // Draw the gem as a colored rectangle
      context.fillStyle = gemColor;
      context.fillRect(gemX, gemY, gemSize, gemSize);
    }
  }
}
// Remove matched gems from the board

function removeMatches(matches) {
  for (const match of matches) {
    const { row, col, length, direction } = match;

    if (direction === 'horizontal') {
      for (let i = 0; i < length; i++) {
        board[row][col + i] = null;
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < length; i++) {
        board[row + i][col] = null;
      }
    }
  }
}

// Shift gems down to fill empty spaces
function shiftGems() {
  for (let col = 0; col < numCols; col++) {
    let emptySpaces = 0;
    for (let row = numRows - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        emptySpaces++;
        continue;
      }
      if (emptySpaces > 0) {
        board[row + emptySpaces][col] = board[row][col];
        board[row][col] = null;
      }
    }
  }
}

// Fill
// Fill empty spaces with new gems
function fillGems() {
  for (let col = 0; col < numCols; col++) {
  let emptySpaces = 0;
  for (let row = numRows - 1; row >= 0; row--) {
  if (board[row][col] === null) {
  board[row][col] = getRandomGem();
  emptySpaces++;
  }
  }
  }
  }
  
  // Game over condition
  const maxMoves = 30;
  let movesRemaining = maxMoves;
  
  // Calculate and update the score
  let score = 0;
  
  // Update the game state after each move
  function updateGame() {
  drawBoard();
  const matches = checkMatches();
  
  if (matches.length > 0) {
  removeMatches(matches);
  shiftGems();
  fillGems();
  setTimeout(updateGame, 500); // Delay to visualize the movement
  }
  }
  
  // Update the score
  function updateScore(matchLength) {
  const matchScore = matchLength * 10;
  score += matchScore;
  
  const scoreDisplay = document.getElementById('score');
  scoreDisplay.textContent = `Score: ${score}`;
  }
  
  // Update the moves remaining
  function updateMoves() {
  const movesDisplay = document.getElementById('moves');
  movesDisplay.textContent = `Moves: ${movesRemaining}`;
  
  if (movesRemaining === 0) {
  gameOver();
  }
  }
  
  // Game over function
  function gameOver() {
  const gameOverMsg = document.getElementById('gameOverMsg');
  gameOverMsg.textContent = 'Game Over';
  
  canvas.removeEventListener('click', handleGemClick);
  }
  
  // Swap gems when clicked
  function handleGemClick(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  const col = Math.floor(mouseX / (gemSize + gemMargin));
  const row = Math.floor(mouseY / (gemSize + gemMargin));
  
  if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
  if (col < numCols - 1) {
  swapGems(row, col, row, col + 1);
  updateGame();
  movesRemaining--;
  updateMoves();
  }
  }
  }
  
  // Start the game
  initializeBoard();
  drawBoard();
  canvas.addEventListener('click', handleGemClick);
  updateMoves();