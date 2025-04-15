function youWin() {
    Swal.fire({
        title: 'Congrats!',
        html: `
        <ul class="credit-list">
            <li>All balloons popped in <strong>${decimalSeconds}</strong> seconds!</li>
            <li>Do you want to continue?</li>
        </ul>
        `,
        icon: 'success',
        confirmButtonText: 'Pop Again!',
    }).then(function () {
        updateCurrentPlayer(score, decimalSeconds, gameMode);
        resetValues();
    });
}



function youLose() {
    Swal.fire({
        title: 'You lost!',
        text: 'Do you want to continue?',
        icon: 'error',
        confirmButtonText: 'Yes'
    }).then(function () {
        updateCurrentPlayer(score, decimalSeconds, gameMode);
        resetValues();
    });
}

function credits() {
    Swal.fire({
        title: 'Credits',
        html: `
        <ul class="credit-list">
        <li>Made by: Kristijan Boben, 4. Ra</Strong></li>
        <li>Visit my other projects: <a href="https://github.com/krischnb" target="_blank">Github</a></li> 
        <li>Pictures from: <a href="https://www.spriters-resource.com/search/?q=bloons" target="_blank">Spriters resource</a></li> 
        <li>Inspired by: <a href="https://www.crazygames.com/game/bloons" target="_blank">Bloons</a></li> 
        </ul>
        `,
        icon: 'info',
        confirmButtonText: 'Cool!',
    });
}

function rules() {
    Swal.fire({
        title: 'Game Info',
        html: `
            <p class="info-title">Objective:</p>
            
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
        icon: 'info',
    });
}

function newUser() {
    if (!firstGame) { // samo enkrat bos lahko vnesel ime, prvic. Razen ce resetiras page
        openGame()
        return;
    }
    let database = JSON.parse(localStorage.getItem('playerDatabase')) || [];
    const playerId = database.length === 0 ? 1 : Math.max(...database.map(p => p.id)) + 1;

    Swal.fire({
        title: 'Enter your name',
        html: `
            <input class="inputNewUser" class="swal2-input" placeholder="Your name" maxlength="20">
        `,
        footer: '<p class="noteNewUser">Note: Leaving the input field empty will give player a default username.</p>', // prikazano pod alertom
        showCancelButton: true,
        confirmButtonText: 'Start Game',
        focusConfirm: false, // da ne dobi confirm button fokusa, ampak ga dobi input
        preConfirm: () => {
            const input = document.querySelector(".inputNewUser");
            return input ? input.value : '';
        }
    }).then((result) => {
        if (!result.isConfirmed) return;

        let username = result.value && result.value.trim() !== ''
            ? result.value.trim()
            : `Player#${playerId}`;

        const entry = {
            id: playerId,
            username: username,
            time: null,
            score: null,
            gameMode: null
        };
        document.querySelector(".nameVal").textContent = username;
        database.push(entry);
        localStorage.setItem('playerDatabase', JSON.stringify(database));
        localStorage.setItem('currentPlayerId', playerId);

        openGame();
    });

}


function selectDifficulty() {
    if (gameStarted) return;
    let tempGameMode = gameMode;

    Swal.fire({
        title: 'Select Difficulty',
        html: `
            <p class="difficultyP">Note: This will affect the ball's speed. </p>
            <p class="difficultyP">Hard = highest speed.</p>
            <input type="range" id="difficultyRange" min="1" max="3" value="${getDifficultyValue(gameMode)}" step="1" class="swal2-input">
            <div id="difficultyLabel">${gameMode}</div>
        `,
        didOpen: () => {
            const rangeInput = document.getElementById('difficultyRange');
            const label = document.getElementById('difficultyLabel');

            rangeInput.addEventListener('input', (e) => {
                switch (e.target.value) {
                    case '1':
                        label.textContent = 'Easy';
                        tempGameMode = 'Easy';
                        break;
                    case '2':
                        label.textContent = 'Medium';
                        tempGameMode = 'Medium';
                        break;
                    case '3':
                        label.textContent = 'Hard';
                        tempGameMode = 'Hard';
                        break;
                }
            });
        },
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        preConfirm: () => {
            return document.getElementById('difficultyRange').value;
        }
    }).then((result) => {
        if (!result.isConfirmed) return;

        const difficulty = result.value;

        switch (difficulty) {
            case '1':
                gameMode = 'Easy';
                setBallSpeed('Easy');
                break;
            case '2':
                gameMode = 'Medium';
                setBallSpeed('Medium');
                break;
            case '3':
                gameMode = 'Hard';
                setBallSpeed('Hard');
                break;
        }
        // update, samo kdr je confirmed
        document.querySelector(".gamemodeVal").textContent = gameMode;
    });
}

function getDifficultyValue(mode) {
    switch (mode) {
        case 'Easy': return 1;
        case 'Medium': return 2;
        case 'Hard': return 3;
        default: return 2;
    }
}
