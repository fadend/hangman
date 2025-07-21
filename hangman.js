const hangmanDisplay = document.getElementById("hangman");
const livesDisplay = document.getElementById("lives");
const guessedDisplay = document.getElementById("guessed");
const wordDisplay = document.getElementById("wordbox");
const alphabetDisplay = document.getElementById("alphabet");
const letterGuessInput = document.getElementById("letterguess");
const LINE_ENDING = "\n";
// hangman figure
const POOR_DUDE = [
  "    !" + LINE_ENDING,
  "    O" + LINE_ENDING,
  "   /",
  "|",
  "\\" + LINE_ENDING,
  "    |" + LINE_ENDING,
  "   / ",
  "\\" + LINE_ENDING + "  HANG!",
];
const MAX_TRIES = POOR_DUDE.length;
//words to hang by
const WORDS = [
  "DEOXYRIBONUCLEIC ACID",
  "ORCHESTRA",
  "ENCYCLOPEDIA",
  "ONOMATOPOEIA",
  "CAESURA",
  "NUCLEAR EXPLOSION",
  "SOMETHING WICKED",
  "VACUUM CLEANER",
  "NERVOUS TWITCH",
  "BROKEN VINYL",
  "POLICE BRIGADE",
  "ATTORNEY",
  "SPECIAL PERSON",
  "GIANT PANDA",
  "GREEN BEAN",
  "CASSEROLE DISH",
  "RHINOCEROUS",
  "TEDDY BEAR",
  "SMELLY FLOWER",
  "PEOPLE'S PUPILS",
  "GYMNASIUM",
  "ANGIOSPERM",
  "SPACE SHUTTLE",
  "SPATULA",
  "NOTEBOOK",
  "MEDIOCRE",
  "BLACK KNIGHT",
  "STARRY NIGHT",
  "UNCONVENTIONAL",
  "RUSTY HELMET",
];
let currAnswer;
//tries tried
let tries = 0;
let lettersGuessed = "";
let correctRemaining = 0;
const ALPHABET = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
let remainingAlphabet = new Set(ALPHABET);
let word = "";
let gameOver = true;
let charToIndexes = new Map();
const WIN_MESSAGE =
  "YOU SAVED" +
  LINE_ENDING +
  "HIM...." +
  LINE_ENDING +
  "THIS TIME..." +
  LINE_ENDING +
  " HA HA HA";

function start() {
  lettersGuessed = "";
  word = WORDS[parseInt(WORDS.length * Math.random())];
  remainingAlphabet = new Set(ALPHABET);
  tries = 0;
  correctRemaining = 0;
  currAnswer = [];
  charToIndexes = new Map();
  for (let i in word) {
    const c = word[i];
    if (ALPHABET.has(c)) {
      currAnswer.push("*");
      correctRemaining++;
      const indexes = charToIndexes.get(c) || [];
      indexes.push(i);
      charToIndexes.set(c, indexes);
    } else {
      currAnswer.push(c);
    }
  }
  // clear display
  gameOver = false;
  letterGuessInput.value = "";
  redraw();
}
function guess() {
  if (gameOver) {
    return;
  }
  let currGuess = letterGuessInput.value.toUpperCase();
  if (!currGuess) {
    return;
  }
  // not a valid guess...definitely should give annoying message
  if (!remainingAlphabet.has(currGuess)) {
    return;
  }
  remainingAlphabet.delete(currGuess);
  lettersGuessed += currGuess;
  const indexes = charToIndexes.get(currGuess);
  if (!indexes) {
    tries++;
    if (tries === MAX_TRIES) {
      gameOver = true;
    }
  } else {
    for (let i of indexes) {
      currAnswer[i] = currGuess;
      correctRemaining--;
    }
    if (correctRemaining === 0) {
      gameOver = true;
    }
  }
}

// updates feedback to user
function redraw() {
  alphabetDisplay.textContent = [...remainingAlphabet].join("");
  guessedDisplay.textContent = lettersGuessed;
  livesDisplay.textContent = MAX_TRIES - tries;
  letterGuessInput.focus();
  letterGuessInput.select();
  wordDisplay.textContent = currAnswer.join("");
  if (correctRemaining === 0) {
    hangmanDisplay.innerHTML = WIN_MESSAGE;
  } else {
    hangmanDisplay.innerHTML = POOR_DUDE.slice(0, tries).join("");
  }
}

function guessAndRedraw() {
  guess();
  redraw();
}

document
  .getElementById("guess-button")
  .addEventListener("click", guessAndRedraw);
document.getElementById("start-button").addEventListener("click", start);
letterGuessInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    guessAndRedraw();
    event.preventDefault();
    event.stopPropagation();
  }
});

start();
