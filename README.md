# Hangman Game

Welcome to the Hangman game repository! This is a digital adaptation of the classic word guessing game. Challenge yourself to guess the word before your hangman drawing is completed!

## Table of Contents

- [General Info](#general-info)
- [Technologies](#technologies)
- [Features](#features)
- [Screenshots](#screenshots)
- [Code Examples](#code-examples)
- [Status](#status)
- [Contact](#contact)

## General Info

This project was developed as part of the programming curriculum at RSS School. The goal was to create a responsive and interactive Hangman game that can be played on desktop, tablet, and mobile devices.

## Technologies

- HTML5
- CSS
- JavaScript
- Vite
- Midjourney

## Features

- Adaptive design that ensures the game is playable on devices with various screen widths:
  - Desktop: 1440px and above
  - Tablet: Between 768px and 1440px
  - Mobile: Between 360px and 768px
- Dynamic HTML generation using JavaScript to create game elements.
- Random selection of question-answer pairs at the start and end of each game, with a minimum of 10 pairs available.
- Full retention of game functionality across devices, with no content being cut off or inaccessible.

## Screenshots

![desktop](https://github.com/berriestime/hangman/assets/47135626/38adadf8-93fd-480b-a01f-f77a68a9f101)
![mobile](https://github.com/berriestime/hangman/assets/47135626/3e1a71c9-5c39-4d88-92d3-dafc220f7ae7)

## Code Examples

To generate game elements dynamically in JavaScript, you might use a function similar to this:
```
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
```
