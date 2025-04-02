var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

var score = 0;
var gameOver = false;
var gamePaused = false;
var lastTime = performance.now();


// ball vars
var x = canvasWidth / 2;
var y = canvasHeight - 30;
var dx = 5;
var dy = -5;
var ballRadius = 10;
var ballColor = "#0095DD";

// paddle vars
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvasWidth - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

// Bricks - Baloni 

const redBloon = document.getElementById("redBloon");
const yellowBloon = document.getElementById("yellowBloon");
const greenBloon = document.getElementById("greenBloon");
const blueBloon = document.getElementById("blueBloon");
const popBloon = document.getElementById("popBloon");

// stevilo vrstic in stolpcev (bricks - balonov)
const brickRowCount = 4;
const brickColumnCount = 12;

const brickHeight = redBloon.naturalHeight / 1.5; // taprava visina in sirina balona, najmanjsega balona, zato da bodo vsi enako veliki ane
const brickWidth = redBloon.naturalWidth / 1.5; // za vecati al manjsati sliko delimo obe dimenziji z isto cifro - aspect ratio

const brickPaddingX = 10;  // margin left (posamezen balon)
const brickPaddingY = 5;  // margin top (posamezen balon)
const leftPadding = 10;    // padding left od celotnega canvasa
const topPadding = 40;     // padding top od celotnega canvasa

const totalBricksWidth = brickColumnCount * brickWidth + (brickColumnCount - 1) * brickPaddingX;
const brickOffsetLeft = (canvasWidth - totalBricksWidth) / 2; // formula za centrirat vrstico bricksev

var bricks = [];

for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        let randomNumber = Math.floor(Math.random() * 4) + 1;
        let img;
        switch (randomNumber) {
            case 1: img = redBloon;
                break;
            case 2: img = greenBloon;
                break;
            case 3: img = blueBloon;
                break;
            case 4: img = yellowBloon;
                break;
        }
        bricks[c][r] = { x: 0, y: 0, status: 1, bloonImage: img }; // random barve baloni se shranijo v 2d tabelo 
    }
}

var poppedBalloons = [];

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                let brickX = c * (brickWidth + brickPaddingX) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPaddingY) + topPadding;
                b.x = brickX;
                b.y = brickY;
                ctx.drawImage(b.bloonImage, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }

    // iteracija skozi vse zadete balone - for each
    poppedBalloons.forEach(pb => {
        let elapsed = (performance.now() - pb.time) / 200; // nam pove koliko casa je minilo (od 200ms), od kar je bil balon pocen 
        if (elapsed < 1) {                                 // ves casa kot mini, nizji po opacity
            ctx.globalAlpha = 1 - elapsed;                 // od opacity 1 se sproti niža proti 0
            ctx.drawImage(popBloon, pb.x, pb.y, brickWidth, brickHeight);
        }
    
    });

    ctx.globalAlpha = 1; // reset var
    poppedBalloons = poppedBalloons.filter(pb => (performance.now() - pb.time) < 200);
    // filter je kot pop, sam da ne izbrise sam najvisjih elementov, ampak ima nek pogoj
    // zbrise elemente po 200ms
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                dy = -dy;
                b.status = 0;
                score++;
                poppedBalloons.push({ x: b.x, y: b.y, time: performance.now() }); // shrani pocen balon
            }
        }
    }

    if (score === brickRowCount * brickColumnCount) {
        gamePaused = true;
        gameStarted = false;
        youWin();
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}




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


const PADDLE_SPEED = 12; 
const FPS = 60;
const frameTime = 1000 / FPS; 

// game loop
function draw() {
    if (gamePaused) return; 


    let now = performance.now();
    let deltaTime = (now - lastTime) / (1000 / 60); 
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionDetection();
    drawBricks();
    drawBall();
    drawPaddle();

    if (!gameStarted) return;

    x += dx * deltaTime;
    y += dy * deltaTime;

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dx = 12 * ((x - (paddleX + paddleWidth / 2)) / paddleWidth);
            dy = -dy;
        } else {
            gamePaused = true;
            gameStarted = false;
            youLose();
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SPEED * deltaTime;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SPEED * deltaTime;
    }

    drawScore();

    // poklice nsledn frame, klic game loopa
    requestAnimationFrame(draw);
}

