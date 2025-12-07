// In your registration form component
import React, { useState } from 'react';

function RegistrationForm() {
    const [userType, setUserType] = useState('student');
    
    return (
        <div className="registration-form">
            <h2>Create Account</h2>
            
            <div className="form-group">
                <label>I am registering as:</label>
                <div className="radio-group">
                    <label className={userType === 'student' ? 'selected' : ''}>
                        <input
                            type="radio"
                            name="userType"
                            value="student"
                            checked={userType === 'student'}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        <span>Student</span>
                    </label>
                    
                    <label className={userType === 'faculty' ? 'selected' : ''}>
                        <input
                            type="radio"
                            name="userType"
                            value="faculty"
                            checked={userType === 'faculty'}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        <span>Faculty</span>
                    </label>
                </div>
            </div>
            
            {/* Rest of your form fields */}
            
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
                <button type="button" className="btn btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
}