var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

var score = 0;
var gameOver = false;
var gamePaused = false;
var lastTime = performance.now();

// timer
const timer = new easytimer.Timer();

// paddle vars
var paddleHeight = 10;
var paddleWidth = 120;
var paddleX = (canvasWidth - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

// ball vars
var dx = Math.floor(Math.random() * 6) + 4;
var dy = -8;
var ballRadius = 10;
var ballColor = "#0095DD";
var x = canvasWidth / 2;
var y = canvasHeight - (paddleHeight + 10 + ballRadius); // startna Y pozicija zoge tocno na platformi,
// paddle height + 10, ker je platforma za 10px odmaknjena od tal.

// bricks
const redBloon = new Image();
const blueBloon = new Image();
const yellowBloon = new Image();
const greenBloon = new Image();
const popBloon = new Image();

// flag, ko zoga pada, pomeni da smo zgubili, uporabno za animacijo da gre zoga pod platformo
var pada = false;

// flag, da igra ni zaceta
var gameStarted = false;

redBloon.src = "assets/redBloon.png";
blueBloon.src = "assets/blueBloon.png";
yellowBloon.src = "assets/yellowBloon.png";
greenBloon.src = "assets/greenBloon.png";
popBloon.src = "assets/pop.png";

redBloon.onload = imageLoaded;
blueBloon.onload = imageLoaded;
yellowBloon.onload = imageLoaded;
greenBloon.onload = imageLoaded;
popBloon.onload = imageLoaded;

let imagesLoaded = 0;

function imageLoaded() {
  // funkcija, ki preverja ce so vse slike nalozene. Vstop kdr se slika nalozi
  imagesLoaded++;
  if (imagesLoaded === 5) {
    // kadar so vse slike nalozene, se zacne game loop
    
    initBricks();
    requestAnimationFrame(draw);
  }
}

function resetValues() {
  score = 0;
  gameOver = false;
  gamePaused = false;
  paddleHeight = 10;
  paddleWidth = 120;
  paddleX = (canvasWidth - paddleWidth) / 2;
  rightPressed = false;
  leftPressed = false;
  dx = Math.floor(Math.random() * 6) + 4;
  dy = -8;
  ballRadius = 10;
  x = canvasWidth / 2;
  y = canvasHeight - (paddleHeight + 10 + ballRadius);
  pada = false;
  gameStarted = false;

  // button reset
  playBtn.disabled = false;
  pauseBtn.disabled = true;

  initBricks();

  timer.reset();
  timer.stop();

  document.getElementById("scoreVal").textContent = 0;
  document.querySelector('.seconds').textContent = "0.0";
  requestAnimationFrame(draw);
}

// stevilo vrstic in stolpcev (bricks - balonov)
const brickRowCount = 4;
const brickColumnCount = 12;
document.getElementById("scoreMax").textContent =
  brickRowCount * brickColumnCount; // se zabelezi koliko je vseh balonov

const brickHeight = 127 / 1.5; // taprava visina in sirina balona, najmanjsega balona, zato da bodo vsi enako veliki ane
const brickWidth = 99 / 1.5; // za vecati al manjsati sliko delimo obe dimenziji z isto cifro - aspect ratio

const brickPaddingX = 10; // margin left (posamezen balon)
const brickPaddingY = 5; // margin top (posamezen balon)
const topPadding = 20; // padding top od celotnega canvasa

const totalBricksWidth =
  brickColumnCount * brickWidth + (brickColumnCount - 1) * brickPaddingX;
const brickOffsetLeft = (canvasWidth - totalBricksWidth) / 2; // formula za centrirat vrstico bricksev

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    canvas.height - paddleHeight - 10,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

var bricks = [];

function initBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      let randomNumber = Math.floor(Math.random() * 4) + 1;
      let img;
      switch (randomNumber) {
        case 1:
          img = redBloon;
          break;
        case 2:
          img = greenBloon;
          break;
        case 3:
          img = blueBloon;
          break;
        case 4:
          img = yellowBloon;
          break;
      }
      bricks[c][r] = { x: 0, y: 0, status: 1, bloonImage: img }; // random barve baloni se shranijo v 2d tabelo
    }
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
  poppedBalloons.forEach((pb) => {
    let elapsed = (performance.now() - pb.time) / 250; // kolk cajta od kdr je bil balon pocen, elapsed gre od 0 do 1 v roku 250ms
    if (elapsed < 1) {
      ctx.globalAlpha = 1 - elapsed;
      ctx.save();

      let centerX = pb.x + brickWidth / 2; // center balona
      let centerY = pb.y + brickHeight / 2;

      ctx.translate(centerX, centerY);
      ctx.rotate(elapsed * (Math.PI / 5)); // v roku 250ms se bo zvrtelo 36 stopinj

      ctx.drawImage(
        popBloon,
        -brickWidth / 2,
        -brickHeight / 2,
        brickWidth,
        brickHeight
      );

      ctx.restore();
    }
  });

  ctx.globalAlpha = 1; // reset var
  poppedBalloons = poppedBalloons.filter(
    (pb) => performance.now() - pb.time < 250
  );
  // filter je kot pop, sam da ne izbrise sam najvisjih elementov, ampak ima nek pogoj
  // zbrise elemente po 250ms
}

function playPopSound() {
  const sound = new Audio("assets/popSound.mp3");
  sound.play();
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (
        b.status === 1 &&
        x > b.x &&
        x < b.x + brickWidth &&
        y > b.y &&
        y < b.y + brickHeight
      ) {
        dy = -dy;
        b.status = 0;
        score++;
        poppedBalloons.push({ x: b.x, y: b.y, time: performance.now() }); // shrani pocen balon

        drawScore();
        playPopSound();
      }
    }
  }

  if (score === brickRowCount * brickColumnCount) {
    gamePaused = true;
    gameStarted = false;
    timer.stop();
    youWin();
  }
}

function drawScore() {
  document.getElementById("scoreVal").textContent = score;
}

const playBtn = document.querySelector(".playBtn");
const pauseBtn = document.querySelector(".pauseBtn");

const pauseMsg = document.querySelector(".pauseMsg");
function gamePause() {
  gamePaused = !gamePaused;

  if (gamePaused) {
    pauseMsg.classList.add("active");
    timer.pause();
  } else {
    pauseMsg.classList.remove("active");
    timer.start({ precision: "secondTenths" });
  }
  if (!gamePaused) {
    lastTime = performance.now();
    requestAnimationFrame(draw);
  }
}
function gameStart() {
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  gameStarted = true;
  timer.start({ precision: "secondTenths" }); // zacnemo timer, ko se zacne igra, vsakic 10 stotink se belezi
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
    // kdr se takne zida, preprecimo da gre skozi
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    // ce se dotakne zida, obrnemo smer
    dy = -dy;
  } else if (y + dy > canvas.height - paddleHeight - 10) {
    // ce se zoga nahaja v levelu platforme
    if (x > paddleX && x < paddleX + paddleWidth) {
      // ce se zoga med zacetkom in koncom platforme
      dx = 12 * ((x - (paddleX + paddleWidth / 2)) / paddleWidth); // razlicn odboj, nimm blage kku tu deluje
      dy = -dy; // bo sla zoga navzgor (obrnemo kot v katerega bo potekala)
    } else {
      pada = true; // flag, da zoga pada - zguba
    }
  }
  if (pada) {
    // ce zoga pada
    if (y + ballRadius < canvas.height) {
      // ko se blizamo dnu, se hitrost povecuje
      y += 0.1;
    } else {
      y = canvas.height - ballRadius;
      gamePaused = true;
      gameStarted = false;
      timer.stop();
      youLose();
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SPEED * deltaTime;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SPEED * deltaTime;
  }

  // poklice nsledn frame, klic game loopa
  requestAnimationFrame(draw);
}

const firstPage = document.querySelector(".firstPage");
const gamePage = document.querySelector(".gamePage");

function openGame() {
  firstPage.classList.remove("activePage");
  gamePage.classList.add("activePage");
}
