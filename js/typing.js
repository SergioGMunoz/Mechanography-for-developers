import { loadFromStorage } from "./storage.js";

// Load text from storage and validate
const text = loadFromStorage();
if (!text || text.trim() === "") {
  alert("Text not found, try again");
  window.location.href = "../index.html";
}

const cursorPosition = 0;

// Load the text into de UI
const renderText = () => {
  const textBefore = text.substring(0, cursorPosition);
  const textAfter = text.substring(cursorPosition);

  document.getElementById("textBefore").innerHTML = textBefore;
  document.getElementById("textAfter").innerHTML = textAfter;
  changeBgColor();
};

// Returns if is the correct character
const checkChar = (char) => {
    return char === text[cursor];
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
    divText.classList.remove('bg-black');
    divText.classList.add('bg-red-900');
  } else {
    divText.classList.remove('bg-red-900');
    divText.classList.add('bg-black');
  }
};

const renderErrors = () => errorsCount.innerHTML = errors;


// Render all
renderText();
renderErrors();
changeBgColor(false);
