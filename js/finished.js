import { loadStatsFromStorage } from './storage.js';

// Load and display the final statistics
document.addEventListener('DOMContentLoaded', () => {
  const statsData = loadStatsFromStorage();
  
  console.log('Loaded stats from storage:', statsData);
  
  if (!statsData) {
    console.error('No stats found in storage');
    // Set default values
    document.getElementById('finalChars').textContent = '0';
    document.getElementById('finalCPS').textContent = '0';
    document.getElementById('finalErrors').textContent = '0';
    document.getElementById('finalTime').textContent = '00:00';
    return;
  }
  
  // Display the statistics
  document.getElementById('finalChars').textContent = statsData.totalCharacters || 0;
  document.getElementById('finalCPS').textContent = statsData.finalCPS || 0;
  document.getElementById('finalErrors').textContent = statsData.errors || 0;
  document.getElementById('finalTime').textContent = statsData.totalTimeFormatted || '00:00';
  
  // Add some additional stats if elements exist
  const wpmElement = document.getElementById('finalWPM');
  const accuracyElement = document.getElementById('finalAccuracy');
  
  if (wpmElement) {
    wpmElement.textContent = statsData.finalWPM || 0;
  }
  
  if (accuracyElement) {
    accuracyElement.textContent = (statsData.accuracy || 0) + '%';
  }
  
  console.log('Final stats displayed successfully');
});