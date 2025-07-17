const hangmanDisplay = document.getElementById("hangman");
const livesDisplay = document.getElementById("lives");
const guessedDisplay = document.getElementById("guessed");
const wordDisplay = document.getElementById("wordbox");
const alphabetDisplay = document.getElementById("alphabet");
const letterguess = document.getElementById("letterguess");
var LINE_ENDING = "\n";
var agt = navigator.userAgent.toLowerCase();
if (agt.indexOf("win") != -1) LINE_ENDING = "\r\n";
else if (agt.indexOf("sun") != -1) LINE_ENDING = "\n";
else if (agt.indexOf("mac") != -1) LINE_ENDING = "\r";
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
var curranswer;
//tries tried
var tries = 0;
var lettersguessed = "";
var correctremaining = 0;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var galphabet = "";
var word = "";
var gameover = true;
const WIN_MESSAGE =
  "YOU SAVED" +
  LINE_ENDING +
  "HIM...." +
  LINE_ENDING +
  "THIS TIME..." +
  LINE_ENDING +
  " HA HA HA";

function start() {
  lettersguessed = "";
  word = WORDS[parseInt(WORDS.length * Math.random())];
  galphabet = ALPHABET;
  tries = 0;
  correctremaining = 0;
  curranswer = [];
  for (let c of word) {
    if (ALPHABET.indexOf(c) !== -1) {
      curranswer.push("*");
      correctremaining++;
    } else {
      curranswer.push(c);
    }
  }
  // clear display
  gameover = false;
  letterguess.value = "";
  redraw();
}
function guess() {
  if (gameover) {
    return;
  }
  var currguess = letterguess.value.toUpperCase();
  if (!currguess) {
    return;
  }
  // not a valid guess...definitely should give annoying message
  const alphabetIndex = galphabet.indexOf(currguess);
  if (alphabetIndex === -1) {
    return;
  } else {
    galphabet =
      galphabet.substring(0, alphabetIndex) +
      galphabet.substring(alphabetIndex + 1, galphabet.length);
  }
  lettersguessed += currguess;
  var index = -1; // kludge for a kludged loop
  if (word.indexOf(currguess) === -1) {
    tries++;
    if (tries === MAX_TRIES) {
      gameover = true;
    }
  } else {
    while ((index = word.indexOf(currguess, index + 1)) != -1) {
      curranswer[index] = currguess;
      correctremaining--;
    }
    if (correctremaining === 0) {
      gameover = true;
    }
  }
  redraw();
}

// updates feedback to user
function redraw() {
  alphabetDisplay.textContent = galphabet;
  guessedDisplay.textContent = lettersguessed;
  livesDisplay.textContent = MAX_TRIES - tries;
  letterguess.focus();
  letterguess.select();
  wordDisplay.textContent = curranswer.join("");
  if (correctremaining === 0) {
    hangmanDisplay.innerHTML = WIN_MESSAGE;
  } else {
    hangmanDisplay.innerHTML = POOR_DUDE.slice(0, tries).join("");
  }
}

document.getElementById("guess-button").addEventListener("click", guess);
document.getElementById("start-button").addEventListener("click", start);
letterguess.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    guess();
    event.preventDefault();
    event.stopPropagation();
  }
});

start();
