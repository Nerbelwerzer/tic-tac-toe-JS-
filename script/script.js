//This code is a bit of a mess, I'm afraid. 

const playerFactory = (token) => {
  return { token };
};

const easyAI = (token) => {
  

  function move() {
    let squareIndex = Math.floor(Math.random() * 9)

    if (doc.boardArray[squareIndex] == "") {
      doc.printToken(token, doc.squares[squareIndex]);
      game.displayWinner(token);
      game.switchPlayer();
    }
    else { move() };
  }

  return { name, token, move }
};

const mediumAI = (token) => {
  

  function move() {
    let choice = Math.random();
    choice > 0.5 ? hardAI(token).move() : easyAI(token).move();
  }

  return { name, token, move }
}

const hardAI = (token) => {
  

  function move() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < doc.boardArray.length; i++) {
      if (doc.boardArray[i] === "") {
        doc.boardArray[i] = token;
        let score = game.minimax(doc.boardArray, false, token);
        doc.boardArray[i] = ""
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    doc.printToken(token, doc.squares[bestMove]);
    game.displayWinner(token);
    game.switchPlayer();
  }

  return { token, move, };
};


const game = (function () {
  'use strict';
  let gameOver;
  let player = playerFactory('X')
  let ai;
  let currentPlayer;
  let winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let minimaxValues = {
    X: -10,
    O: 10,
    draw: 0
  };

  function initialize(token, difficulty) {
    doc.boardArray = ['', '', '', '', '', '', '', '', ''];
    player = token;
    ai = difficulty;
    currentPlayer = player;
    gameOver = false;
  }

  function switchPlayer() {
    currentPlayer = currentPlayer == player ? ai : player;
  }

  function playerTurn(square) {
    if (square.textContent === '') {
      doc.printToken(player.token, square);
      displayWinner(player.token);
      switchPlayer();
      if (gameOver == false) { ai.move(); }
    }
    else { alert('Square already taken!') }
  }

  function displayWinner(token) {
    if (checkVictory(token) === 'draw') { 
      gameOver = true; 
      doc.displayWinner('Draw!') 
    }
    else if (checkVictory(token) == 'X') { 
      gameOver = true; 
      doc.displayWinner('You win!') 
    }
    else if (checkVictory(token) === 'O') { 
      gameOver = true; 
      doc.displayWinner('Computer wins!') 
    }
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


  function checkVictory(token) {
    let winner = null;

    winConditions.forEach((condition) => {
      let count = 0;
      for (let i = 0; i < condition.length; i++) {
        if (doc.boardArray[condition[i]] == token) { count++ }

        if (count === 3) {
          winner = token;
        }
      }
    });

    if (winner === null && !doc.boardArray.includes("")) {
      return 'draw';
    }

    return winner;
  }


  return {
    initialize,
    minimax,
    displayWinner,
    switchPlayer,
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
    game.initialize(player, ai);

  }

  function printToken(token, square) {
    square.style.color = token == 'X' ? '#e61d1d' : '#313131'
    square.textContent = token;
    doc.boardArray[square.data] = token;
  }

  function displayWinner(text) {
    winnerText.textContent = text;
    winnerText.style.display = 'block';
  }

  return {
    squares: squares,
    boardArray: boardArray,
    setup,
    printToken,
    displayWinner
  }
})();









