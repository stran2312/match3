// Game configuration
const numRows = 10;
const numCols = 10;
const totalGems = 100;
const gemColors = ['red', 'blue', 'yellow', 'green'];
const gemSize = 60;
const gemMargin = 5;

// Game board
let board = [];

// Initialize the game board
function initializeBoard() {
  const gameBoard = document.getElementById('gameBoard');
  
  gameBoard.style.width = `${numCols * (gemSize + gemMargin * 2)}px`;

  for (let row = 0; row < numRows; row++) {
    board[row] = [];
    for (let col = 0; col < numCols; col++) {
      let gemColor = getRandomGem();
      while (
        (col >= 2 && board[row][col - 1] === gemColor && board[row][col - 2] === gemColor) || // Check left
        (row >= 2 && board[row - 1][col] === gemColor && board[row - 2][col] === gemColor)    // Check above
      ) {
        gemColor = getRandomGem(); // Reinitialize gem color if three same-colored gems are found
      }
      board[row][col] = gemColor;
      
      const gem = document.createElement('div');
      gem.classList.add('gem', gemColor);
      gameBoard.appendChild(gem);
    }
  }
}

// Get a random gem color
function getRandomGem() {
  const randomIndex = Math.floor(Math.random() * gemColors.length);
  return gemColors[randomIndex];
}

// Start the game
initializeBoard();
