import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import axios from 'axios';

axios.defaults.withCredentials = true; // important for Sanctum cookies


function StudentRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    program: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Validate student ID
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'University email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate program
    if (!formData.program) {
      newErrors.program = 'Please select your program';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 number';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send the data to your backend here
      console.log('Registration data:', formData);
      
      // Store user data (in a real app, this would be handled by backend)
      const userData = {
        fullName: formData.fullName,
        studentId: formData.studentId,
        email: formData.email,
        program: formData.program,
        role: 'student'
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      alert('Registration successful! Please login with your new account');
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      <AppHeader title="STUDENT REGISTRATION" />
      
      <div className="app-body">
        <form className="registration-form" onSubmit={handleSubmit}>
          <h2>Create Student Account</h2>
          
          <div className="form-group">
            <label htmlFor="student-fullname">Full Name</label>
            <input 
              type="text" 
              id="student-fullname"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name" 
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="student-id">Student ID Number</label>
            <input 
              type="text" 
              id="student-id"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter your student ID" 
              className={errors.studentId ? 'error' : ''}
            />
            {errors.studentId && <span className="error-message">{errors.studentId}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="student-email">University Email</label>
            <input 
              type="email" 
              id="student-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your university email" 
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="student-program">Program</label>
            <select 
              id="student-program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className={errors.program ? 'error' : ''}
              required
              style={{ color: 'black' }}
            >
              <option value="">Select your program</option>
              <option value="BSIT-IS">BSIT-IS</option>
              <option value="BSIT-BTM">BSIT-BTM</option>
              <option value="BSCS">BSCS</option>
              <option value="BLIS">BLIS</option>
              <option value="MIT">MIT</option>
              <option value="MLIS">MLIS</option>  
              <option value="DIT">DIT</option>                                                                      
            </select>
            {errors.program && <span className="error-message">{errors.program}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="student-password">Create Password</label>
            <input 
              type="password" 
              id="student-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password" 
              className={errors.password ? 'error' : ''}
            />
            <div className="password-hint">Minimum 8 characters with at least 1 number</div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="student-confirm-password">Confirm Password</label>
            <input 
              type="password" 
              id="student-confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password" 
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <div className="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="student-terms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={errors.agreeTerms ? 'error' : ''}
            />
            <label htmlFor="student-terms">
              I agree to the <Link to="/terms">Terms of Service</Link>
            </label>
            {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Register</button>
            <Link to="/register" className="btn btn-secondary">Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentRegistration;