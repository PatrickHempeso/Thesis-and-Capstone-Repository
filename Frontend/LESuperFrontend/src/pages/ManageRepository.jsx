import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import axios from '../axiosConfig'; // your custom axios instance

function ManageRepository() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const navigate = useNavigate();

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/faculty/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const normalized = (response.data.documents || []).map(doc => ({
          DocumentID: doc.DocumentID,
          Title: doc.Title,
          Keywords: doc.Keywords,
          Authors: doc.Authors,
          YearPublished: doc.YearPublished,
          Abstract: doc.Abstract
        }));

        setProjects(normalized);
      } catch (error) {
        console.error('Error fetching documents:', error);
        alert('Failed to fetch documents. Please try again.');
      }
    };

    fetchDocuments();
  }, []);

  const removeProject = (documentID) => {
    if (window.confirm("Are you sure you want to remove this project?")) {
      setProjects(prev => prev.filter(project => project.DocumentID !== documentID));
      const newTotalPages = Math.ceil((projects.length - 1) / projectsPerPage);
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < Math.ceil(projects.length / projectsPerPage) && setCurrentPage(currentPage + 1);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const ProjectCard = ({ project }) => {
    const abstractSnippet = project.Abstract
      ? project.Abstract.split(' ').slice(0, 15).join(' ') + '...'
      : '';

    return (
      <div
        style={{
          background: '#fff',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{project.Title}</h3>
        <p><strong>Keywords:</strong> {project.Keywords}</p>
        <p><strong>Authors:</strong> {project.Authors}</p>
        <p><strong>Year Published:</strong> {project.YearPublished}</p>
        {abstractSnippet && <p style={{ color: '#555' }}>{abstractSnippet}</p>}

        <button
          onClick={() => removeProject(project.DocumentID)}
          className="btn btn-primary"
          style={{ marginTop: 'auto' }}
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* AppHeader with yellow font */}
      <AppHeader 
        title="Manage Repository" 
        style={{ color: 'yellow' }} 
      />

      <div className="dashboard-container">
        {/* Header with Back + Upload on left and Logout on right */}
        <div
          className="dashboard-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/dashboard/faculty" className="btn btn-secondary">← Dashboard</Link>
            <Link to="/manage/upload" className="btn btn-secondary">Upload Project</Link>
          </div>

          <div>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        </div>

        <div className="dashboard-content">
          <h2 className="section-title">Existing Projects</h2>

          <div
            className="projects-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}
          >
            {currentProjects.length > 0 ? (
              currentProjects.map(project => (
                <ProjectCard key={project.DocumentID} project={project} />
              ))
            ) : (
              <p>No projects found.</p>
            )}
          </div>

          {Math.ceil(projects.length / projectsPerPage) > 1 && (
            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={handlePrevious} disabled={currentPage === 1} className="btn btn-secondary">&lt;</button>
              {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn btn-secondary ${currentPage === index + 1 ? 'active-page' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              <button onClick={handleNext} disabled={currentPage === Math.ceil(projects.length / projectsPerPage)} className="btn btn-secondary">&gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageRepository;
