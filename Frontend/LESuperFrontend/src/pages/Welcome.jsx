import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import UniversityFooter from '../components/UniversityFooter';
import '../assets/design.css';
import axios from 'axios';

axios.defaults.withCredentials = true; // important for Sanctum cookies


function Welcome() {
  const handleGuestAccess = () => {
    localStorage.setItem('guestMode', 'true');
  };

  return (
    <div className="app-container">
      <AppHeader title="THESIS AND CAPSTONE REPOSITORY" />
      
      <div className="app-body">
        <div className="welcome-options">
          <div className="welcome-buttons">
            <Link to="/login" className="btn btn-primary welcome-btn">Login</Link>
            <Link to="/register" className="btn btn-primary welcome-btn">Register</Link>
            <Link 
              to="/dashboard/guest" 
              className="btn btn-secondary welcome-btn"
              onClick={handleGuestAccess}
            >
              Browse as Guest
            </Link>
          </div>
        </div>
      </div>
      
      <UniversityFooter />
    </div>
  );
}

export default Welcome;