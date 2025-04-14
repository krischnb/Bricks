function updateCurrentPlayer(score, time, gameMode) {
    const currentPlayerId = parseInt(localStorage.getItem('currentPlayerId'));
    let database = JSON.parse(localStorage.getItem('playerDatabase')) || [];

    const index = database.findIndex(player => player.id === currentPlayerId);
    if (index !== -1) {
        // posodobi statse, samo ce je scori vecji od prejsnega
        if (score > database[index].score) {
            database[index].score = score;
            database[index].time = time;
            database[index].gameMode = gameMode;
            localStorage.setItem('playerDatabase', JSON.stringify(database));
        }
    }
}

function showLeaderboard() {
    const database = JSON.parse(localStorage.getItem('playerDatabase')) || [];

    const sorted = database
    // .filter(p => p.score !== null && p.time !== null)
    .sort((a, b) => {
       // sort po scoru
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        // ce je score isti, sort po času
        return a.time - b.time;
    });

    const container = document.getElementById('leaderboardContainer');
    if (sorted.length === 0) {
        container.innerHTML = "<p>No completed games yet.</p>";
        return;
    }

    let html = `
        <div class="leaderboard-header leaderboard-cell">ID</div>
        <div class="leaderboard-header leaderboard-cell">Name</div>
        <div class="leaderboard-header leaderboard-cell">Score</div>
        <div class="leaderboard-header leaderboard-cell">Time</div>
        <div class="leaderboard-header leaderboard-cell">Difficulty</div>
    `;

    sorted.forEach(p => {
        html += `
            <div class="leaderboard-cell">${p.id}</div>
            <div class="leaderboard-cell">${p.username}</div>
            <div class="leaderboard-cell">${p.score ?? '-'}</div>
            <div class="leaderboard-cell">${p.time ? p.time + ' s' : '-'}</div>
            <div class="leaderboard-cell">${p.gameMode ?? '-'}</div>
        `;
    });

    container.innerHTML = html;
}


function showLeaderboardModal() {
    document.getElementById('leaderboardOverlay').classList.remove('hideModal');
    showLeaderboard(); // load data
}

function closeLeaderboardModal() {
    document.getElementById('leaderboardOverlay').classList.add('hideModal');
}

// ce kliknes ven, zapre modal
document.getElementById('leaderboardOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'leaderboardOverlay') {
        closeLeaderboardModal();
    }
})

function clearDatabase() {
    localStorage.removeItem('playerDatabase');
    console.log("Player database has been cleared.");
}