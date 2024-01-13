import './styles/global.scss';
import humanHead from './../assets/human-head.svg';
import humanBody from './../assets/human-body.svg';
import humanArmLeft from './../assets/human-arm-left.svg';
import humanArmRight from './../assets/human-arm-right.svg';
import humanLegLeft from './../assets/human-leg-left.svg';
import humanLegRight from './../assets/human-leg-right.svg';

// Create main container div
const mainContainer = document.createElement('div');
mainContainer.classList.add('main-container');

// Create gallows container
const gallowsContainer = document.createElement('div');
gallowsContainer.classList.add('gallows-container');
gallowsContainer.innerHTML = `
      <svg id="gallows-svg" width="500" height="581" viewBox="0 0 500 581" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="211.337" y="34.6662" width="39" height="199.598" transform="rotate(45 211.337 34.6662)" fill="black" stroke="#FFFEFE" stroke-width="3"/>
        <rect x="69.5" y="1.5" width="39" height="578" rx="3.5" fill="black" stroke="#FFFEFE" stroke-width="3"/>
        <rect x="386.5" y="34.5" width="39" height="350" rx="3.5" transform="rotate(90 386.5 34.5)" fill="black" stroke="#FFFEFE" stroke-width="3"/>
        <rect x="498.5" y="540.5" width="39" height="497" rx="3.5" transform="rotate(90 498.5 540.5)" fill="black" stroke="#FFFEFE" stroke-width="3"/>
        <rect x="333" y="75" width="10" height="74" fill="black"/>
      </svg>
    `;

// Create title
const title = document.createElement('h1');
title.classList.add('title');
title.textContent = 'HANGMAN GAME';

// Append gallows and title to the main container part
const mainContainerPart1 = document.createElement('div');
mainContainerPart1.classList.add('main-container__part');
mainContainerPart1.appendChild(gallowsContainer);
mainContainerPart1.appendChild(title);

// Create game div
const game = document.createElement('div');
game.id = 'game';

// Create word to guess paragraph
const wordToGuess = document.createElement('p');
wordToGuess.id = 'wordToGuess';
wordToGuess.innerHTML = '<span id="word"></span>';

// Create hint paragraph
const hint = document.createElement('p');
hint.id = 'wordToGuess';
hint.innerHTML = '<span id="hint"></span>';

// Create guesses paragraph
const guesses = document.createElement('p');
guesses.id = 'guesses';
guesses.innerHTML = '<span id="wrongGuesses"></span>';

// Create status paragraph
const statusDisplay = document.createElement('p');
statusDisplay.id = 'status';

// Create keyboard div
const keyboard = document.createElement('div');
keyboard.id = 'keyboard';

// Append game elements to the game div
game.appendChild(wordToGuess);
game.appendChild(hint);
game.appendChild(guesses);
game.appendChild(statusDisplay);
game.appendChild(keyboard);

// Append game to the main container part
const mainContainerPart2 = document.createElement('div');
mainContainerPart2.classList.add('main-container__part');
mainContainerPart2.appendChild(game);

// Append both parts to the main container
mainContainer.appendChild(mainContainerPart1);
mainContainer.appendChild(mainContainerPart2);

// Append the main container to the body
document.body.appendChild(mainContainer);

const gallows = document.querySelector('.gallows-container');

function displayPartOfBody(partsDrawn) {
  const bodyPart = document.createElement('img');
  bodyPart.classList.add('bodypart');
  if (partsDrawn === 1) {
    bodyPart.src = humanHead;
    gallows.appendChild(bodyPart);
  } else if (partsDrawn === 2) {
    bodyPart.src = humanBody;
    gallows.appendChild(bodyPart);
  } else if (partsDrawn === 3) {
    bodyPart.src = humanArmLeft;
    gallows.appendChild(bodyPart);
  } else if (partsDrawn === 4) {
    bodyPart.src = humanArmRight;
    gallows.appendChild(bodyPart);
  } else if (partsDrawn === 5) {
    bodyPart.src = humanLegLeft;
    gallows.appendChild(bodyPart);
  } else if (partsDrawn === 6) {
    bodyPart.src = humanLegRight;
    gallows.appendChild(bodyPart);
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

/* Game Constants */

const maxWrongGuesses = 6;

const wordDisplay = document.querySelector('#word');
const hintDisplay = document.querySelector('#hint');
const wrongGuessesDisplay = document.querySelector('#wrongGuesses');

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

createKeyboard();
resetGame();

/* below is just functions */

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

function disableKeyboard() {
  const buttons = keyboard.querySelectorAll('.key');
  for (const button of buttons) {
    button.disabled = true;
  }
}

// Modal
function showModal(message) {
  // Создаем фоновый элемент для модального окна
  const modalBackdrop = document.createElement('div');
  modalBackdrop.style.position = 'fixed';
  modalBackdrop.style.left = '0';
  modalBackdrop.style.top = '0';
  modalBackdrop.style.width = '100%';
  modalBackdrop.style.height = '100%';
  modalBackdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalBackdrop.style.display = 'flex';
  modalBackdrop.style.justifyContent = 'center';
  modalBackdrop.style.alignItems = 'center';
  modalBackdrop.style.zIndex = '1000';

  // Создаем контейнер для содержимого модального окна
  const modalContent = document.createElement('div');
  modalContent.style.background = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '5px';
  modalContent.style.textAlign = 'center';

  // Создаем элемент текста для сообщения
  const modalText = document.createElement('p');
  modalText.textContent = message;

  // Создаем кнопку для закрытия модального окна
  const closeButton = document.createElement('button');
  closeButton.id = 'reset';
  closeButton.textContent = 'Start new game';
  closeButton.onclick = function () {
    // Удаляем модальное окно при нажатии
    document.body.removeChild(modalBackdrop);
    resetGame();
  };

  // Добавляем текст и кнопку в контейнер содержимого
  modalContent.appendChild(modalText);
  modalContent.appendChild(closeButton);

  // Добавляем контейнер содержимого в фоновый элемент
  modalBackdrop.appendChild(modalContent);

  // Добавляем модальное окно в body
  document.body.appendChild(modalBackdrop);
}

function checkGameStatus() {
  if (wrongGuesses.length >= maxWrongGuesses) {
    showModal(`You lost! There was a word: ${word.word}`);
    disableKeyboard();
    return;
  }

  const isWinner = word.word
    .split('')
    .every((letter) => rightGuesses.includes(letter));
  if (isWinner) {
    showModal(`Congratulations! You've won!`);
    disableKeyboard();
  }
}
