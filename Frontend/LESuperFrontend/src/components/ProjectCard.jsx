import React from 'react';
import { Link } from 'react-router-dom';

function ProjectCard({ project, showFacultyActions = false, guestMode = false }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { text: '✅ Approved', class: 'status-approved' },
      'under-review': { text: '🕒 Under Review', class: 'status-pending' },
      'draft': { text: '✏️ Draft', class: 'status-draft' },
      'rejected': { text: '❌ Needs Revision', class: 'status-rejected' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <div className="project-card">
      <div className="project-badge">📄</div>
      <h3>{project.title}</h3>
      <p>{project.program} {project.type}</p>
      <p className="author">By: {project.author}</p>
      <p className="date">Submitted: {project.date}</p>
      
      {showFacultyActions && (
        <div className="project-status">
          {getStatusBadge(project.status)}
        </div>
      )}
      
      <div className="project-excerpt">
        {project.excerpt}
      </div>
      
      <div className="actions">
        <Link 
          to={`/abstract/${project.id}`} 
          className="btn btn-view"
        >
          View Abstract
        </Link>
        
        {showFacultyActions && (
          <>
            <button className="btn btn-approve">Approve</button>
            <button className="btn btn-reject">Request Revision</button>
          </>
        )}
        
        {!guestMode && !showFacultyActions && (
          <button className="btn btn-download">Download</button>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;