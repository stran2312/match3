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

let selectedGem = null;
let canSelectGem = true;

// Function to handle gem selection
function selectGem(row, col) {
  if (canSelectGem) {
    if (selectedGem === null) {
      selectedGem = { row, col };
      highlightGem(row, col);
    } else {
      // Check if the selected gem is adjacent to the current gem
      if (isAdjacentGem(selectedGem.row, selectedGem.col, row, col)) {
        swapGems(selectedGem.row, selectedGem.col, row, col);
        removeMatches();
      }

      deselectGem();
    }
  }
}

// Function to highlight the selected gem
function highlightGem(row, col) {
  const gemElement = document.getElementById(`gem-${row}-${col}`);
  gemElement.style.border = "2px solid #fff";
}

// Function to deselect the gem
function deselectGem() {
  if (selectedGem !== null) {
    const { row, col } = selectedGem;
    const gemElement = document.getElementById(`gem-${row}-${col}`);
    gemElement.style.border = "none";
    selectedGem = null;
  }
}

// Function to check if two gems are adjacent
function isAdjacentGem(row1, col1, row2, col2) {
  return (
    (Math.abs(row1 - row2) === 1 && col1 === col2) ||
    (row1 === row2 && Math.abs(col1 - col2) === 1)
  );
}

// Function to swap two gems
function swapGems(row1, col1, row2, col2) {
  const tempGem = board[row1][col1];
  board[row1][col1] = board[row2][col2];
  board[row2][col2] = tempGem;

  // Swap the gem elements visually
  const gemElement1 = document.getElementById(`gem-${row1}-${col1}`);
  const gemElement2 = document.getElementById(`gem-${row2}-${col2}`);
  gemElement1.id = `gem-${row2}-${col2}`;
  gemElement2.id = `gem-${row1}-${col1}`;
  gemElement1.style.top = `${row2 * 70}px`;
  gemElement1.style.left = `${col2 * 70}px`;
  gemElement2.style.top = `${row1 * 70}px`;
  gemElement2.style.left = `${col1 * 70}px`;
}

// Function to remove matched gems
// Function to remove matched gems
function removeMatches() {
  const matchedGems = findMatches();

  // Remove matched gems from the board
  for (const { row, col } of matchedGems) {
    board[row][col] = null;
    const gemElement = document.getElementById(`gem-${row}-${col}`);
    gemElement.parentNode.removeChild(gemElement);
  }

  // Apply gravity to fill the empty spaces
  applyGravity();

  // Check for new matches after gravity is applied
  const newMatches = findMatches();

  // If there are new matches, remove them recursively
  if (newMatches.length > 0) {
    removeMatches();
  } else {
    // Deselect the gem and enable gem selection
    deselectGem();
    canSelectGem = true;
  }
}

// Function to find and return an array of matched gems
function findMatches() {
  const matchedGems = [];

  // Check for horizontal matches
  for (let row = 0; row < numRows; row++) {
    let startCol = 0;
    while (startCol < numCols) {
      const gemColor = board[row][startCol];
      if (gemColor === null) {
        startCol++;
        continue;
      }

      let endCol = startCol + 1;
      while (endCol < numCols && board[row][endCol] === gemColor) {
        endCol++;
      }

      if (endCol - startCol >= 3) {
        for (let col = startCol; col < endCol; col++) {
          matchedGems.push({ row, col });
        }
      }

      startCol = endCol;
    }
  }

  // Check for vertical matches
  for (let col = 0; col < numCols; col++) {
    let startRow = 0;
    while (startRow < numRows) {
      const gemColor = board[startRow][col];
      if (gemColor === null) {
        startRow++;
        continue;
      }

      let endRow = startRow + 1;
      while (endRow < numRows && board[endRow][col] === gemColor) {
        endRow++;
      }

      if (endRow - startRow >= 3) {
        for (let row = startRow; row < endRow; row++) {
          matchedGems.push({ row, col });
        }
      }

      startRow = endRow;
    }
  }

  return matchedGems;
}

// Function to apply gravity and fill empty spaces with new gems
function applyGravity() {
  for (let col = 0; col < numCols; col++) {
    let emptySpaces = 0;

    // Move gems downwards for each column
    for (let row = numRows - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        const gemColor = board[row][col];
        board[row + emptySpaces][col] = gemColor;
        board[row][col] = null;

        // Update visual position of the gem
        const gemElement = document.getElementById(`gem-${row}-${col}`);
        gemElement.id = `gem-${row + emptySpaces}-${col}`;
        gemElement.style.top = `${(row + emptySpaces) * 70}px`;
      }
    }

    // Generate new gems for the empty spaces at the top
    for (let i = 0; i < emptySpaces; i++) {
      const newRow = i;
      const newGemColor = getRandomGemColor();
      board[i][col] = newGemColor;

      // Create a new gem element and add it to the board
      const newGemElement = createGemElement(newGemColor, i, col);
      gemBoard.appendChild(newGemElement);
    }
  }
}

// Function to create a new gem element
function createGemElement(color, row, col) {
  const gemElement = document.createElement("div");
  gemElement.className = "gem";
  gemElement.id = `gem-${row}-${col}`;
  gemElement.style.top = `${row * 70}px`;
  gemElement.style.left = `${col * 70}px`;
  gemElement.style.backgroundColor = color;

  return gemElement;
}

// Generate a random gem color
function getRandomGemColor() {
  const colors = ["red", "blue", "yellow", "green"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

let isDragging = false;
let dragStartGem = null;

// Function to handle mouse down event on a gem
function handleGemMouseDown(row, col) {
  isDragging = true;
  dragStartGem = { row, col };
}

// Function to handle mouse up event on a gem
function handleGemMouseUp(row, col) {
  if (isDragging) {
    isDragging = false;
    swapGems(dragStartGem.row, dragStartGem.col, row, col);
    removeMatches();
  }
}

// Function to handle mouse move event on the game board
function handleBoardMouseMove(event) {
  if (isDragging) {
    const { offsetX, offsetY } = event;
    const row = Math.floor(offsetY / 70);
    const col = Math.floor(offsetX / 70);

    if (isValidGemPosition(row, col) && isAdjacentGem(dragStartGem.row, dragStartGem.col, row, col)) {
      highlightGem(row, col);
    } else {
      deselectGem();
    }
  }
}

// Function to check if the row and column values are valid gem positions
function isValidGemPosition(row, col) {
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

// Add event listeners to the game board
gemBoard.addEventListener("mousedown", function(event) {
  const { target } = event;
  const row = parseInt(target.getAttribute("data-row"));
  const col = parseInt(target.getAttribute("data-col"));
  handleGemMouseDown(row, col);
});

gemBoard.addEventListener("mouseup", function(event) {
  const { target } = event;
  const row = parseInt(target.getAttribute("data-row"));
  const col = parseInt(target.getAttribute("data-col"));
  handleGemMouseUp(row, col);
});

gemBoard.addEventListener("mousemove", handleBoardMouseMove);




