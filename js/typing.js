import { loadFromStorage } from "./storage.js";

// Load text from storage and validate
const text = loadFromStorage();
if (!text || text.trim() === "") {
  alert("Text not found, try again");
  window.location.href = "../index.html";
}

let cursorPosition = 0;

// Load the text into de UI
const renderText = () => {
  const textBefore = text.substring(0, cursorPosition);
  const textAfter = text.substring(cursorPosition);

  document.getElementById("textBefore").innerHTML = textBefore;
  document.getElementById("textAfter").innerHTML = textAfter;
};

// Returns if is the correct character
const checkChar = (char) => {
    return char === text[cursorPosition];
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
    console.log("Changin to black")
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
  cursorPosition++;
  renderText();
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
