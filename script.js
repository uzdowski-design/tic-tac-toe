const playerOne = 'fa-circle-o';
const playerTwo = 'fa-times';
let playerOneScore = 0;
let playerTwoScore = 0;
let round = 1;
let winner = null;
let winCombination = null;
let move = 0;

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
const divFields = [
  ['0', '1', '2'],
  ['3', '4', '5'],
  ['6', '7', '8']
];
const combinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
];
const boxes = [...document.querySelectorAll('.box')];
const replay = document.querySelector('.buttons .replay');
const reset = document.querySelector('.buttons .reset');


boxes.forEach(box => box.addEventListener('click', pick));
replay.addEventListener('click', playAgain);
reset.addEventListener('click', restart);

toggleActive();

function pick(event) {
  const { row, column } = event.target.dataset;
  const turn = (round + move) % 2 === 0 ? playerTwo : playerOne;
  if (winner !== null) return;
  if (board[row][column] !== '') return;
  event.target.classList.add(turn);
  board[row][column] = turn;
  round++;
  toggleActive();
  if (check()) {
    winCombination.forEach(number => {
      document.querySelector(`[data-number="${number}"]`).classList.add('won');
    });
    document.querySelector(`.scoreboard .${winner}`).classList.add('won');
    document.querySelector('#score').textContent = `${playerOneScore} : ${playerTwoScore}`
    // document.querySelectorAll('.score span').forEach(el => el.classList.remove('active'));
  }
  if (round > 9 && !check()) {
    boxes.forEach(box => box.classList.add('lost'));
    document.querySelectorAll('.score span').forEach(el => el.classList.remove('won'));
  }
}

function check() {
  const result = board.reduce((total, row) => total.concat(row));
  let moves = {
    'fa-times': [],
    'fa-circle-o': []
  };
  result.forEach((field, index) => moves[field] ? moves[field].push(index) : null);
  combinations.forEach(combination => {
    if (combination.every(index => moves[playerOne].indexOf(index) > -1)) {
      winCombination = combination;
      winner = playerOne;
      playerOneScore++;
    }
    if (combination.every(index => moves[playerTwo].indexOf(index) > -1)) {
      winCombination = combination;
      winner = playerTwo;
      playerTwoScore++;
    }
  });
  return winner;
}

function playAgain() {
  round = 1;
  if (winner === playerOne) {
    move = 1;
  }
  if (winner === playerTwo) {
    move = 0;
  }
  winner = null;
  winCombination = null;
  boxes.forEach(box => {
    box.classList.remove(playerOne);
    box.classList.remove(playerTwo);
    box.classList.remove('won');
  });
  document.querySelectorAll('.score span').forEach(el => el.classList.remove('won'));
  boxes.forEach(box => box.classList.remove('lost'));
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

}
function restart() {
  playAgain();
  playerOneScore = 0;
  playerTwoScore = 0;
  document.querySelector('#score').textContent = `${playerOneScore} : ${playerTwoScore}`;
  move = 0;
  toggleActive();
}

function toggleActive() {
  const active = (round + move) % 2 === 0 ? '.fa-times' : '.fa-circle-o';
  document.querySelectorAll('.score span').forEach(el => el.classList.remove('active'));
  document.querySelector(active).classList.add('active');
}