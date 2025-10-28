// This file manages the form validations 

import { uploadToStorage } from './storage.js';

const form = document.codeForm;
const textField = form.codeInput;
const btnSubmit = form.btnSubmit;

const textIsValid = (text) => {
  return text && text.trim() !== "";
};

const getText = () => {
  return textField.value;
};

const checkBtnSubmit = () => {
  const isValid = textIsValid(getText());
  btnSubmit.disabled = !isValid;
  
  // Debug: log the state
  console.log('Text length:', getText().length);
  console.log('Is valid:', isValid);
  console.log('Button disabled:', btnSubmit.disabled);
};

const goTyping = () => {
  const text = getText();
  console.log('Uploading text to storage:', text.substring(0, 50) + '...');
  uploadToStorage(text);
  window.location.href = './html/typing.html';
};

// Add event listeners
textField.addEventListener('input', checkBtnSubmit);
textField.addEventListener('keyup', checkBtnSubmit);
textField.addEventListener('paste', () => {
  // Small delay to allow paste to complete
  setTimeout(checkBtnSubmit, 10);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    if (textIsValid(getText())) {
      goTyping();
    } else {
      alert('Please enter some text to practice with.');
    }
});

// Initial state
btnSubmit.disabled = true;
checkBtnSubmit(); // Check initial state

// Backup: Force enable button if text exists after 1 second
setTimeout(() => {
  if (getText().trim() !== "" && btnSubmit.disabled) {
    console.log('Force enabling button...');
    btnSubmit.disabled = false;
  }
}, 1000);
