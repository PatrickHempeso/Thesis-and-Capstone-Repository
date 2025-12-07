import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import UniversityFooter from '../components/UniversityFooter';
import axios from 'axios';

axios.defaults.withCredentials = true; // important for Sanctum cookies

function FacultyRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    position: '',
    facultyId: '',
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

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'University email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate department
    if (!formData.department) {
      newErrors.department = 'Please select your department';
    }

    // Validate position
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    // Validate faculty ID
    if (!formData.facultyId.trim()) {
      newErrors.facultyId = 'Faculty ID is required';
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
      newErrors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send the data to your backend here
      console.log('Faculty registration data:', formData);
      
      // Store faculty data (in a real app, this would be handled by backend)
      const facultyData = {
        fullName: formData.fullName,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        facultyId: formData.facultyId,
        role: 'faculty'
      };
      localStorage.setItem('userData', JSON.stringify(facultyData));
      
      alert('Registration successful! Please login with your new account');
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      <AppHeader title="FACULTY REGISTRATION" />
      
      <div className="app-body">
        <form className="registration-form" onSubmit={handleSubmit}>
          <h2>Create Faculty Account</h2>
          
          <div className="form-group">
            <label htmlFor="faculty-fullname">Full Name</label>
            <input 
              type="text" 
              id="faculty-fullname"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name" 
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="faculty-email">University Email</label>
            <input 
              type="email" 
              id="faculty-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your university email" 
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="faculty-department">Department</label>
            <select 
              id="faculty-department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'error' : ''}
              required
              style={{ color: 'black' }}
            >
              <option value="">Select your department</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Library Science">Library Science</option>
              <option value="Information Technology">Information Technology</option>
            </select>
            {errors.department && <span className="error-message">{errors.department}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="faculty-position">Position</label>
            <input 
              type="text" 
              id="faculty-position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="E.g. Professor, Assistant Professor" 
              className={errors.position ? 'error' : ''}
            />
            {errors.position && <span className="error-message">{errors.position}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="faculty-id">Faculty ID Number</label>
            <input 
              type="text" 
              id="faculty-id"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              placeholder="Enter your faculty ID" 
              className={errors.facultyId ? 'error' : ''}
            />
            {errors.facultyId && <span className="error-message">{errors.facultyId}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="faculty-password">Create Password</label>
            <input 
              type="password" 
              id="faculty-password"
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
            <label htmlFor="faculty-confirm-password">Confirm Password</label>
            <input 
              type="password" 
              id="faculty-confirm-password"
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
              id="faculty-terms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={errors.agreeTerms ? 'error' : ''}
            />
            <label htmlFor="faculty-terms">
              I agree to the <Link to="/terms">Terms of Service</Link> and <a href="#privacy">Privacy Policy</a>
            </label>
            {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Register</button>
            <Link to="/register" className="btn btn-secondary">Back</Link>
          </div>
        </form>
      </div>
      
      <UniversityFooter />
    </div>
  );
}

export default FacultyRegistration;