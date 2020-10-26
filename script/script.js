const playerFactory = (name, token) => {
  return { name, token };
};


const game = (function () {
  'use strict';

  let player1;
  let player2;
  let currentPlayer;
  let takenSquares = 0;
  let winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function startGame(one, two) {
    player1 = one;
    player2 = two;
    currentPlayer = player1;
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function printToken(square) {
    if (currentPlayer === undefined) { alert('Please enter player names') }
    else if (square.textContent === '') {
      square.textContent = currentPlayer.token;
      board.boardArray[square.data] = currentPlayer.token;
      takenSquares ++
      checkVictory();
      switchPlayer();
    }
    else { alert('Square taken') }
  }

  function checkVictory() {
    winConditions.forEach((condition) => {
      let count = 0;
      for (let i = 0; i < condition.length; i++) {
        if (board.boardArray[condition[i]] != currentPlayer.token) { break; }
        else { count++; }
        
        if (count === 3) { alert('winner'); return false; }
      }
    });

    if (takenSquares === 9) { alert('draw') }
  }

  return {
    printToken,
    startGame,
    currentPlayer: currentPlayer
  }

})();

const board = (function () {
  'use strict'

  let boardArray = ['', '', '', '', '', '', '', '', '']
  const squares = document.querySelectorAll('.square')
  const playerForm = document.getElementById('player-form')

  for (let i = 0; i < squares.length; i++) {
    squares[i].data = i;

    squares[i].addEventListener('click', () => {
      game.printToken(squares[i]);
    });
  }

  function getPlayers() {
    let player1 = playerFactory(playerForm.player1Name.value, 'X');
    let player2 = playerFactory(playerForm.player2Name.value, 'O');

    game.startGame(player1, player2);
  }

  return {
    getPlayers,
    boardArray: boardArray
  }
})();





