// hangman figure
const POOR_DUDE = [
  "    !\n",
  "    O\n",
  "   /",
  "|",
  "\\\n",
  "    |\n",
  "   / ",
  "\\\n  HANG!",
];

const WIN_MESSAGE =
  "YOU SAVED\n" + "HIM....\n" + "THIS TIME...\n" + " HA HA HA";

const MAX_TRIES = POOR_DUDE.length;
// words to hang by
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

const ALPHABET = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

class HangmanGame {
  constructor(parentElem, optWord) {
    this.hangmanDisplay = parentElem.querySelector(".hangman");
    this.livesDisplay = parentElem.querySelector(".lives");
    this.guessedDisplay = parentElem.querySelector(".guessed");
    this.wordDisplay = parentElem.querySelector(".word-box");
    this.alphabetDisplay = parentElem.querySelector(".alphabet");
    this.letterGuessInput = parentElem.querySelector(".letter-guess");
    this.tries = 0;
    this.currAnswer = null;
    this.lettersGuessed = "";
    this.correctRemaining = 0;

    this.remainingAlphabet = new Set(ALPHABET);
    this.word = "";
    this.gameOver = true;
    this.charToIndexes = new Map();

    parentElem
      .querySelector(".guess-button")
      .addEventListener("click", () => this.guessAndRedraw());
    parentElem
      .querySelector(".start-button")
      .addEventListener("click", () => this.start());
    this.letterGuessInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.guessAndRedraw();
        event.preventDefault();
        event.stopPropagation();
      }
    });

    // Call start to finish initialization.
    this.start(optWord);
  }

  start(optWord) {
    this.lettersGuessed = "";
    if (optWord) {
      this.word = optWord;
    } else {
      this.word = WORDS[parseInt(WORDS.length * Math.random())];
    }
    this.remainingAlphabet = new Set(ALPHABET);
    this.tries = 0;
    this.correctRemaining = 0;
    this.currAnswer = [];
    this.charToIndexes = new Map();
    for (let i in this.word) {
      const c = this.word[i];
      if (ALPHABET.has(c)) {
        this.currAnswer.push("*");
        this.correctRemaining++;
        const indexes = this.charToIndexes.get(c) || [];
        indexes.push(i);
        this.charToIndexes.set(c, indexes);
      } else {
        this.currAnswer.push(c);
      }
    }
    // clear display
    this.gameOver = false;
    this.letterGuessInput.value = "";
    this.redraw();
  }

  guess() {
    if (this.gameOver) {
      return;
    }
    let currGuess = this.letterGuessInput.value.toUpperCase();
    if (!currGuess) {
      return;
    }
    if (!this.remainingAlphabet.has(currGuess)) {
      return;
    }
    this.remainingAlphabet.delete(currGuess);
    this.lettersGuessed += currGuess;
    const indexes = this.charToIndexes.get(currGuess);
    if (!indexes) {
      this.tries++;
      if (this.tries === MAX_TRIES) {
        this.gameOver = true;
      }
    } else {
      for (let i of indexes) {
        this.currAnswer[i] = currGuess;
        this.correctRemaining--;
      }
      if (this.correctRemaining === 0) {
        this.gameOver = true;
      }
    }
  }

  // updates feedback to user
  redraw() {
    this.alphabetDisplay.textContent = [...this.remainingAlphabet].join("");
    this.guessedDisplay.textContent = this.lettersGuessed;
    this.livesDisplay.textContent = MAX_TRIES - this.tries;
    this.letterGuessInput.focus();
    this.letterGuessInput.select();
    this.wordDisplay.textContent = this.currAnswer.join("");
    if (this.correctRemaining === 0) {
      this.hangmanDisplay.innerHTML = WIN_MESSAGE;
    } else {
      this.hangmanDisplay.innerHTML = POOR_DUDE.slice(0, this.tries).join("");
    }
  }

  guessAndRedraw() {
    this.guess();
    this.redraw();
  }
}

// Support for generating a new game.

const baseUrl = location.href.replace(/\?.*/, "");
const newWordInput = document.getElementById("new-word");
const newGameLink = document.getElementById("game-link");

function show(elem) {
  elem.style.display = "";
}

document
  .getElementById("make-your-own-button")
  .addEventListener("click", function () {
    show(document.getElementById("game-maker-area"));
    newWordInput.focus();
    newWordInput.select();
  });

const A_CODE = "A".charCodeAt(0);

// Generate pseudorandom numbers using the Xorshift method.
class XorshiftRng {
  constructor() {
    this.y = 1;
  }
  next() {
    // The constants and update step come from Marsaglia's 2003 paper
    // "Xorshift RNGs"
    // https://www.jstatsoft.org/article/view/v008i14.
    // The first of each has somewhat arbitrarily been selected.
    this.y ^= this.y << 1;
    this.y ^= this.y >> 3;
    this.y ^= this.y << 10;
    return this.y;
  }
}

function positiveMod(x, modulus) {
  let result = x % modulus;
  if (result < 0) {
    return modulus + result;
  }
  return result;
}

function encodeLetter(x, shift) {
  x = x.toUpperCase();
  if (x < "A" || x > "Z") {
    return x;
  }
  const codeOffset = x.charCodeAt(0) - A_CODE;
  const newOffset = positiveMod(codeOffset + shift, 26);
  return String.fromCharCode(newOffset + A_CODE);
}

// With sign=-1, this will decode.
function encodeString(s, sign) {
  sign = sign || 1;
  const parts = [];
  const rng = new XorshiftRng();
  for (let c of s) {
    // Note: this is purposely including 0 shifts. Otherwise,
    // looking at the encoded string would tell you what's *not*
    // at each position.
    const shift = sign * positiveMod(rng.next(), 26);
    parts.push(encodeLetter(c, shift));
  }
  return parts.join("");
}

function extractWordFromQueryString(searchString) {
  if (!searchString) {
    return "";
  }
  const params = new URLSearchParams(searchString);
  const word = params.get("w");
  if (word) {
    // Decode rot13. Kept for backward compatibility.
    return [...word].map((c) => encodeLetter(c, -13)).join("");
  }
  const phrase = params.get("p");
  if (phrase) {
    return encodeString(phrase, -1);
  }
  return "";
}

newWordInput.addEventListener("keyup", function () {
  newGameLink.href =
    baseUrl +
    "?" +
    new URLSearchParams({ p: encodeString(newWordInput.value) }).toString();
  show(newGameLink);
});

// Hook it all up.

new HangmanGame(document.body, extractWordFromQueryString(location.search));
