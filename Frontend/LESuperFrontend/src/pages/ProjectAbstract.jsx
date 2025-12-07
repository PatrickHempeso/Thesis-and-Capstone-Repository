import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import GuestNotice from '../components/GuestNotice';
import UniversityFooter from '../components/UniversityFooter';
import axios from '../axiosConfig';

axios.defaults.withCredentials = true;

function ProjectAbstract({ guestMode }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/guest/document/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error("Error fetching project:", err));
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <AppHeader title="PROJECT ABSTRACT" />

      <div className="app-body">
        {guestMode && <GuestNotice guestMode={guestMode} />}

        <div className="abstract-container">
          <h2>{project.Title}</h2>
          <div className="abstract-content">
            <p><strong>Author:</strong> {project.Authors}</p>
            <p><strong>Date:</strong> {project.YearPublished}</p>
            <hr />
            <p>{project.Abstract}</p>
          </div>

          <div className="document-actions" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          </div>
        </div>

        <div className="back-link" style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link
            to={guestMode ? "/dashboard/guest" : "/dashboard/faculty"} // <-- updated to FacultyDashboard
            className="btn btn-secondary"
            style={{ padding: '10px 16px', borderRadius: '8px', display: 'inline-block' }}
          >
            Back to Projects
          </Link>
        </div>
      </div>

      <UniversityFooter />
    </div>
  );
}

export default ProjectAbstract;
