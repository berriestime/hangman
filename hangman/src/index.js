import './styles/global.scss';

const humanHeads = document.querySelectorAll('.human-head');
const humanBody = document.querySelector('.human-body');
const humanArmLeft = document.querySelector('.human-arm-left');
const humanArmRight = document.querySelector('.human-arm-right');
const humanLegLeft = document.querySelector('.human-leg-left');
const humanLegRight = document.querySelector('.human-leg-right');

let partsDrawn = 1;

function test(partsDrawn) {
  console.log('test!!!');
  if (partsDrawn === 1) {
    humanHeads.forEach((humanHead) => {
      humanHead.classList.remove('hidden');
    });
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

//
const url = './src/questions.json';
let jsonData;
try {
  let response = await fetch(url);

  if (response.ok) {
    // если HTTP-статус в диапазоне 200-299, получаем тело ответа
    jsonData = await response.json();
  } else {
    alert('Error1: ' + response.status);
  }
} catch (error) {
  // обработка ошибок при запросе
  alert('Error2: ' + error);
}
const words = jsonData.map((item) => item.word);
const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
let guesses = [];
let wrongGuesses = [];
const maxWrongGuesses = 6;

const wordDisplay = document.getElementById('word');
const wrongGuessesDisplay = document.getElementById('wrongGuesses');
const statusDisplay = document.getElementById('status');
const keyboard = document.getElementById('keyboard');

function updateDisplay() {
  wordDisplay.innerHTML = word
    .split('')
    .map((letter) => (guesses.includes(letter) ? letter : '_'))
    .join(' ');
  wrongGuessesDisplay.innerHTML = wrongGuesses.join(' ');
}

function checkGuess(guess) {
  if (word.includes(guess)) {
    if (!guesses.includes(guess)) {
      guesses.push(guess);
    }
  } else {
    if (!wrongGuesses.includes(guess)) {
      wrongGuesses.push(guess);
    }
  }
  updateDisplay();
  checkGameStatus();
}

function createKeyboard() {
  const keyboard = document.getElementById('keyboard');
  const russianLetters = [
    'А',
    'Б',
    'В',
    'Г',
    'Д',
    'Е',
    'Ё',
    'Ж',
    'З',
    'И',
    'Й',
    'К',
    'Л',
    'М',
    'Н',
    'О',
    'П',
    'Р',
    'С',
    'Т',
    'У',
    'Ф',
    'Х',
    'Ц',
    'Ч',
    'Ш',
    'Щ',
    'Ъ',
    'Ы',
    'Ь',
    'Э',
    'Ю',
    'Я',
  ];

  russianLetters.forEach((letter) => {
    const button = document.createElement('button');
    button.classList.add('key');
    button.innerHTML = letter;
    button.addEventListener('click', function () {
      button.disabled = true;
      if (word.includes(letter)) {
        button.classList.add('correct');
      } else {
        button.classList.add('incorrect');
        test(partsDrawn);
        partsDrawn += 1;
      }
      checkGuess(letter);
    });
    keyboard.appendChild(button);
  });
}

function checkGameStatus() {
  if (wrongGuesses.length >= maxWrongGuesses) {
    statusDisplay.innerHTML = `Вы проиграли! Было загадано слово: ${word}`;
    disableKeyboard();
    return;
  }

  const isWinner = word.split('').every((letter) => guesses.includes(letter));
  if (isWinner) {
    statusDisplay.innerHTML = 'Поздравляем! Вы выиграли!';
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
