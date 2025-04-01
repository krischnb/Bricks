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

// Number of rows and columns of bricks
const brickRowCount = 4;
const brickColumnCount = 8;

const brickWidth = (canvasWidth - (brickColumnCount + 1) * 10) / brickColumnCount; // 10 is the margin/padding between bricks
const brickHeight = (canvasHeight / 2 - 50) / brickRowCount; // Use only half of the canvas height (50px margin from the top)

// Padding and offset for bricks
const brickPadding = 12;
const brickOffsetTop = 40;  // Start drawing bricks 30px from the top
const brickOffsetLeft = 15; // Start drawing bricks 30px from the left



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

const redBloon = document.getElementById("redBloon");
const yellowBloon = document.getElementById("yellowBloon");
const greenBloon = document.getElementById("greenBloon");
const blueBloon = document.getElementById("blueBloon");

for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        let randomNumber = Math.floor(Math.random() * 4) + 1;
        let img;
        switch(randomNumber) {
            case 1: img = redBloon;
                break;
            case 2: img = greenBloon;
                break;
            case 3: img = blueBloon;
                break;
            case 4: img = yellowBloon;
                break;
        }
        bricks[c][r] = { x: 0, y: 0, status: 1, bloonImage: img };
    }
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();

                // Use the stored image for this brick
                let img = bricks[c][r].bloonImage;
                ctx.drawImage(img, brickX, brickY, brickHeight, brickWidth);

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
                gameStarted = false;
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
var lastTime = performance.now(); // Track time to maintain game consistency when paused


const playBtn = document.querySelector(".playBtn");
const pauseBtn = document.querySelector(".pauseBtn");

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
var gameStarted = false;
function gameStart() {
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    gameStarted = true;
    lastTime = performance.now();
    requestAnimationFrame(draw);
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
    collisionDetection();
    drawBricks();
    drawBall();
    drawPaddle();

    if (!gameStarted) return;

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
            gameStarted = false;
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

function rules() {
    Swal.fire({
        title: 'Game Info',
        html: `
            <p class="info-title">
                <strong>Objective:</strong>
            </p>
            
            <ul class="info-list">
                <li>Destroy all the bricks to win the game.</li>
                <li>Use the paddle to bounce the ball.</li>
                <li>If the ball falls, you lose and the game ends.</li>
            </ul>

            <hr class="info-underline">
            <p class="info-title">Keybinds:</p>
            <ul class="info-list">                
                <li><strong>WASD</strong> or <strong>arrow keys</strong> – Move the paddle</li>
                <li><strong>Enter</strong> or <strong>Space</strong> – Start the game</li>
                <li><strong>P</strong> – Pause or Resume the game</li>
            </ul>
        `,
        confirmButtonText: 'Got it!',
    });
}
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 80 && pauseBtn.disabled == false) { // pause btn
        gamePause();
    }
    if (e.keyCode == 32 || e.keyCode == 13 && playBtn.disabled == false) { // space ali enter
        gameStart()
    }
    if (e.keyCode == 73){
        rules();
    }
});