// Using the local storage

export const uploadToStorage = (text) => {
  localStorage.clear();
  localStorage.setItem("codeInput", text);
};

export const loadFromStorage = () => {
  return localStorage.getItem("codeInput");
};

export const uploadStats = (text) => {
  localStorage.removeItem("stats");
  localStorage.setItem("stats", text);
};

export const loadStatsFromStorage = () => {
  return JSON.parse(localStorage.getItem("stats"));
};
