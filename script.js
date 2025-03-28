var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Ball variables
var x = canvasWidth / 2;
var y = canvasHeight - 30;
var dx = 5;
var dy = -5;
var ballRadius = 10;
var ballColor = "white";

// Paddle variables
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvasWidth - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

// Brick variables


// Number of rows and columns of bricks
const brickRowCount = 5;
const brickColumnCount = 6;

// Brick calculations based on canvas size (using only the top half of the canvas height for bricks)
const brickWidth = (canvasWidth - (brickColumnCount + 1) * 10) / brickColumnCount; // 10 is the margin/padding between bricks
const brickHeight = (canvasHeight / 2 - 50) / brickRowCount; // Use only half of the canvas height (50px margin from the top)

// Padding and offset for bricks
const brickPadding = 12;
const brickOffsetTop = 40;  // Start drawing bricks 30px from the top
const brickOffsetLeft = 6; // Start drawing bricks 30px from the left

var bricks = [];

// Initialize the bricks
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Event listeners for paddle control
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Keydown and Keyup handler
function keyDownHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

// Draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the bricks
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

var score = 0;
var gameOver = false;

// Collision detection with bricks
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                }
            }
            if (score == brickRowCount * brickColumnCount) {
                gamePaused = true; // Pause 
                // the game immediately
                Swal.fire({
                    title: 'You win!',
                    text: 'Do you want to continue?',
                    icon: 'success',
                    confirmButtonText: 'Yes'
                }).then(function () {
                    window.location.reload();
                });
                return;
            }
        }
    }
}

// Draw the score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

// Game state
var gamePaused = false;
var gameStarted = false; // Keeps track of the game state
var lastTime = performance.now(); // Track time to maintain game consistency when paused

// Function to start/resume the game


// Function to toggle pause state
const pauseMsg = document.querySelector(".pauseMsg");

function gamePause() {

    gamePaused = !gamePaused;

    if (gamePaused)
        pauseMsg.classList.add("active");
    else
        pauseMsg.classList.remove("active");
    if (!gamePaused) {
        lastTime = performance.now();
        requestAnimationFrame(draw);
    }


}

const PADDLE_SPEED = 12; // Paddle speed at 60 FPS
const FPS = 60;
const frameTime = 1000 / FPS; // 1000ms divided by 60 frames per second

// Draw function (game loop)
function draw() {
    if (gamePaused) return; // Don't proceed with the game loop if paused

    let now = performance.now();
    let deltaTime = (now - lastTime) / (1000 / 60); // Normalize delta time to 60 FPS
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Ball movement (frame rate independent)
    x += dx * deltaTime;
    y += dy * deltaTime;

    // Ball collision with walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            gamePaused = true; // Pause the game immediately on loss
            Swal.fire({
                title: 'You lost!',
                text: 'Do you want to continue?',
                icon: 'error',
                confirmButtonText: 'Yes'
            }).then(function () {
                window.location.reload();
            });
        }
    }

    // Paddle movement (frame rate independent)
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SPEED * deltaTime;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SPEED * deltaTime;
    }

    drawScore();

    // Request the next animation frame
    requestAnimationFrame(draw);
}

// Start the game loop when the page loads
requestAnimationFrame(draw);

document.addEventListener("keydown", function (e) {
    if (e.keyCode == 80) { // pause btn
        gamePause();
    }
});