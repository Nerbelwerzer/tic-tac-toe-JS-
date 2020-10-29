const game = (function () {
  'use strict';
  let gameOver, player, board, ai;
  let winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  function initialize(token, difficulty, array) {
    player = token;
    ai = difficulty;
    board = array;
    gameOver = false;
  }

  function playerTurn(square) {
    if (square.textContent === '') {
      docControl.printToken(player.token, square.data, board);
      findWinner(player.token);
      if (gameOver == false) { aiTurn(); }
    }
    else { alert('Square already taken!') }
  }

  function aiTurn() {
    let token = ai.move(board);
    findWinner(token);
  }

  function findWinner(token) {
    if (checkVictory(token) === 'draw') {
      gameOver = true;
      docControl.displayWinner('Draw!')
    }
    else if (checkVictory(token) === player.token) {
      gameOver = true;
      docControl.displayWinner('You win!')
    }
    else if (checkVictory(token) === ai.token) {
      gameOver = true;
      docControl.displayWinner('Computer wins!')
    }
  }

  function checkVictory(token) {
    let winner = null;

    winConditions.forEach((condition) => {
      let count = 0;
      for (let i = 0; i < condition.length; i++) {
        if (board[condition[i]] == token) { count++ }

        if (count === 3) { winner = token }
      }
    });
    if (winner === null && !board.includes("")) {
      return 'draw';
    }
    return winner;
  }

  function playerToken() {
    return player.token;
  }

  return {
    playerToken,
    checkVictory,
    initialize,
    playerTurn
  }
})();

const docControl = (function () {
  'use strict'
  const winnerText = document.getElementById('winner-text')
  const gameBoard = document.getElementById('board')
  const form = document.getElementById('player-form')
  const squares = document.querySelectorAll('.square')

  for (let i = 0; i < squares.length; i++) {
    squares[i].data = i;

    squares[i].addEventListener('click', () => {
      game.playerTurn(squares[i]);
    });
  }

  function setup() {
    gameBoard.style.display = 'grid';
    winnerText.style.display = 'none';

    squares.forEach((square) => {
      square.textContent = ''
    });

    let boardArray = ['', '', '', '', '', '', '', '', ''];
    let player = playerFactory('X');
    let ai;

    switch (form.difficulty.value) {
      case 'easy':
        ai = easyAI('O');
        break;
      case 'medium':
        ai = mediumAI('O');
        break;
      case 'hard':
        ai = hardAI('O');
    }
    game.initialize(player, ai, boardArray);
  }

  function printToken(token, index, board) {
    squares[index].style.color = token == 'X' ? '#e61d1d' : '#313131'
    squares[index].textContent = token;
    board[index] = token;
  }

  function displayWinner(text) {
    winnerText.textContent = text;
    winnerText.style.display = 'block';
  }

  return {
    setup,
    printToken,
    displayWinner
  }
})();

const playerFactory = (token) => {
  return { token };
};

const easyAI = (token) => {
  function move(board) {
    let squareIndex = Math.floor(Math.random() * 9)
    board[squareIndex] == "" ? docControl.printToken(token, squareIndex, board) : move(board)
    return token;
  };
  return { name, token, move }
};

const mediumAI = (token) => {
  function move(board) {
    let choice = Math.random();
    choice > 0.4 ? hardAI(token).move(board) : easyAI(token).move(board);
    return token;
  }
  return { name, token, move }
}

const hardAI = (token) => {
  let minimaxValues = {
    X: -1,
    O: 1,
    draw: 0
  };

  function move(board) {
    let bestMove = minimax(board, false, token, null)
    docControl.printToken(token, bestMove, board);
    return token;
  }

  function minimax(board, isMaximising, currentToken, index) {
    let bestScore = -Infinity;
    let result = game.checkVictory(currentToken);

    if (result !== null) {
      let score = minimaxValues[result];
      if (score > bestScore) {
        let bestMove = index;
        return bestMove
      }
    }

    if (isMaximising) {
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = token;
          let score = minimax(board, false, token, i);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    }
    else {
      bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = game.playerToken();
          let score = minimax(board, true, game.playerToken(), i);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }
  return { token, move, };
};








