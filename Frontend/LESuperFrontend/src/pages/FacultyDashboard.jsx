import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import axios from '../axiosConfig'; // your custom axios instance

function FacultyDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const navigate = useNavigate();

  // Role check and fetch documents on mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userProfileJSON = localStorage.getItem('userProfile');
    const userProfile = userProfileJSON ? JSON.parse(userProfileJSON) : null;

    if (role !== 'faculty' || !userProfile) {
      navigate('/login');
      return;
    }

    setFaculty(userProfile);

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
  }, [navigate]);

  const handleSearch = (e) => e.preventDefault();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredProjects = projects.filter(project =>
    project.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.Authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.Keywords || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Navigate to project details, passing the project object via state
  const viewProject = (project) => {
    navigate(`/faculty/project/${project.DocumentID}`, { state: { project } });
  };

  // Inline ProjectCard component
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
          onClick={() => viewProject(project)}
          className="btn btn-primary"
          style={{ marginTop: 'auto' }}
        >
          View Project
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <AppHeader title={`Welcome, ${faculty?.FirstName}`} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
          <div className="user-actions">
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        </div>

        <div className="dashboard-content">
          <h2 className="section-title">PROJECTS</h2>

          <div className="faculty-actions">
            <Link to="/manage" className="btn btn-primary">Manage Repository</Link>
          </div>

          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {currentProjects.length > 0 ? (
              currentProjects.map(project => (
                <ProjectCard key={project.DocumentID} project={project} />
              ))
            ) : (
              <p>No projects found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={handlePrevious} disabled={currentPage === 1} className="btn btn-secondary">&lt;</button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn btn-secondary ${currentPage === index + 1 ? 'active-page' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              <button onClick={handleNext} disabled={currentPage === totalPages} className="btn btn-secondary">&gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
