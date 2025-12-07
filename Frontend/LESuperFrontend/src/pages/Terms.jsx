import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import axios from 'axios';

axios.defaults.withCredentials = true; // important for Sanctum cookies


function Terms() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing acceptance
    const checkTermsAccepted = () => {
      const cookies = document.cookie.split(';');
      return cookies.some((item) => item.trim().startsWith('termsAccepted='));
    };

    // Redirect if already accepted
    if (checkTermsAccepted()) {
      navigate('/');
    }
  }, [navigate]);

  const handleAccept = () => {
    if (!agreeTerms) {
      alert('Please agree to the Terms and Conditions');
      return;
    }

    // Store acceptance for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `termsAccepted=true; expires=${expiryDate.toUTCString()}; path=/`;
    
    // Also store in localStorage for React access
    localStorage.setItem('termsAccepted', 'true');
    
    // Redirect to welcome
    navigate('/');
  };

  return (
    <div className="app-container">
      <AppHeader title="Thesis/Capstone Repository - MCIIS" />
      
      <div className="terms-container">
        <div className="terms-header">
          <h2>Repository Terms of Use</h2>
          <p>University of Southwestern Philippines</p>
        </div>
        
        <div className="terms-content">
          <p><strong>Welcome to our Thesis/Capstone Repository</strong></p>
          
          <p>This digital repository is designed for the storage and management of theses and capstone projects completed by students of the College of Information and Computation (IoC) at the University of Southwestern Philippines (USAP).</p>
          
          <p><strong>Important Notice:</strong></p>
          <p>All submitted works are governed by the university's academic policies and the Data Privacy Act of 2012. By using this system, you agree to comply with all applicable regulations and guidelines.</p>
          
          <p><strong>Terms and Conditions:</strong></p>
          <ol className="terms-list">
            <li><strong>Original Work:</strong> All submissions must be the original work of the submitting students.</li>
            <li><strong>Faculty Review:</strong> All content is subject to review and approval by faculty members.</li>
            <li><strong>Intellectual Property:</strong> Works remain the intellectual property of their creators while granting the university limited usage rights.</li>
            <li><strong>Data Privacy:</strong> Personal information will be handled in accordance with the Data Privacy Act.</li>
            <li><strong>Authorized Use:</strong> Materials may only be accessed and used for academic purposes.</li>
            <li><strong>System Integrity:</strong> Users must not attempt to compromise the security or functionality of the repository.</li>
          </ol>
          
          <p>By proceeding, you acknowledge that you have read, understood, and agreed to these terms in their entirety.</p>
        </div>
        
        <div className="agreement-controls">
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              id="agreeTerms" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required 
            />
            <label htmlFor="agreeTerms">I have read and agree to the Terms and Conditions above</label>
          </div>
          
          <div className="action-buttons">
            <button 
              id="acceptBtn" 
              className="btn btn-primary" 
              disabled={!agreeTerms}
              onClick={handleAccept}
            >
              Accept & Continue to Repository
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;