// Using the local storage 

export const uploadToStorage = (text) => {
  localStorage.clear();
  localStorage.setItem('codeInput', text);
};

export const loadFromStorage = () => {
  return localStorage.getItem('codeInput');
};
