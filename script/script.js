const playerFactory = (name, token) => {
  return { name, token };
};

const game = (function () {
  'use strict';

  let player1 = playerFactory('Paul', 'X')
  let ai = playerFactory('Computer', 'O')
  let takenSquares = 0;
  let winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let minimaxValues = {
    X: -10,
    O: 10,
    draw: 0
  }

  function printToken(square) {
    if (square.textContent === '') {
      square.textContent = player1.token;
      board.boardArray[square.data] = player1.token;
      takenSquares++
      checkVictory();
      aiTurn();
    }
    else { alert('Square already taken!') }
  }

  function checkVictory() {
    let winner = null;
    winConditions.forEach((condition) => {
      let count = 0;
      for (let i = 0; i < condition.length; i++) {
        if (board.boardArray[condition[i]] == player1.token) { count++ }

        if (count === 3) { winner = player1.token; }
      }
    });

    winConditions.forEach((condition) => {
      let count = 0;
      for (let i = 0; i < condition.length; i++) {
        if (board.boardArray[condition[i]] == ai.token) { count++ }

        if (count === 3) { winner = ai.token; }
      }
    });

    if (!board.boardArray.includes("")) {
      return 'draw'
    }
    return winner;

  }

  function aiTurn() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.boardArray.length; i++) {
      if (board.boardArray[i] === "") {
        board.boardArray[i] = ai.token;
        let score = minimax(board.boardArray, false);
        board.boardArray[i] = ""
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    board.boardArray[bestMove] = ai.token

    for (let i = 0; i < board.squares.length; i++) {
      if (board.squares[i].data === bestMove) {
        board.squares[i].textContent = ai.token;
      }
      
    }
    checkVictory()
    
  }

  function minimax(board, isMaximising) {
    let result = checkVictory();
    if (result !== null) {
      return minimaxValues[result]
    }
    
    if (isMaximising) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = ai.token;
          let score = minimax(board, false);
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
          board[i] = player1.token;
          let score = minimax(board, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  return {
    printToken,
  }

})();

const board = (function () {
  'use strict'

  let boardArray = ['', '', '', '', '', '', '', '', '']
  const squares = document.querySelectorAll('.square')

  for (let i = 0; i < squares.length; i++) {
    squares[i].data = i;

    squares[i].addEventListener('click', () => {
      game.printToken(squares[i]);
    });
  }

  return {
    squares: squares,
    boardArray: boardArray
  }
})();









