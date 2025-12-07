import React from 'react';
import logo from '../assets/logo.png'; // Make sure to add your logo to src/assets

function AppHeader({ title = "THESIS AND CAPSTONE REPOSITORY" }) {
  return (
    <div className="app-header">
      <div className="logo">
        <img src={logo} alt="University Logo" />
      </div>
      <h1 style={{ color: 'white' }}>{title}</h1>
    </div>
  );
}

export default AppHeader;