import { loadFromStorage, uploadStats } from "./storage.js";

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
  endTime: null,
  currentWPM: 0,
  currentCPS: 0,
  
  startTimer() {
    if (!this.startTime) {
      this.startTime = Date.now();
      console.log('Timer started at:', new Date(this.startTime));
    }
  },
  
  finishTimer() {
    this.endTime = Date.now();
    console.log('Timer finished at:', new Date(this.endTime));
  },
  
  getTotalTimeSeconds() {
    if (!this.startTime || !this.endTime) return 0;
    return (this.endTime - this.startTime) / 1000;
  },
  
  getTotalTimeFormatted() {
    const totalSeconds = this.getTotalTimeSeconds();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },
  
  calculateWPM() {
    if (!this.startTime) return 0;
    
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // minutes
    const wordsTyped = this.correctCharacters / 5; // standard: 5 characters = 1 word
    this.currentWPM = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    return this.currentWPM;
  },
  
  calculateCPS() {
    if (!this.startTime) return 0;
    
    const timeElapsed = (Date.now() - this.startTime) / 1000; // seconds
    this.currentCPS = timeElapsed > 0 ? Math.round(this.correctCharacters / timeElapsed) : 0;
    return this.currentCPS;
  },
  
  addError() {
    this.errors++;
  },
  
  addCorrectChar() {
    this.correctCharacters++;
  },
  
  saveToStorage() {
    const statsData = {
      totalCharacters: this.totalCharacters,
      errors: this.errors,
      correctCharacters: this.correctCharacters,
      totalTimeSeconds: this.getTotalTimeSeconds(),
      totalTimeFormatted: this.getTotalTimeFormatted(),
      finalWPM: this.calculateWPM(),
      finalCPS: this.calculateCPS(),
      accuracy: this.totalCharacters > 0 ? Math.round((this.correctCharacters / this.totalCharacters) * 100) : 0
    };
    
    console.log('Saving stats to storage:', statsData);
    uploadStats(JSON.stringify(statsData));
  }
}

// Load the stats into de UI
const renderStats = () => {
  const errorsElement = document.getElementById('errorsCount');
  const wpmElement = document.getElementById('wpmCount');
  const progressElement = document.getElementById('progressCount');
  const accuracyElement = document.getElementById('accuracyCount');
  
  if (errorsElement) {
    errorsElement.textContent = stats.errors;
  }
  
  if (wpmElement) {
    wpmElement.textContent = stats.calculateWPM();
  }
  
  if (progressElement) {
    progressElement.textContent = `${cursor}/${stats.totalCharacters}`;
  }
  
  if (accuracyElement) {
    const totalTyped = stats.correctCharacters + stats.errors;
    const accuracy = totalTyped > 0 ? Math.round((stats.correctCharacters / totalTyped) * 100) : 100;
    accuracyElement.textContent = `${accuracy}%`;
  }
  
  // Log current stats for debugging
  console.log(`Stats - WPM: ${stats.calculateWPM()}, CPS: ${stats.calculateCPS()}, Errors: ${stats.errors}, Progress: ${cursor}/${stats.totalCharacters}`);
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
const finish = () => {
  stats.finishTimer();
  stats.saveToStorage();
  console.log('Practice finished! Redirecting to results page...');
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

// Update stats every 500ms for smooth real-time updates
setInterval(() => {
  if (stats.startTime && cursor < stats.totalCharacters) {
    renderStats();
  }
}, 500);
