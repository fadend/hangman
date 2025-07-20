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
let correctremaining = 0;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let galphabet = "";
let word = "";
let gameOver = true;
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
  galphabet = ALPHABET;
  tries = 0;
  correctremaining = 0;
  currAnswer = [];
  for (let c of word) {
    if (ALPHABET.indexOf(c) !== -1) {
      currAnswer.push("*");
      correctremaining++;
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
  const alphabetIndex = galphabet.indexOf(currGuess);
  if (alphabetIndex === -1) {
    return;
  } else {
    galphabet =
      galphabet.substring(0, alphabetIndex) +
      galphabet.substring(alphabetIndex + 1, galphabet.length);
  }
  lettersGuessed += currGuess;
  let index = -1; // kludge for a kludged loop
  if (word.indexOf(currGuess) === -1) {
    tries++;
    if (tries === MAX_TRIES) {
      gameOver = true;
    }
  } else {
    while ((index = word.indexOf(currGuess, index + 1)) != -1) {
      currAnswer[index] = currGuess;
      correctremaining--;
    }
    if (correctremaining === 0) {
      gameOver = true;
    }
  }
  redraw();
}

// updates feedback to user
function redraw() {
  alphabetDisplay.textContent = galphabet;
  guessedDisplay.textContent = lettersGuessed;
  livesDisplay.textContent = MAX_TRIES - tries;
  letterGuessInput.focus();
  letterGuessInput.select();
  wordDisplay.textContent = currAnswer.join("");
  if (correctremaining === 0) {
    hangmanDisplay.innerHTML = WIN_MESSAGE;
  } else {
    hangmanDisplay.innerHTML = POOR_DUDE.slice(0, tries).join("");
  }
}

document.getElementById("guess-button").addEventListener("click", guess);
document.getElementById("start-button").addEventListener("click", start);
letterGuessInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    guess();
    event.preventDefault();
    event.stopPropagation();
  }
});

start();
