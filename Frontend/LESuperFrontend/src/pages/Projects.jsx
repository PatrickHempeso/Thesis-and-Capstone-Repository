import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import axios from 'axios';

axios.defaults.withCredentials = true; // important for Sanctum cookies

function Projects() {
  const [projects, setProjects] = useState([
    { id: 1, title: "BSIT-BTM 1", type: "Undergraduate - BSIT-BTM", author: "John Doe", date: "2023-05-15" },
    { id: 2, title: "BSIT-BTM 2", type: "Undergraduate - BSIT-BTM", author: "Jane Smith", date: "2023-06-20" },
    { id: 3, title: "MIT 1", type: "Postgraduate - MIT", author: "Robert Johnson", date: "2023-04-10" },
    { id: 4, title: "BSIT-IS 1", type: "Undergraduate - BSIT-IS", author: "Maria Garcia", date: "2023-07-05" },
    { id: 5, title: "BSCS 1", type: "Undergraduate - BSCS", author: "David Lee", date: "2023-03-22" },
    { id: 6, title: "MLIS 1", type: "Postgraduate - MLIS", author: "Sarah Williams", date: "2023-08-12" },
    { id: 7, title: "DIT 1", type: "Postgraduate - DIT", author: "Michael Brown", date: "2023-09-01" }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('a-z');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const navigate = useNavigate();

  // Initialize projects on component mount
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Filter and sort projects when search term or sort option changes
  useEffect(() => {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'a-z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'author-a':
        filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'author-z':
        filtered.sort((a, b) => b.author.localeCompare(a.author));
        break;
      default:
        break;
    }
    
    setFilteredProjects(filtered);
  }, [searchTerm, sortBy, projects]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const viewProject = (id) => {
    // In a real app, this would open the project details
    alert(`Viewing project ${id}`);
    // navigate(`/abstract/${id}`);
  };

  const downloadProject = (id) => {
    // In a real app, this would initiate download
    alert(`Downloading project ${id}`);
  };

  // Get recently viewed projects (first 3 for demo)
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="app-container">
      <AppHeader title="Welcome, Faculty" />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search..." 
              id="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
          <div className="user-actions">
            <Link to="/dashboard/faculty" className="btn btn-secondary">← Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="sort-options">
            <label>SORT BY:</label>
            <select 
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="date">Date</option>
              <option value="degree">Degree Level</option>
              <option value="author-a">Author A-Z</option>
              <option value="author-z">Author Z-A</option>
              <option value="program">Program</option>
            </select>
          </div>
          
          <h2 className="section-title">CAPSTONE PROJECTS</h2>
          
          <div className="recent-projects">
            <h3 className="subsection-title">RECENTLY OPENED</h3>
            <div className="project-tags">
              {recentProjects.map(project => (
                <span 
                  key={project.id} 
                  className="project-tag"
                  onClick={() => viewProject(project.id)}
                >
                  {project.title}
                </span>
              ))}
            </div>
          </div>
          
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-badge">PDF</div>
                <h3>{project.title}</h3>
                <p>{project.type}</p>
                <p className="author">By: {project.author}</p>
                <div className="action-buttons">
                  <button 
                    className="btn btn-view" 
                    onClick={() => viewProject(project.id)}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-download" 
                    onClick={() => downloadProject(project.id)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination">
            <span>Page 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;