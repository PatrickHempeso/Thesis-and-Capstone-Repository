import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import UniversityFooter from '../components/UniversityFooter';
import axios from '../axiosConfig';

function FacultyUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Title: '',
    Authors: '',
    Keywords: '',
    YearPublished: '',
    Abstract: '',
    Document: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Title.trim()) newErrors.Title = 'Title is required';
    if (!formData.Authors.trim()) newErrors.Authors = 'Author(s) are required';
    if (!formData.YearPublished) newErrors.YearPublished = 'Year Published is required';
    if (!formData.Document.trim()) newErrors.Document = 'Please provide a document reference';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        '/api/documents/create',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Document added successfully!');
      navigate('/manage');
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to add document. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <AppHeader title="Upload Document" />

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
        {/* Header with Back + Logout */}
        <div
          className="dashboard-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '600px'
          }}
        >
          <Link to="/manage" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>
            ← Back to Repository
          </Link>
          <button onClick={handleLogout} className="btn btn-logout" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>
            Logout
          </button>
        </div>

        <div className="dashboard-content" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '20px' }}>Add New Document</h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              width: '100%'
            }}
          >
            <input
              type="text"
              name="Title"
              placeholder="Title"
              value={formData.Title}
              onChange={handleChange}
              required
              style={{ fontSize: '1.2rem', padding: '12px', borderRadius: '8px' }}
            />
            <input
              type="text"
              name="Authors"
              placeholder="Authors (comma separated)"
              value={formData.Authors}
              onChange={handleChange}
              required
              style={{ fontSize: '1.2rem', padding: '12px', borderRadius: '8px' }}
            />
            <input
              type="text"
              name="Keywords"
              placeholder="Keywords (comma separated)"
              value={formData.Keywords}
              onChange={handleChange}
              style={{ fontSize: '1.2rem', padding: '12px', borderRadius: '8px' }}
            />
            <input
              type="number"
              name="YearPublished"
              placeholder="Year Published"
              value={formData.YearPublished}
              onChange={handleChange}
              required
              style={{ fontSize: '1.2rem', padding: '12px', borderRadius: '8px' }}
            />
            <textarea
              name="Abstract"
              placeholder="Abstract"
              value={formData.Abstract}
              onChange={handleChange}
              style={{ fontSize: '1.2rem', padding: '12px', borderRadius: '8px', minHeight: '120px' }}
            />
            {/* Document reference text input */}
            <input
              type="text"
              name="Document"
              placeholder="Document reference (e.g., URL or ID)"
              value={formData.Document}
              onChange={handleChange}
              required
              style={{ fontSize: '1.2rem', padding: '12px', borderRadius: '8px' }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontSize: '1.3rem', padding: '14px 0', borderRadius: '8px' }}
            >
              Add Document
            </button>
          </form>
        </div>
      </div>

      <UniversityFooter />
    </div>
  );
}

export default FacultyUpload;
