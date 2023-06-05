// Game board dimensions
const numRows = 8;
const numCols = 8;

// Game board
let board = [];

// Possible gem colors
const gemColors = ['red', 'green', 'blue', 'yellow'];

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

  // Check horizontally
  for (let row = 0; row < numRows; row++) {
    let colorStreak = 1;
    for (let col = 0; col < numCols; col++) {
      const currentGem = board[row][col];
      const nextGem = board[row][col + 1];

      if (currentGem === nextGem) {
        colorStreak++;
      } else {
        if (colorStreak >= 3) {
          matches.push({ row, col: col - colorStreak + 1, length: colorStreak, direction: 'horizontal' });
        }
        colorStreak = 1;
      }
    }
  }

  // Check vertically
  for (let col = 0; col < numCols; col++) {
    let colorStreak = 1;
    for (let row = 0; row < numRows; row++) {
      const currentGem = board[row][col];
      const nextGem = board[row + 1][col];

      if (currentGem === nextGem) {
        colorStreak++;
      } else {
        if (colorStreak >= 3) {
          matches.push({ row: row - colorStreak + 1, col, length: colorStreak, direction: 'vertical' });
        }
        colorStreak = 1;
      }
    }
  }

  return matches;
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

// Fill empty spaces with new gems
function fillGems() {
  for (let col = 0; col < numCols; col++) {
    for (let row = numRows - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        board[row][col] = getRandomGem();
      }
    }
  }
}

// Print the game board
function printBoard() {
  for (let row = 0; row < numRows; row++) {
    let rowString = '';
    for (let col = 0; col < numCols; col++) {
      rowString += board[row][col] + ' ';
    }
    console.log(rowString);
  }
}

// Play the game
function playGame() {
  initializeBoard();
  printBoard();
  const matches = checkMatches();
  console.log('Matches:', matches);

  removeMatches(matches);
  console.log('Board after removing matches:');
  printBoard();

  shiftGems();
  console.log('Board after shifting gems:');
  printBoard();

  fillGems();
  console.log('Board after filling gems:');
  printBoard();
}

// Start the game
playGame();
