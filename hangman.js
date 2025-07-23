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

const WIN_MESSAGE =
  "YOU SAVED" +
  LINE_ENDING +
  "HIM...." +
  LINE_ENDING +
  "THIS TIME..." +
  LINE_ENDING +
  " HA HA HA";

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

const ALPHABET = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

class HangmanGame {
  constructor(parentElem) {
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
    this.start();
  }

  start() {
    this.lettersGuessed = "";
    this.word = WORDS[parseInt(WORDS.length * Math.random())];
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

new HangmanGame(document.body);
