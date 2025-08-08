// This file manages the form validations 

import { uploadToStorage } from './storage.js';

const form = document.codeForm;
const textField = form.codeInput;
const btnSubmit = form.btnSubmit;

const textIsValid = (text) => {
  return text.trim() !== "";
};

const getText = () => {
  return textField.value;
};

const checkBtnSubmit = () => {
  btnSubmit.disabled = !textIsValid(getText());
};

const goTyping = () => {
  uploadToStorage(getText());
  window.location.href = './html/typing.html';
};

textField.addEventListener('keyup', checkBtnSubmit);
form.addEventListener('submit', (e) => {
    e.preventDefault();
    goTyping();
});

btnSubmit.disabled = true;
