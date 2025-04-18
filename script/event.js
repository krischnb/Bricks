document.addEventListener("keydown", function (e) {
    if (e.keyCode == 80 && pauseBtn.disabled == false) { // pause btn
        gamePause();
    }
    if (e.keyCode == 32 || e.keyCode == 13 && playBtn.disabled == false) { // space ali enter
        gameStart()
    }
    if (e.keyCode == 73) {
        rules();
    }
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) { // D oz. right arrow key
        rightPressed = true;
    } else if (e.keyCode == 37 || e.keyCode == 65) {// A oz. left arrow key
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

let mouseHeld = false;
let decimalSeconds;

timer.addEventListener('secondTenthsUpdated', function () {
    const time = timer.getTimeValues();
    const totalSeconds = time.minutes * 60 + time.seconds + time.secondTenths / 10;
    decimalSeconds = totalSeconds.toFixed(1);
    document.querySelector('.seconds').textContent = decimalSeconds; 
});

canvas.addEventListener("mousedown", () => mouseHeld = true);
document.addEventListener("mouseup", () => mouseHeld = false);
document.addEventListener("mousemove", (e) => {
    if(!gameStarted) return; // zato da ne mores premikat platforme pred zacetkom igre
    if (!mouseHeld ) return;
    let x = e.clientX - canvas.getBoundingClientRect().left;
    paddleX = Math.max(0, Math.min(x - paddleWidth / 2, canvasWidth - paddleWidth));
});