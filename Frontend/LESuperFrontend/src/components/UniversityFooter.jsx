import React, { useState, useEffect } from 'react';

function UniversityFooter() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    applyDarkMode(isDarkMode);
  }, []);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyDarkMode(newDarkMode);
  };

  return (
    <div className="university-footer">
      <div className="university-name">UNIVERSITY OF SOUTHEASTERN PHILIPPINES</div>
      <div className="university-tagline">We build dreams without limits</div>
      <div className="footer-links">
        <a href="https://www.usep.edu.ph" target="_blank" rel="noopener noreferrer">CONTACT US</a>
        <a href="https://www.usep.edu.ph" target="_blank" rel="noopener noreferrer">UNIVERSITY</a>
        <a href="https://www.usep.edu.ph" target="_blank" rel="noopener noreferrer">TECHNICAL SUPPORT</a>
        <a href="https://www.usep.edu.ph" target="_blank" rel="noopener noreferrer">Mindanao eLearning Space</a>
      </div>
      <div className="copyright">2025 University of Southeastern Philippines. All Rights Reserved.</div>
      <button id="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Mode' : 'Toggle Dark Mode'}
      </button>
    </div>
  );
}

export default UniversityFooter;