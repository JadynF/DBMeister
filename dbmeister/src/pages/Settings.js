import React, { useState } from 'react';
import './Settings.css';  // Create a CSS file for custom styling

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');

  const handleLogout = () => {
    // Clear storage or token
    localStorage.removeItem('authToken');  // Adjust for your use case
    alert('You have been logged out.');
    window.location.href = '/login';  // Adjust to your route
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
    document.body.style.fontSize = event.target.value;
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Logout Button */}
      <button className="button logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Account Management Section */}
      <h2>Account Management</h2>
      <button className="button account-button" onClick={() => alert('Change Password functionality coming soon!')}>
        Change Password
      </button>
      <button className="button account-button" onClick={() => alert('Change Name functionality coming soon!')}>
        Change Name
      </button>
      <button className="button account-button" onClick={() => alert('Admin Access management coming soon!')}>
        Manage Admin Access
      </button>

      {/* Site Customization Section */}
      <h2>Site Customization</h2>
      <button className="button customization-button" onClick={toggleDarkMode}>
        Toggle Dark/Light Mode
      </button>
      <label htmlFor="fontSizeSelector">Font Size:</label>
      <select id="fontSizeSelector" value={fontSize} onChange={handleFontSizeChange}>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  );
};

export default Settings;
