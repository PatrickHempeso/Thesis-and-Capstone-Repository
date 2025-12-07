import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import UniversityFooter from '../components/UniversityFooter';
import axios from 'axios';

axios.defaults.withCredentials = true;

function SubmitProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    program: '',
    abstract: '',
    document: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.authors.trim()) newErrors.authors = 'Author(s) are required';
    if (!formData.program) newErrors.program = 'Please select a program';
    if (!formData.document.trim()) newErrors.document = 'Please provide a document reference';

    const wordCount = formData.abstract.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 200) newErrors.abstract = `Abstract must be at least 200 words (currently ${wordCount})`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Project submitted:', formData);
      alert('Project submitted successfully!');
      navigate('/dashboard/student');
    }
  };

  const wordCount = formData.abstract.split(/\s+/).filter(w => w.length > 0).length;
  const isAbstractValid = wordCount >= 200;

  return (
    <div className="app-container">
      <AppHeader title="SUBMIT CAPSTONE PROJECT" />

      <div
        className="dashboard-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          gap: '30px'
        }}
      >
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/dashboard/student" className="btn btn-secondary">← Back to Dashboard</Link>
        </div>

        <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h2 className="section-title">Submit Your Project</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              style={{ fontSize: '1.2rem', padding: '10px' }}
              required
            />

            <input
              type="text"
              name="authors"
              placeholder="Author(s) (comma separated)"
              value={formData.authors}
              onChange={handleChange}
              className={errors.authors ? 'error' : ''}
              style={{ fontSize: '1.2rem', padding: '10px' }}
              required
            />

            <select
              name="program"
              value={formData.program}
              onChange={handleChange}
              className={errors.program ? 'error' : ''}
              style={{ fontSize: '1.2rem', padding: '10px' }}
              required
            >
              <option value="">Select Program</option>
              <option value="BSIT-IS">BSIT-IS</option>
              <option value="BSIT-BTM">BSIT-BTM</option>
              <option value="BSCS">BSCS</option>
              <option value="BLIS">BLIS</option>
              <option value="MIT">MIT</option>
              <option value="DIT">DIT</option>
            </select>

            <textarea
              name="abstract"
              placeholder="Project Abstract (minimum 200 words)"
              value={formData.abstract}
              onChange={handleChange}
              rows="10"
              className={errors.abstract ? 'error' : ''}
              style={{ fontSize: '1.1rem', padding: '10px' }}
            />
            <div className={`word-count ${isAbstractValid ? 'adequate' : 'low'}`}>
              Word count: {wordCount} {!isAbstractValid && `(Need ${200 - wordCount} more words)`}
            </div>

            {/* Replacing file picker with text input */}
            <input
              type="text"
              name="document"
              placeholder="Document reference (e.g., URL or document ID)"
              value={formData.document}
              onChange={handleChange}
              className={errors.document ? 'error' : ''}
              style={{ fontSize: '1.1rem', padding: '10px' }}
              required
            />

            <button type="submit" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '10px' }}>
              Submit Project
            </button>
            <Link to="/dashboard/student" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '10px' }}>
              Cancel
            </Link>
          </form>
        </div>
      </div>

      <UniversityFooter />
    </div>
  );
}

export default SubmitProject;
