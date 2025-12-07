import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import GuestNotice from '../components/GuestNotice';
import SearchFilter from '../components/SearchFilter';
import ProjectCard from '../components/ProjectCard';
import UniversityFooter from '../components/UniversityFooter';
import axios from 'axios';

axios.defaults.withCredentials = true; // important for Sanctum cookies

function ProjectRepository({ guestMode }) {
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);

  const handleSearchFilter = (filters) => {
    let filtered = sampleProjects;
    
    if (filters.searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.author.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    if (filters.program !== 'All Programs') {
      filtered = filtered.filter(project => project.program === filters.program);
    }
    
    setFilteredProjects(filtered);
  };

  return (
    <div className="app-container">
      <AppHeader title="PROJECT REPOSITORY" />
      
      <div className="app-body">
        <GuestNotice guestMode={guestMode} />
        
        <SearchFilter onFilterChange={handleSearchFilter} />
        
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} guestMode={guestMode} />
          ))}
        </div>
        
        <div className="back-link">
          {guestMode ? (
            <Link to="/dashboard/guest" className="btn btn-secondary">
              Back to Guest Dashboard
            </Link>
          ) : (
            <Link to="/dashboard/faculty" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          )}
        </div>
      </div>
      
      <UniversityFooter />
    </div>
  );
}

export default ProjectRepository;