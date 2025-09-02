const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const restartBtn = document.getElementById('restart');
const resetScoresBtn = document.getElementById('resetScores');

let cells = Array.from(document.querySelectorAll('.cell'));
let board = Array(9).fill(null);
let current = 'X'; 
let scores = { X: 0, O: 0 };
let gameOver = false;

const wins = [
  [0,1,2], [3,4,5], [6,7,8],  
  [0,3,6], [1,4,7], [2,5,8],  
  [0,4,8], [2,4,6]            
];

function setTurnText() {
  statusEl.textContent = gameOver ? statusEl.textContent : `${current}’s turn`;
}

function handleClick(e){
  const idx = +e.currentTarget.dataset.index;
  if (board[idx] || gameOver) return;

  board[idx] = current;
  e.currentTarget.textContent = current;
  e.currentTarget.classList.add(current.toLowerCase());
  e.currentTarget.setAttribute('aria-label', `cell ${idx+1} ${current}`);

  const winner = getWinner();
  if (winner) {
    finishGame(winner);
  } else if (board.every(Boolean)) {
    statusEl.textContent = 'It’s a draw 🤝';
    gameOver = true;
  } else {
    current = current === 'X' ? 'O' : 'X';
    setTurnText();
  }
}

function getWinner(){
  for (const [a,b,c] of wins){
    if (board[a] && board[a] === board[b] && board[a] === board[c]){
      [a,b,c].forEach(i => {
        cells[i].classList.add(board[a] === 'X' ? 'win-x' : 'win-o');
      });
      return board[a];
    }
  }
  return null;
}

function finishGame(winner){
  gameOver = true;
  statusEl.textContent = `${winner} wins! 🏆`;
  scores[winner]++;
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  cells.forEach(c => c.disabled = true);
}

function newRound(){
  board.fill(null);
  cells.forEach(c => {
    c.disabled = false;
    c.textContent = '';
    c.classList.remove('x','o','win-x','win-o');
  });
  gameOver = false;
  current = current === 'X' ? 'O' : 'X'; 
  setTurnText();
}

function resetScores(){
  scores = { X:0, O:0 };
  scoreXEl.textContent = '0';
  scoreOEl.textContent = '0';
  newRound();
}

cells.forEach(btn => btn.addEventListener('click', handleClick));
restartBtn.addEventListener('click', newRound);
resetScoresBtn.addEventListener('click', resetScores);
setTurnText();
