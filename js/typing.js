import { loadFromStorage } from "./storage.js";

const text = loadFromStorage();
let cursor = 0;
console.log(text.length)

// Load text from storage and validate
if (!text || text.trim() === "") {
  alert("Text not found, try again");
  window.location.href = "../index.html";
}

// Stats element
const stats = {
  totalCharacters: text.length,
  errors: 0,
  correctCharacters: 0,
  startTime: null,
  currentWPM: 0,
  
  startTimer() {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
  },
  
  calculateWPM() {
    if (!this.startTime) return 0;
    
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // minutes
    const wordsTyped = this.correctCharacters / 5; // standard: 5 characters = 1 word
    this.currentWPM = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    return this.currentWPM;
  },
  
  addError() {
    this.errors++;
  },
  
  addCorrectChar() {
    this.correctCharacters++;
  }
}

// Load the stats into de UI
const renderStats = () => {
  const errorsElement = document.getElementById('errorsCount');
  const wpmElement = document.getElementById('wpmCount');
  
  if (errorsElement) {
    errorsElement.textContent = stats.errors;
  }
  
  if (wpmElement) {
    wpmElement.textContent = stats.calculateWPM();
  }
}

// Load the text into de UI
const renderText = () => {
  const textBefore = text.substring(0, cursor);
  const textAfter = text.substring(cursor);

  // Use textContent to preserve formatting and prevent XSS
  document.getElementById("textBefore").textContent = textBefore;
  document.getElementById("textAfter").textContent = textAfter;
};

// Returns if is the correct character
const checkChar = (char) => {
    // Handle Enter key as line break
    if (char === 'Enter') {
        return text[cursor] === '\n';
    }
    return char === text[cursor];
}

// Go to the finished page
const finish = () =>{
  window.location.href = './finished.html';
}

// Errors management
const error = () => {
    changeBgColor(false);
    stats.addError();
    renderStats();
}

const changeBgColor = (succeed) => {
  const divText = document.getElementById('divText');
  if (succeed) {
    divText.classList.remove('bg-red-900');
    divText.classList.add('bg-black');
  } else {
    divText.classList.remove('bg-black');
    divText.classList.add('bg-red-900');
  }
};

// Succeed management
const succeed = () => {
  changeBgColor(true);
  stats.addCorrectChar();
  cursor++;
  renderText();
  renderStats();
  
  // Finished the text
  if (cursor === text.length){
    console.log('Win')
    finish();
  }
}

// Keyboard management 
document.addEventListener("keydown", (event) => {
  const char = event.key;
  console.log('key pressed: ' + char)

  // Start timer on first keystroke
  stats.startTimer();

  // Handle Enter key specifically
  if (char === 'Enter') {
    if (checkChar(char)) {
      succeed();
    } else {
      error();
    }
    return;
  }

  // Ignore other special keys like Shift, Control, etc.
  if (char.length !== 1) return;

  if (checkChar(char)) {
    succeed();
  } else {
    error();
  }
});


// Render all
renderText();
renderStats();
changeBgColor(true);

// Update stats every second for real-time WPM calculation
setInterval(() => {
  if (stats.startTime) {
    renderStats();
  }
}, 1000);
