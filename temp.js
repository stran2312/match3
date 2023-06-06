// Constants
const numRows = 10;
const numCols = 10;

// Gem colors
const gemColors = ["red", "blue", "yellow", "green"];

// Board array to store gem colors
let board = [];

// Function to initialize the game board
function initializeBoard() {
  // Create the 2D board array with random gem colors
  for (let i = 0; i < numRows; i++) {
    board[i] = [];
    for (let j = 0; j < numCols; j++) {
      let newGemColor;
      do {
        newGemColor = getRandomGemColor();
      } while (hasMatch(i, j, newGemColor));
      board[i][j] = newGemColor;
    }
  }
}

// Function to generate a random gem color
function getRandomGemColor() {
  const randomIndex = Math.floor(Math.random() * gemColors.length);
  return gemColors[randomIndex];
}

// Function to check if a gem position has a match of 3 or more gems of the same color
function hasMatch(row, col, gemColor) {
  return (
    hasHorizontalMatch(row, col, gemColor) ||
    hasVerticalMatch(row, col, gemColor)
  );
}

// Function to check for a horizontal match of 3 or more gems of the same color
function hasHorizontalMatch(row, col, gemColor) {
  const left = findLeftMostGem(row, col, gemColor);
  const right = findRightMostGem(row, col, gemColor);
  return right - left >= 2;
}

// Function to check for a vertical match of 3 or more gems of the same color
function hasVerticalMatch(row, col, gemColor) {
  const top = findTopMostGem(row, col, gemColor);
  const bottom = findBottomMostGem(row, col, gemColor);
  return bottom - top >= 2;
}

// Function to find the leftmost gem of the same color in a row
function findLeftMostGem(row, col, gemColor) {
  while (col > 0 && board[row][col - 1] === gemColor) {
    col--;
  }
  return col;
}

// Function to find the rightmost gem of the same color in a row
function findRightMostGem(row, col, gemColor) {
  while (col < numCols - 1 && board[row][col + 1] === gemColor) {
    col++;
  }
  return col;
}

// Function to find the topmost gem of the same color in a column
function findTopMostGem(row, col, gemColor) {
  while (row > 0 && board[row - 1][col] === gemColor) {
    row--;
  }
  return row;
}

// Function to find the bottommost gem of the same color in a column
function findBottomMostGem(row, col, gemColor) {
  while (row < numRows - 1 && board[row + 1][col] === gemColor) {
    row++;
  }
  return row;
}

// Function to remove matched gems from the board
function removeMatches() {
  const matches = findMatches();

  // Remove gems from the board and animate the removal
  for (const match of matches) {
    const { row, col } = match;
    board[row][col] = null;
    const gemElement = document.getElementById(`gem-${row}-${col}`);
    gemElement.classList.add("gem-remove");
    gemElement.addEventListener("animationend", function() {
        gemElement.parentNode.removeChild(gemElement);
        });
        }
        
        // Shift the remaining gems downward to fill the empty spaces
        shiftGemsDown();
        
        // Add new gems to fill the top rows
        fillTopRows();
        }
        
        // Function to find all matches on the board
        function findMatches() {
        const matches = [];
        
        // Find horizontal matches
        for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols - 2; col++) {
        const gemColor = board[row][col];
        if (gemColor && hasHorizontalMatch(row, col, gemColor)) {
        for (let i = col; i < col + 3; i++) {
        matches.push({ row, col: i });
        }
        }
        }
        }
        
        // Find vertical matches
        for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows - 2; row++) {
        const gemColor = board[row][col];
        if (gemColor && hasVerticalMatch(row, col, gemColor)) {
        for (let i = row; i < row + 3; i++) {
        matches.push({ row: i, col });
        }
        }
        }
        }
        
        return matches;
        }
        
        // Function to shift gems downward to fill empty spaces
        function shiftGemsDown() {
        for (let col = 0; col < numCols; col++) {
        let emptySpaces = 0;
        for (let row = numRows - 1; row >= 0; row--) {
        if (!board[row][col]) {
        emptySpaces++;
        } else if (emptySpaces > 0) {
        board[row + emptySpaces][col] = board[row][col];
        board[row][col] = null;
        const gemElement = document.getElementById(`gem-${row}-${col}`);
        gemElement.id = `em-${row + emptySpaces}-${col}`;
        gemElement.style.top = `${(row + emptySpaces) * 70}px`;
        }
        }
        }
        }
        
        // Function to fill the top rows with new gems
        function fillTopRows() {
        for (let col = 0; col < numCols; col++) {
        let emptySpaces = 0;
        for (let row = 0; row < numRows; row++) {
        if (!board[row][col]) {
        emptySpaces++;
        const newGemColor = getRandomGemColor();
        board[row][col] = newGemColor;
        const newGemElement = createGemElement(newGemColor, row, col);
        gemBoard.appendChild(newGemElement);
        newGemElement.style.top = `${-emptySpaces * 70}px`;
        animateGemDrop(newGemElement, row, col, emptySpaces);
        }
        }
        }
        }
        
        // Function to animate the drop of a new gem
        function animateGemDrop(gemElement, row, col, emptySpaces) {
        gemElement.animate(
        [
        { top: `${-emptySpaces * 70}px` },
        { top: `${row * 70}px` },
        ],
        {
        duration: 300,
        easing: "ease-out",
        }
        );
        }
        
        // Function to create a new gem element
        function createGemElement(gemColor, row, col) {
        const gemElement = document.createElement("div");
        gemElement.className = "gem";
        gemElement.style.backgroundColor = gemColor;
        gemElement.style.top = `${row * 70}px`;
        gemElement.style.left = `${col * 70}px`;
        gemElement.id = `gem-${row}-${col}`;
gemElement.draggable = true;
gemElement.addEventListener("dragstart", handleGemDragStart);
gemElement.addEventListener("dragover", handleGemDragOver);
gemElement.addEventListener("drop", handleGemDrop);
return gemElement;
}

// Function to handle the start of a gem drag
function handleGemDragStart(event) {
const gemElement = event.target;
gemElement.classList.add("gem-dragging");
event.dataTransfer.setData("text/plain", gemElement.id);
}

// Function to handle the dragover event for a gem
function handleGemDragOver(event) {
event.preventDefault();
}

// Function to handle the drop event for a gem
function handleGemDrop(event) {
const gemElement = event.target;
gemElement.classList.remove("gem-dragging");

const sourceGemId = event.dataTransfer.getData("text/plain");
const targetGemId = gemElement.id;

const sourceGem = document.getElementById(sourceGemId);
const targetGem = document.getElementById(targetGemId);

const sourceGemRow = parseInt(sourceGemId.split("-")[1]);
const sourceGemCol = parseInt(sourceGemId.split("-")[2]);
const targetGemRow = parseInt(targetGemId.split("-")[1]);
const targetGemCol = parseInt(targetGemId.split("-")[2]);

swapGems(sourceGemRow, sourceGemCol, targetGemRow, targetGemCol);

// Reset the drag and drop data
event.dataTransfer.clearData();
}

// Function to swap two gems on the board
function swapGems(row1, col1, row2, col2) {
// Swap the gem colors in the board
const tempGem = board[row1][col1];
board[row1][col1] = board[row2][col2];
board[row2][col2] = tempGem;

// Swap the gem elements in the DOM
const gem1 = document.getElementById(`gem-${row1}-${col1}`);
const gem2 = document.getElementById(`gem-${row2}-${col2}`);
gem1.id = `gem-${row2}-${col2}`;
gem2.id = `gem-${row1}-${col1}`;

// Update the visual position of the swapped gems
gem1.style.top = `${row2 * 70}px`;
gem1.style.left = `${col2 * 70}px`;
gem2.style.top = `${row1 * 70}px`;
gem2.style.left = `${col1 * 70}px`;

// Check for matches after swapping
removeMatches();
}

// Function to initialize the game
function initializeGame() {
initializeBoard();
drawBoard();
}

// Function to draw the initial game board
function drawBoard() {
const gemBoard = document.getElementById("gem-board");
gemBoard.innerHTML = "";

for (let row = 0; row < numRows; row++) {
for (let col = 0; col < numCols; col++) {
const gemColor = board[row][col];
const gemElement = createGemElement(gemColor, row, col);
gemBoard.appendChild(gemElement);
}
}
}

// Initialize the game when the page loads
window.addEventListener("DOMContentLoaded", initializeGame);
