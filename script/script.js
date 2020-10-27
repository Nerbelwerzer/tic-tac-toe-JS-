const playerFactory = (name, token) => {
  return { name, token };
};

const easyAI = (token) => {
  let name = 'Computer'

  function move() {
    let square = Math.floor(Math.random() * 9)

    if (board.boardArray[square] == "") {
      board.boardArray[square] = token;
      board.squares[square].textContent = token;
      game.displayWinner(token)
      game.switchPlayer()
    }
    else { move() }
  }

  return { name, token, move }
};

const mediumAI = (token) => {
  let name = 'Computer'

  function move() {
    let choice = Math.random()
    choice > 0.5 ? hardAI(token).move() : easyAI(token).move();
  }

  return { name, token, move }
}

const hardAI = (token) => {
  let name = 'Computer'

  function move() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.boardArray.length; i++) {
      if (board.boardArray[i] === "") {
        board.boardArray[i] = token;
        let score = game.minimax(board.boardArray, false, token);
        board.boardArray[i] = ""
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    board.squares[bestMove].textContent = token;
    board.boardArray[bestMove] = token
    game.displayWinner(token)
    game.switchPlayer()
  }

  return { name, token, move, }
};


const game = (function () {
  'use strict';

  let player = playerFactory('Paul', 'X')
  let ai;
  let currentPlayer;
  let winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let minimaxValues = {
    X: -10,
    O: 10,
    draw: 0
  }

  function initialize(name, difficulty) {
    board.boardArray = ['', '', '', '', '', '', '', '', '']
    player = name;
    ai = difficulty;
    currentPlayer = player;
  }

  function switchPlayer() {
    currentPlayer = currentPlayer == player ? ai : player;
  }

  function printToken(square) {
    if (square.textContent === '') {
      square.textContent = player.token;
      board.boardArray[square.data] = player.token;
      displayWinner(player.token)
      switchPlayer()
      ai.move();
    }
    else { alert('Square already taken!') }
  }

  function displayWinner(token) {
    if (checkVictory(token) === 'draw') { alert("It's a draw!") }
    else if (checkVictory(token) != null) { alert(currentPlayer.name + ' wins') }
  }

  function checkVictory(token) {
    let winner = null;

    winConditions.forEach((condition) => {
      let count = 0;
      for (let i = 0; i < condition.length; i++) {
        if (board.boardArray[condition[i]] == token) { count++ }

        if (count === 3) {
          winner = token;
        }
      }
    });

    if (winner === null && !board.boardArray.includes("")) {
      return 'draw'
    }

    return winner;
  }



  function minimax(board, isMaximising, token) {
    let result = checkVictory(token);
    if (result !== null) {
      return minimaxValues[result]
    }

    if (isMaximising) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = ai.token;
          let score = minimax(board, false, ai.token);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    }
    else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = player.token;
          let score = minimax(board, true, player.token);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  return {
    initialize,
    printToken,
    minimax,
    displayWinner,
    switchPlayer,
  }

})();

const board = (function () {
  'use strict'
  let boardArray;
  const squares = document.querySelectorAll('.square')
  const form = document.getElementById('player-form')

  for (let i = 0; i < squares.length; i++) {
    squares[i].data = i;

    squares[i].addEventListener('click', () => {
      game.printToken(squares[i]);
    });
  }

  function getPlayers() {

    
    squares.forEach((square) => {
      square.textContent = ''
    })

    let player = playerFactory(form.playerName.value, 'X')
    let ai;

    switch(form.difficulty.value) {
      case 'easy':
        ai = easyAI('O');
        break;
      case 'medium':
        ai = mediumAI('O');
        break;
      case 'hard':
        ai = hardAI('O');        
    }
    console.log(ai)
    game.initialize(player, ai)

  }

  return {
    squares: squares,
    boardArray: boardArray,
    form: form,
    getPlayers
  }
})();









