import './styles/global.scss';
import humanHead from './../assets/human-head.svg';

// const humanHead = document.querySelectorAll('.human-head');
const humanBody = document.querySelector('.human-body');
const humanArmLeft = document.querySelector('.human-arm-left');
const humanArmRight = document.querySelector('.human-arm-right');
const humanLegLeft = document.querySelector('.human-leg-left');
const humanLegRight = document.querySelector('.human-leg-right');
const gallows = document.querySelector('.gallows-container');

function displayPartOfBody(partsDrawn) {
  const bodyPart = document.createElement('img');
  bodyPart.classList.add('bodypart');
  if (partsDrawn === 1) {
    // {
    //   humanHead.forEach((humanHead) => {
    //     humanHead.classList.remove('hidden');
    //   });
    {
      bodyPart.src = humanHead;
      gallows.appendChild(bodyPart);
    }
  } else if (partsDrawn === 2) {
    humanBody.classList.remove('hidden');
  } else if (partsDrawn === 3) {
    humanArmLeft.classList.remove('hidden');
  } else if (partsDrawn === 4) {
    humanArmRight.classList.remove('hidden');
  } else if (partsDrawn === 5) {
    humanLegLeft.classList.remove('hidden');
  } else if (partsDrawn === 6) {
    humanLegRight.classList.remove('hidden');
  }
}

const url = './src/questions.json';
let jsonData;
try {
  let response = await fetch(url);

  if (response.ok) {
    // если HTTP-статус в диапазоне 200-299, получаем тело ответа
    jsonData = await response.json();
  } else {
    alert('Error: ' + response.status);
  }
} catch (error) {
  // обработка ошибок при запросе
  alert('Error: ' + error);
}

/* above is kek */
/* Game Constants */

const maxWrongGuesses = 6;

const wordDisplay = document.querySelector('#word');
const hintDisplay = document.querySelector('#hint');
const wrongGuessesDisplay = document.querySelector('#wrongGuesses');
const statusDisplay = document.querySelector('#status');
const keyboard = document.querySelector('#keyboard');
const resetButton = document.querySelector('#reset');

/* Game State */

let word = pickRandom(jsonData);
let rightGuesses = [];
let wrongGuesses = [];
let wrongGuessesCount = 0;

/* Game Logic */

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function resetGame() {
  word = pickRandom(jsonData);
  rightGuesses = [];
  wrongGuesses = [];
  wrongGuessesCount = 0;

  clearKeyboard();
  clearStatus();
  hideBodyParts();
  updateDisplay();
}
function updateDisplay() {
  wordDisplay.innerHTML = word.word
    .split('')
    .map((letter) => (rightGuesses.includes(letter) ? letter : '__'))
    .join(' ');

  hintDisplay.innerHTML = `Hint: ${word.hint}`;
  wrongGuessesDisplay.innerHTML = `Incorrect: ${wrongGuessesCount}/6`;
}
function initReset() {
  resetButton.addEventListener('click', resetGame);
}
function clearKeyboard() {
  const buttons = keyboard.querySelectorAll('.key');
  for (const button of buttons) {
    button.disabled = false;
    button.classList.remove('correct');
    button.classList.remove('incorrect');
  }
}
function hideBodyParts() {
  const bodyparts = document.querySelectorAll('.bodypart');
  bodyparts.forEach((x) => x.remove());
}
function clearStatus() {
  statusDisplay.innerHTML = '';
}

/* Init */
initReset();
createKeyboard();
resetGame();

/* below is kek */

function checkGuess(guess) {
  if (word.word.includes(guess)) {
    rightGuesses.push(guess);
  } else {
    wrongGuesses.push(guess);
    wrongGuessesCount += 1;
  }
  displayPartOfBody(wrongGuesses.length);
  updateDisplay();
  checkGameStatus();
}

function createKeyboard() {
  for (let i = 65; i <= 90; i++) {
    const button = document.createElement('button');
    const letter = String.fromCharCode(i);
    button.innerHTML = letter;
    button.classList.add('key');
    button.addEventListener('click', function () {
      button.disabled = true;
      if (word.word.includes(letter)) {
        button.classList.add('correct');
      } else {
        button.classList.add('incorrect');
      }
      checkGuess(letter);
    });
    keyboard.appendChild(button);
  }
}

function checkGameStatus() {
  if (wrongGuesses.length >= maxWrongGuesses) {
    statusDisplay.innerHTML = `You lost! There was a word: ${word.word}`;
    disableKeyboard();
    return;
  }

  const isWinner = word.word
    .split('')
    .every((letter) => rightGuesses.includes(letter));
  if (isWinner) {
    statusDisplay.innerHTML = `Congratulations! You've won!`;
    disableKeyboard();
  }
}

function disableKeyboard() {
  const buttons = keyboard.querySelectorAll('.key');
  for (const button of buttons) {
    button.disabled = true;
  }
}
