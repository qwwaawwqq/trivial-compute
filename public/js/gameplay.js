
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const layout = [
        'corner', 'blue', 'yellow', 'green', 'red', 'hq', 'corner',
        'yellow', 'player-home-0', 'blue', 'green', 'red', 'player-home-1', 'blue',
        'green', 'player-home-0', 'trivial-compute', 'player-home-1', 'yellow', 'red',
        'hq', 'green', 'red', 'hq', 'green', 'player-home-2', 'yellow',
        'red', 'player-home-2', 'green', 'red', 'blue', 'hq', 'green',
        'corner', 'yellow', 'green', 'blue', 'red', 'player-home-3', 'corner',
    ];
    const playerNames = ['Larry', 'Curly', 'Moe', 'Shemp'];
    const playerColors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff'];

    layout.forEach((type, index) => {
        const square = document.createElement('div');
        square.classList.add('square');
        if (type.includes('player-home')) {
            const playerIndex = parseInt(type.split('-')[2]);
            square.classList.add('player-home');
            square.textContent = playerNames[playerIndex];
            const centerDiv = createPlayerCenter(playerIndex);
            square.appendChild(centerDiv);
        } else if (type === 'corner') {
            square.classList.add('corner');
            square.textContent = 'Roll Again';
        } else if (type === 'hq') {
            square.classList.add('hq');
            square.textContent = 'HQ';
        } else if (type === 'trivial-compute') {
            square.classList.add('trivial-compute');
            square.textContent = 'Trivial Compute';
        } else {
            square.classList.add(type);
        }
        gameBoard.appendChild(square);
    });

    // Add player tokens
    const tokenPositions = [
        { top: '5px', left: '5px' },
        { top: '5px', right: '5px' },
        { bottom: '5px', left: '5px' },
        { bottom: '5px', right: '5px' }
    ];

    [8, 10, 38, 40].forEach((position, index) => {
        const token = document.createElement('div');
        token.classList.add('player-token');
        token.style.backgroundColor = playerColors[index];
        Object.assign(token.style, tokenPositions[index]);
        gameBoard.children[position].appendChild(token);
    });
});

function createPlayerCenter(playerIndex) {
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('player-center');
    centerDiv.style.borderColor = ['#ff0000', '#ffff00', '#00ff00', '#00ffff'][playerIndex];

    const colors = [
        ['#ff0000', '#ffff00', '#ffffff', '#00ffff'],
        ['#ffffff', '#ffff00', '#00ff00', '#00ffff'],
        ['#ff0000', '#00ff00', '#00ffff', '#ffffff'],
        ['#ffffff', '#ffff00', '#00ff00', '#00ffff']
    ];

    for (let j = 0; j < 4; j++) {
        const centerSquare = document.createElement('div');
        centerSquare.classList.add('center-square');
        centerSquare.style.backgroundColor = colors[playerIndex][j];
        centerDiv.appendChild(centerSquare);
    }

    return centerDiv;
}
