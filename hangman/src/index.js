import './styles/global.scss';
import humanHead from './../assets/human-head.svg';
import humanBody from './../assets/human-body.svg';
import humanArmLeft from './../assets/human-arm-left.svg';
import humanArmRight from './../assets/human-arm-right.svg';
import humanLegLeft from './../assets/human-leg-left.svg';
import humanLegRight from './../assets/human-leg-right.svg';
import gallows from './../assets/gallows.svg';
import jsonData from './questions.json';

let usedIndices = [];

const mainContainer = document.createElement('div');
mainContainer.classList.add('main-container');

const title = document.createElement('h1');
title.classList.add('title');
title.textContent = 'HANGMAN GAME';

const mainContainerPart1 = document.createElement('div');
mainContainerPart1.classList.add('main-container__part');

const gallowsContainer = document.createElement('img');
gallowsContainer.classList.add('gallows-container');
gallowsContainer.src = gallows;
mainContainerPart1.append(gallowsContainer);

mainContainerPart1.append(gallowsContainer);
mainContainerPart1.append(title);

const game = document.createElement('div');
game.id = 'game';

const wordToGuess = document.createElement('p');
wordToGuess.id = 'wordToGuess';
const wordSpan = document.createElement('span');
wordSpan.id = 'word';
wordToGuess.append(wordSpan);

const hint = document.createElement('p');
hint.id = 'wordToGuess';
const hintSpan = document.createElement('span');
hintSpan.id = 'hint';
hint.append(hintSpan);

const guesses = document.createElement('p');
guesses.id = 'guesses';
const guessSpan = document.createElement('span');
guessSpan.id = 'wrongGuesses';
guesses.append(guessSpan);

const keyboard = document.createElement('div');
keyboard.id = 'keyboard';

game.append(wordToGuess);
game.append(hint);
game.append(guesses);
game.append(keyboard);

const mainContainerPart2 = document.createElement('div');
mainContainerPart2.classList.add('main-container__part');
mainContainerPart2.append(game);

mainContainer.append(mainContainerPart1);
mainContainer.append(mainContainerPart2);

document.body.append(mainContainer);

function displayPartOfBody(partsDrawn) {
  const bodyPart = document.createElement('img');
  bodyPart.classList.add('bodypart');
  if (partsDrawn === 1) {
    bodyPart.src = humanHead;
    mainContainerPart1.append(bodyPart);
  } else if (partsDrawn === 2) {
    bodyPart.src = humanBody;
    mainContainerPart1.append(bodyPart);
  } else if (partsDrawn === 3) {
    bodyPart.src = humanArmLeft;
    mainContainerPart1.append(bodyPart);
  } else if (partsDrawn === 4) {
    bodyPart.src = humanArmRight;
    mainContainerPart1.append(bodyPart);
  } else if (partsDrawn === 5) {
    bodyPart.src = humanLegLeft;
    mainContainerPart1.append(bodyPart);
  } else if (partsDrawn === 6) {
    bodyPart.src = humanLegRight;
    mainContainerPart1.append(bodyPart);
  }
}

const maxWrongGuesses = 6;

let word = pickRandom(jsonData);
let rightGuesses = [];
let wrongGuesses = [];
let wrongGuessesCount = 0;

function pickRandom(arr) {
  let index;
  let attempts = 0;

  do {
    index = Math.floor(Math.random() * arr.length);
    attempts++;

    if (attempts > arr.length) {
      console.log(`All the words have been used. Let's start over.`);
      usedIndices = [];
      break;
    }
  } while (usedIndices.includes(index));

  usedIndices.push(index);

  return arr[index];
}

function resetGame() {
  word = pickRandom(jsonData);
  rightGuesses = [];
  wrongGuesses = [];
  wrongGuessesCount = 0;

  clearKeyboard();
  hideBodyParts();
  updateDisplay();
}
function updateDisplay() {
  wordSpan.textContent = word.word
    .split('')
    .map((letter) => (rightGuesses.includes(letter) ? letter : '__'))
    .join(' ');

  hintSpan.textContent = `Hint: ${word.hint}`;
  guessSpan.textContent = `Incorrect guesses: `;

  const wrongGuessesSpan = document.createElement('span');
  wrongGuessesSpan.className = 'wrongGuessesCount';
  wrongGuessesSpan.textContent = `${wrongGuessesCount}/6`;
  guessSpan.append(wrongGuessesSpan);
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

createKeyboard();
resetGame();
console.log(word.word);

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
    button.textContent = letter;
    button.classList.add('key');
    button.setAttribute('data-key', letter.toLowerCase());
    button.addEventListener('click', function () {
      handleKeyboardInput(letter);
    });
    keyboard.append(button);
  }

  document.addEventListener('keydown', function (event) {
    const letter = event.key;
    if (letter.length === 1 && letter.match(/[a-z]/i)) {
      handleKeyboardInput(letter.toUpperCase());
    }
  });
}

function handleKeyboardInput(letter) {
  const button = document.querySelector(
    `button[data-key="${letter.toLowerCase()}"]`,
  );
  if (button && !button.disabled) {
    button.disabled = true;
    if (word.word.includes(letter)) {
      button.classList.add('correct');
    } else {
      button.classList.add('incorrect');
    }
    checkGuess(letter);
  }
}

function disableKeyboard() {
  const buttons = keyboard.querySelectorAll('.key');
  for (const button of buttons) {
    button.disabled = true;
  }
}

function showModal(message) {
  document.body.classList.add('noscroll');
  const modalBackdrop = document.createElement('div');
  modalBackdrop.classList.add('backdrop');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalText = document.createElement('p');
  modalText.textContent = message;

  const closeButton = document.createElement('button');

  closeButton.id = 'reset';
  closeButton.textContent = 'Start new game';
  closeButton.onclick = function () {
    document.body.removeChild(modalBackdrop);
    document.body.classList.remove('noscroll');
    resetGame();
    console.log(word.word);
  };
  modalContent.append(modalText);
  modalContent.append(closeButton);
  modalBackdrop.append(modalContent);
  document.body.append(modalBackdrop);
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
    showModal(`Congratulations! You've won! There was a word: ${word.word}`);
    disableKeyboard();
  }
}
