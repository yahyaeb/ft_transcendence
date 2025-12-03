const urlParams1 = new URLSearchParams(window.location.search);
const player1 = urlParams1.get('player1') || 'Player 1';
const player2 = urlParams1.get('player2') || 'Player 2';
const player3 = urlParams1.get('player3') || 'Player 3';
const player4 = urlParams1.get('player4') || 'Player 4';

const match1Player1Element = document.getElementById('match1-player1')!;
const match1Player2Element = document.getElementById('match1-player2')!;
const match2Player1Element = document.getElementById('match2-player1')!;
const match2Player2Element = document.getElementById('match2-player2')!;

match1Player1Element.textContent = player1;
match1Player2Element.textContent = player2;
match2Player1Element.textContent = player3;
match2Player2Element.textContent = player4;

sessionStorage.setItem('tournamentPlayers', JSON.stringify({
    player1,
    player2,
    player3,
    player4
}));

const startTournamentButton = document.getElementById('startTournament')!;

startTournamentButton.addEventListener('click', () => {
    sessionStorage.setItem('currentMatch', '1');
    sessionStorage.setItem('match1Winner', '');
    sessionStorage.setItem('match2Winner', '');
    
    window.location.href = `./Gameplay.html?player1=${encodeURIComponent(player1)}&player2=${encodeURIComponent(player2)}&tournamentMatch=1`;
    
});
