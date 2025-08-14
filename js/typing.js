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
stats = {
  totalCharacters: text.length,
  errors: 0,
  cps: '-',
  seconds: 0,
  uploadStats() {
    if (this.startingDate) {
      
    }
  }
}

// Load the stats into de UI
const renderStats = () => {
  
}

// Load the text into de UI
const renderText = () => {
  const textBefore = text.substring(0, cursor);
  const textAfter = text.substring(cursor);

  document.getElementById("textBefore").innerHTML = textBefore;
  document.getElementById("textAfter").innerHTML = textAfter;
};

// Returns if is the correct character
const checkChar = (char) => {
    return char === text[cursor];
}

// Go to the finished page
const finish = () =>{
  window.location.href = './finished.html';
}

// Errors management
let errors = 0;
const errorsCount = document.getElementById('errorsCount');

const error = () => {
    changeBgColor(false);
    errors++;
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

const renderErrors = () => errorsCount.innerHTML = errors;

// Succeed management
const succeed = () => {
  changeBgColor(true);
  cursor++;
  renderText();
  
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

  // Ignore special keys like Shift, Control, etc.
  if (char.length !== 1) return;

  if (checkChar(char)) {
    succeed();
  } else {
    error();
    renderErrors();
  }
});


// Render all
renderText();
renderErrors();
changeBgColor(true);
