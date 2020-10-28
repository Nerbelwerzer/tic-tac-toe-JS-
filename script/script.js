const playerFactory = (token) => {
  return { token };
};

const easyAI = (token) => { 
  function move(board) {
    let squareIndex = Math.floor(Math.random() * 9)

    if (board[squareIndex] == "") {
      doc.printToken(token, doc.squares[squareIndex], board);
      
    }
    else { move(board) };
    return token;
  }
  return { name, token, move }
};

const mediumAI = (token) => { 
  function move(board) {
    let choice = Math.random();
    choice > 0.5 ? hardAI(token).move(board) : easyAI(token).move(board);
  }
  return { name, token, move }
}

const hardAI = (token) => { 
  function move(board) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = token;
        let score = game.minimax(board, false, token);
        board[i] = ""
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    doc.printToken(token, doc.squares[bestMove], board);
    return token;
  }
  return { token, move, };
};


const game = (function () {
  'use strict';
  let gameOver, player, board, ai, currentPlayer;
  let winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let minimaxValues = {
    X: -10,
    O: 10,
    draw: 0
  };

  function initialize(token, difficulty, array) {
    player = token;
    ai = difficulty;
    board = array;
    currentPlayer = player;
    gameOver = false;
  }

  function playerTurn(square) {
    if (square.textContent === '') {
      doc.printToken(player.token, square, board);
      findWinner(player.token);
      switchPlayer();
      if (gameOver == false) { aiTurn(); }
    }
    else { alert('Square already taken!') }
  }

  function aiTurn() {
    let token = ai.move(board);
    findWinner(token);
    switchPlayer();
  }

  function switchPlayer() {
    currentPlayer = currentPlayer == player ? ai : player;
  }

  function findWinner(token) {
    if (checkVictory(token) === 'draw') { 
      gameOver = true; 
      doc.displayWinner('Draw!') 
    }
    else if (checkVictory(token) === player.token) { 
      gameOver = true; 
      doc.displayWinner('You win!') 
    }
    else if (checkVictory(token) === ai.token) { 
      gameOver = true; 
      doc.displayWinner('Computer wins!') 
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

  function minimax(board, isMaximising, token) {
    let result = checkVictory(token);
    if (result !== null) {
      return minimaxValues[result];
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
    minimax,
    playerTurn
  }

})();

const doc = (function () {
  'use strict'
  let boardArray;
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
    game.initialize(player, ai, boardArray);

  }

  function printToken(token, square, board) {
    square.style.color = token == 'X' ? '#e61d1d' : '#313131'
    square.textContent = token;
    board[square.data] = token;
  }

  function displayWinner(text) {
    winnerText.textContent = text;
    winnerText.style.display = 'block';
  }

  return {
    squares: squares,
    setup,
    printToken,
    displayWinner
  }
})();









