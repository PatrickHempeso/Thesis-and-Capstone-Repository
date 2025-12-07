import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import UniversityFooter from '../components/UniversityFooter';
import axios from 'axios';

axios.defaults.withCredentials = true; // important for Sanctum cookies


function Register() {
  return (
    <div className="app-container">
      <AppHeader title="REGISTER ACCOUNT" />
      
      <div className="app-body">
        <div className="registration-options">
          <h2>Select Account Type</h2>
          <div className="option-cards">
            <div className="option-card">
              <div className="option-icon">🎓</div>
              <h3>Student</h3>
              <p>Register as a student to view your theses and capstone projects.</p>
              <Link to="/register/student" className="btn btn-primary">Register as Student</Link>
            </div>
            
            <div className="option-card">
              <div className="option-icon">👨‍🏫</div>
              <h3>Faculty</h3>
              <p>Register as faculty to view and manage the repository.</p>
              <Link to="/register/faculty" className="btn btn-primary">Register as Faculty</Link>
            </div>
          </div>
          
          <div className="already-have-account">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
      
      <UniversityFooter />
    </div>
  );
}

export default Register;