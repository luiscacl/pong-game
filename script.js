/* Funciones / métodos que se usaron
Los radiantes es lo mismo que los grados, solo que tienen diferente unidad de medida. En los radiantes 3.1416(PI) equivale a 180 grados
Math.cos(x) --- x is a number representing an angle in radians. Retun value: The cosine of x, between -1 and 1, inclusive. 
The Math.sin(x) --- x is a number representing an angle in radians. Return value: The sine of x, between -1 and 1, inclusive.
The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position 
relative to the viewport.

SI SE HICIERA LO SIGUIENTE:
const seno = randomIntFromInterval(-1, 1);
const coseno = randomIntFromInterval(-1, 1);
Esto no funcionaría de la misma forma, ya que a pesar de que sabemos que el valor mínimo y máximo del coseno y seno es -1 y 1, a pesar de 
que se generaran ángulos en todas las direcciones estos tuvieran velocidades muy diferentes. Así que mejor se hace lo que se implementó en el 
código, ya que el valor del coseno y seno van de la mano para generar un ángulo en específico manteniendo una velocidad uniforme */


// Getting DOM elements
const ball = document.querySelector('#ball');
const playerPaddle = document.querySelector('#player-paddle');
const computerPaddle = document.querySelector('#computer-paddle');
const playerScore = document.querySelector('#player-score');
const computerScore = document.querySelector('#computer-score');

const INCREMENT_BALL_VELOCITY_X = randomIntFromInterval(0.001, 0.0015);
const INCREMENT_BALL_VELOCITY_Y = randomIntFromInterval(0.001, 0.00125);
const DIFICULTY_GAME_VALUE = 0.05;

// We create 2 constants for x and y to make the ball faster in x axis than in y axis
let initialBallVelocity_X = .6;
let initialBallVelocity_Y = .4;

let ballPosition_X = 50;
let ballPosition_Y = 50;

// CREATING FIRST BALL ANGLE
// Math.cos/sin tansforms de radiant angle in the coseno (x) / seno (y) axis
let angleInRadiants = randomIntFromInterval(0, 2 * Math.PI); // 2 * Math.PI es un angulo en radiantes. Es igual a 360°
let ballDirection = {x: Math.cos(angleInRadiants), y: Math.sin(angleInRadiants)}


function setBallCoordinates(){
  
  const playerPaddleCoordinates = playerPaddle.getBoundingClientRect();
  const computerPaddleCoodrinates = computerPaddle.getBoundingClientRect();

  // SETTING CSS VARIABLES
  ball.style.setProperty('--x', ballPosition_X);
  ball.style.setProperty('--y', ballPosition_Y);


  // BOUNDING WALLS / ANIMATION BALL
  const ballCoordinates = ball.getBoundingClientRect();

  if(isCollision(computerPaddleCoodrinates, ballCoordinates) || isCollision(playerPaddleCoordinates, ballCoordinates)){
    ballDirection.x *= -1;
  } 
  if(ballCoordinates.bottom >= window.innerHeight || ballCoordinates.top <= 0){
    ballDirection.y *= -1;
  }

  // CHECK WINNER / LOSER
  if(ballCoordinates.right >= window.innerWidth){
    checkWinner_Looser('playerWins');
  }
  if(ballCoordinates.left <= 0){
    checkWinner_Looser('computerWins');
  }

  ballPosition_X += ballDirection.x * initialBallVelocity_X;
  ballPosition_Y += ballDirection.y * initialBallVelocity_Y;

  if(initialBallVelocity_X <= 1.6){

    initialBallVelocity_X += INCREMENT_BALL_VELOCITY_X;
    initialBallVelocity_Y += INCREMENT_BALL_VELOCITY_Y;
  }
  console.log(initialBallVelocity_X, initialBallVelocity_Y)

  // MOVING COMPUTER PADDLE
  // La posición del paddle se convierte en número, eso es importante
  let computerPaddlePosition = parseFloat(getComputedStyle(computerPaddle).getPropertyValue('--position'));
  let ballPositionInPercentege = (ballCoordinates.y * 100) / window.innerHeight;

  computerPaddlePosition = computerPaddlePosition + (DIFICULTY_GAME_VALUE * (ballPositionInPercentege - computerPaddlePosition));
  computerPaddle.style.setProperty('--position', computerPaddlePosition);


  window.requestAnimationFrame(setBallCoordinates);
}

function isCollision(paddleCoordinates, ballCoordinates){
  return (
    paddleCoordinates.left <= ballCoordinates.right &&
    paddleCoordinates.right >= ballCoordinates.left &&
    paddleCoordinates.top <= ballCoordinates.bottom &&
    paddleCoordinates.bottom >= ballCoordinates.top
  )
}

function checkWinner_Looser(winningMessage){
  if(winningMessage === 'playerWins'){
    playerScore.textContent = parseInt(playerScore.textContent) + 1;

  } else {
    computerScore.textContent = parseInt(computerScore.textContent) + 1;
  }
  // RESET VALUES
  initialBallVelocity_X = .6;
  initialBallVelocity_Y = .4;

  ballPosition_X = 50;
  ballPosition_Y = 50;

  angleInRadiants = randomIntFromInterval(0, 2 * Math.PI); 
  ballDirection = {x: Math.cos(angleInRadiants), y: Math.sin(angleInRadiants)}
}

function movePlayerPaddle(event){
  const convertingPxToPercentage = (event.y * 100) / window.innerHeight;
  playerPaddle.style.setProperty('--position', convertingPxToPercentage);
}

function randomIntFromInterval(min, max) {
  return Math.random() * (max - min) + min;
}

window.addEventListener('mousemove', movePlayerPaddle);
window.requestAnimationFrame(setBallCoordinates);


