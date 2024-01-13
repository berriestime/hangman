import './styles/global.scss';
// import humanHead from './../assets/human-head.svg';

const humanHead = document.querySelectorAll('.human-head');
const humanBody = document.querySelector('.human-body');
const humanArmLeft = document.querySelector('.human-arm-left');
const humanArmRight = document.querySelector('.human-arm-right');
const humanLegLeft = document.querySelector('.human-leg-left');
const humanLegRight = document.querySelector('.human-leg-right');
// const gallows = document.querySelector('.gallows-container');

let partsDrawn = 1;

function displayPartOfBody(partsDrawn) {
  if (partsDrawn === 1) {
    humanHead.forEach((humanHead) => {
      humanHead.classList.remove('hidden');
    });
    // gallows.appendChild(humanHead);
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
const word = jsonData[Math.floor(Math.random() * jsonData.length)];
let rightGuesses = [];
let wrongGuesses = [];
let wrongGuessesCount = 0;
const maxWrongGuesses = 6;

const wordDisplay = document.querySelector('#word');
const hintDisplay = document.querySelector('#hint');
const wrongGuessesDisplay = document.querySelector('#wrongGuesses');
const statusDisplay = document.querySelector('#status');
const keyboard = document.querySelector('#keyboard');

function updateDisplay() {
  wordDisplay.innerHTML = word.word
    .split('')
    .map((letter) => (rightGuesses.includes(letter) ? letter : '__'))
    .join(' ');

  hintDisplay.innerHTML = `Hint: ${word.hint}`;
  wrongGuessesDisplay.innerHTML = `${wrongGuessesCount}/6`;
}

function checkGuess(guess) {
  if (word.word.includes(guess)) {
    rightGuesses.push(guess);
  } else {
    wrongGuesses.push(guess);
    wrongGuessesCount += 1;
  }
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
        displayPartOfBody(partsDrawn);
        partsDrawn += 1;
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
  const buttons = keyboard.getElementsByTagName('button');
  for (const button of buttons) {
    button.disabled = true;
  }
}

createKeyboard();
updateDisplay();
