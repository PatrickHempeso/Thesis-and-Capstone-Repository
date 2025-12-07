import React, { useState, useEffect } from 'react';
import AppHeader from '../components/AppHeader';
import '../assets/design.css';
import axios from '../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

function GuestDashboard() {
  const navigate = useNavigate(); // added to navigate to ProjectAbstract page
  const [programFilter, setProgramFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/dashboard/guest")
      .then((res) => {
        const mapped = res.data.documents.map((doc) => ({
          id: doc.DocumentID, // <-- use DocumentID from your table
          title: doc.Title,
          author: doc.Authors,
          keywords: doc.Keywords,
          date: doc.YearPublished,
        }));
        setProjects(mapped);
      })
      .catch((err) => console.error("Error fetching guest documents:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('guestMode', 'true');
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, programFilter]);

  const resetFilters = () => {
    setProgramFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const viewProject = (id) => {
    // Navigate to ProjectAbstract page instead of fetching inline
    navigate(`/abstract/${id}`);
  };

  const projectsPerPage = 6;

  const filteredProjects = projects.filter(project => {
    const matchesProgram = programFilter === 'all' || project.program === programFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.keywords.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProgram && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="app-container">
      <AppHeader title="Guest Access" />

      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .project-card {
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.25);
          background-color: inherit;
        }
        .project-badge { font-size: 22px; }
        .project-card h3 { margin: 0; font-size: 18px; }
        .project-card p { margin: 0; font-size: 14px; line-height: 1.4; }
        .project-excerpt { margin-top: 6px; font-size: 13px; line-height: 1.4; }
        .actions { margin-top: 8px; }
        .btn-view { padding: 6px 10px; border-radius: 6px; cursor: pointer; margin-top: 8px; }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <div className="user-actions">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/" className="btn btn-secondary">Back</Link>
            <Link to="/register" className="btn btn-success">Register</Link>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="view-only-notice">
            <p>
              You are browsing as a guest.
              <span style={{ color: 'white' }}> Login or Register to access all features.</span>
            </p>
          </div>

          <div className="guest-actions">
            <button className="btn btn-secondary" onClick={resetFilters}>Reset Filters</button>
          </div>

          <div className="projects-grid">
            {paginatedProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-badge">📄</div>
                <h3>{project.title}</h3>
                <p className="author">By: {project.author}</p>
                <p className="date">Published: {project.date}</p>
                <div className="project-excerpt">
                  <strong>Keywords:</strong> {project.keywords}
                </div>
                <div className="actions">
                  <button className="btn-view" onClick={() => viewProject(project.id)}>
                    View Abstract
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className="btn btn-secondary" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-secondary" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestDashboard;
