const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const backgroundMusic = document.getElementById('backgroundMusic');
const eatSound = document.getElementById('eatSound');

const boxSize = 20; // Size of each box in the grid
let snake = [{ x: 160, y: 160 }]; // Initial position of the snake
let dx = boxSize; // Horizontal direction (speed)
let dy = 0; // Vertical direction (speed)
let food = { x: 0, y: 0 }; // Initial food position
let score = 0;
let gameInterval; // Store the game interval
let gameStarted = false; // To check if the game has started

// Create random food position
function createFood() {
  food.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
  food.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;

  // Ensure food does not spawn on the snake
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
    food.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;
  }
}

// Draw the snake on the canvas
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = 'green';
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
  });
}

// Draw the food on the canvas
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    eatSound.play(); // Play eating sound effect
    createFood();
  } else {
    snake.pop(); // Remove the tail
  }
}

// Check for collision with walls or self
function checkCollision() {
  const head = snake[0];
  const hitWall = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
  const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

  return hitWall || hitSelf;
}

// Main game loop
function gameLoop() {
  if (checkCollision()) {
    clearInterval(gameInterval); // Stop the game loop
    alert('Game Over! Your score: ' + score);
    resetGame(); // Call the reset function when alert is dismissed
    return;
  }

  // Fill the canvas with black before drawing
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with black
  
  drawFood(); // Draw the food
  moveSnake(); // Move the snake
  drawSnake(); // Draw the snake
}

// Change snake direction
function changeDirection(event) {
  const keyPressed = event.keyCode;

  // Prevent the snake from reversing
  const goingUp = dy === -boxSize;
  const goingDown = dy === boxSize;
  const goingRight = dx === boxSize;
  const goingLeft = dx === -boxSize;

  if (keyPressed === 37 && !goingRight) { // Left arrow
    dx = -boxSize;
    dy = 0;
  } else if (keyPressed === 38 && !goingDown) { // Up arrow
    dx = 0;
    dy = -boxSize;
  } else if (keyPressed === 39 && !goingLeft) { // Right arrow
    dx = boxSize;
    dy = 0;
  } else if (keyPressed === 40 && !goingUp) { // Down arrow
    dx = 0;
    dy = boxSize;
  }

  // Start the game and play music on first key press
  if (!gameStarted) {
    //backgroundMusic.play();
    gameStarted = true;
    gameInterval = setInterval(gameLoop, 100); // Start the game loop
  }
}

// Reset the game
function resetGame() {
  snake = [{ x: 160, y: 160 }]; // Reset snake position
  dx = boxSize; // Reset direction
  dy = 0; // Reset vertical direction
  score = 0; // Reset score
  scoreElement.textContent = score; // Update score display
  createFood(); // Create new food
  gameStarted = false; // Reset game started flag
}

// Event listener for key presses
document.addEventListener('keydown', changeDirection);

// Create food for the first time
createFood();
