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
        window.location.reload();
    });
}



function youLose() {
    Swal.fire({
        title: 'You lost!',
        text: 'Do you want to continue?',
        icon: 'error',
        confirmButtonText: 'Yes'
    }).then(function () {
        window.location.reload();
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