const canvas = document.querySelector('canvas');
const header = document.querySelector('header');
const c = canvas.getContext('2d');
const menu = document.querySelector('#menu');
const nameAsker = document.getElementById('name_asker');
const nameBox = document.getElementById('name');
const singleplayer = document.querySelector('.play1');
const multiplayer = document.querySelector('.play2');
const highscores = document.getElementById('highscores');
let gameOn;
highscores.style.display = 'none';
nameAsker.style.display = 'none';
singleplayer.addEventListener('click', () => {
  menu.style.display = 'none';
  gameOn = true;
  createGame(1);
  animate(1);
});
multiplayer.addEventListener('click', () => {
  menu.style.display = 'none';
  gameOn = true;
  createGame(2);
  animate(2);
});
//highscore manipulation and display functions/event-listeners
highscores.addEventListener('click', () => {});
let highscore;
document.addEventListener('keypress', event => {
  if (event.key === 'Enter' && nameBox.value) {
    console.log(highscore);
    addHighscore(nameBox.value, highscore);
    nameBox.value = '';
    nameAsker.style.display = 'none';
    menu.style.display = 'block';
  }
});
document.getElementById('back').addEventListener('click', () => {
  highscores.style.display = 'none';
  menu.style.display = 'block';
});
document.querySelector('.highscores').addEventListener('click', () => {
  const scores = getHighscores();
  document.getElementById('scores').innerHTML = '';
  if (scores) {
    scores.forEach(el => {
      if (scores.indexOf(el) > -1) {
        const patern = `<div class="highscore">
    <p class="nick">${el[0]}</p>
    <p>${el[1]}</p>
  </div>`;
        document
          .getElementById('scores')
          .insertAdjacentHTML('beforeend', patern);
      }
    });
  }
  menu.style.display = 'none';
  highscores.style.display = 'block';
});
const fps = 10;
const snakeSize = 20;
const controls1 = {
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'rigth'
};
const controls2 = {
  i: 'up',
  k: 'down',
  j: 'left',
  l: 'rigth'
};

startPosition1 = [snakeSize * 20, snakeSize * 5];
startPosition2 = [snakeSize * 20, snakeSize * 20];

function init() {
  canvas.width =
    window.innerWidth / 1.3 - ((window.innerWidth / 1.3) % snakeSize);
  canvas.height =
    window.innerHeight / 1.5 - ((window.innerHeight / 1.5) % snakeSize);
}
init();
//adding event listeners
window.addEventListener('resize', init);
window.addEventListener('keypress', event => {
  const regex1 = /[w,s,a,d]/;
  const regex2 = /[i,k,j,l]/;
  if (event.key.match(regex1)) {
    snake1.turn(controls1[event.key]);
  } else if (event.key.match(regex2)) {
    snake2.turn(controls2[event.key]);
  }
});

class Mouse {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw = function() {
    c.beginPath();
    c.rect(this.x, this.y, snakeSize, snakeSize);
    c.strokeStyle = 'black';
    c.stroke();
    c.fillStyle = 'red';
    c.fill();
    c.closePath();
  };
  realocate = function() {
    let position = [
      Math.floor((canvas.width / snakeSize) * Math.random()) * snakeSize,
      Math.floor((canvas.height / snakeSize) * Math.random()) * snakeSize
    ];
    while (true) {
      if (
        snake1.body.find(el => el.x === position[0] && el.y === position[1]) ||
        snake2.body.find(el => el.x === position[0] && el.y === position[1])
      ) {
        position = [
          Math.floor((canvas.width / snakeSize) * Math.random()) * snakeSize,
          Math.floor((canvas.height / snakeSize) * Math.random()) * snakeSize
        ];
      } else {
        break;
      }
    }
    this.x = position[0];
    this.y = position[1];
  };
}

class Snake {
  constructor(id, body, directionH, directionV, alive) {
    this.id = id;
    this.directionH = directionH;
    this.directionV = directionV;
    this.body = body;
    this.alive = alive;
    this.growth = 0;
  }
  draw = function() {
    this.body.forEach(el => {
      c.beginPath();
      c.rect(el.x, el.y, el.edgeLength, el.edgeLength);
      c.strokeStyle = 'gray';
      c.stroke();
      c.fillStyle = 'black';
      c.fill();
      c.closePath();
    });
  };

  move = function() {
    if (this.alive) {
      this.body.unshift(
        new Rect(
          snakeSize,
          this.body[0].x + snakeSize * this.directionH,
          this.body[0].y + snakeSize * this.directionV
        )
      );
      if (this.body[0].x === mouse.x && this.body[0].y === mouse.y) {
        this.grow();
        mouse.realocate();
      }
      if (this.growth > 0) {
        this.growth -= 1;
      } else {
        this.body.pop();
      }
      if (
        this.body[0].x < 0 ||
        this.body[0].x + snakeSize > canvas.width ||
        this.body[0].y + snakeSize > canvas.height ||
        this.body[0].y < 0
      ) {
        this.die();
      } else if (
        this.body.find(
          el =>
            el !== this.body[0] &&
            el.x === this.body[0].x &&
            el.y === this.body[0].y
        )
      ) {
        this.die();
      } else if (this.id === 1) {
        const collision = snake2.body.find(
          el => el.x === this.body[0].x && el.y === this.body[0].y
        );
        if (collision) {
          this.die();
        }
      } else if (this.id === 2) {
        const collision = snake1.body.find(
          el => el.x === this.body[0].x && el.y === this.body[0].y
        );
        if (collision) {
          this.die();
        }
      }
    }
    this.draw();
  };
  turn = function(direction) {
    if (this.directionH === 0 && direction === 'left') {
      this.directionH = -1;
      this.directionV = 0;
    } else if (this.directionH === 0 && direction === 'rigth') {
      this.directionH = 1;
      this.directionV = 0;
    } else if (this.directionV === 0 && direction === 'up') {
      this.directionV = -1;
      this.directionH = 0;
    } else if (this.directionV === 0 && direction === 'down') {
      this.directionV = 1;
      this.directionH = 0;
    }
  };
  grow = function() {
    this.growth += 3;
  };
  die = function() {
    this.alive = false;
    if (this.id === 1 && !snake2.alive) {
      gameOver();
    } else if (this.id === 2 && !snake1.alive) {
      gameOver();
    }
  };
}

class Rect {
  constructor(edgeLength, x, y) {
    this.edgeLength = edgeLength;
    this.x = x;
    this.y = y;
  }
}
let snake1;
let snake2;
let mouse;

function createGame(numOfPlayers) {
  const snakeBody1 = [];
  const snakeBody2 = [];
  for (let i = 0; i < 5; i++) {
    snakeBody1.push(
      new Rect(snakeSize, startPosition1[0] - i * snakeSize, startPosition1[1])
    );
  }
  for (let i = 0; i < 5; i++) {
    snakeBody2.push(
      new Rect(snakeSize, startPosition2[1] + i * snakeSize, startPosition2[1])
    );
  }
  console.log(snakeBody1);
  snake1 = new Snake(1, snakeBody1, 1, 0, true);
  if (numOfPlayers === 1) {
    snake2 = new Snake(2, [], 0, 0, false);
  } else if (numOfPlayers === 2) {
    snake2 = new Snake(2, snakeBody2, -1, 0, true);
  }
  mouse = new Mouse(
    Math.floor((canvas.width / snakeSize) * Math.random()) * snakeSize,
    Math.floor((canvas.height / snakeSize) * Math.random()) * snakeSize
  );
}

function animate(numOfPlayers) {
  setTimeout(() => {
    if (gameOn) animate();
  }, 1000 / fps);
  c.clearRect(0, 0, canvas.width, canvas.height);
  mouse.draw();
  snake1.move();
  snake2.move();
  if (numOfPlayers === 2) snake2.move();
}

function gameOver() {
  const highscores = getHighscores();
  const player1Score = snake1.body.length;
  const player2Score = snake2.body.length;
  if (!highscores) {
    highscore = player1Score > player2Score ? player1Score : player2Score;
    nameAsker.style.display = 'block';
  } else if (
    player1Score >= parseInt(highscores[0][1]) ||
    player2Score >= parseInt(highscores[0][1])
  ) {
    highscore = player1Score > player2Score ? player1Score : player2Score;
    nameAsker.style.display = 'block';
  } else {
    menu.style.display = 'block';
  }
  gameOn = false;
}

function getHighscores() {
  const scores = localStorage.getItem('snake_highscores');
  console.log(scores);
  if (scores) {
    console.log('lol');
    return scores.split(',').map(el => el.split('_'));
  }
}
function addHighscore(name, score) {
  const oldHighscores = localStorage.getItem('snake_highscores');
  if (oldHighscores) {
    localStorage.setItem(
      'snake_highscores',
      `${name}_${score},` + oldHighscores
    );
  } else {
    localStorage.setItem('snake_highscores', `${name}_${score}`);
  }
  console.log(localStorage.getItem('snake_highscores'));
}
init();
console.log(getHighscores());
