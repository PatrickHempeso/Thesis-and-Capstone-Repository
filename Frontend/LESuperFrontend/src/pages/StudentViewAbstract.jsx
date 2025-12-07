import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import GuestNotice from '../components/GuestNotice';
import UniversityFooter from '../components/UniversityFooter';
import axios from '../axiosConfig';
import '../assets/design.css';

axios.defaults.withCredentials = true;

function StudentViewAbstract({ guestMode }) {
  const { type, id } = useParams(); // 'capstone' or 'thesis'
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = guestMode
      ? `/api/guest/document/${id}`
      : type === 'capstone'
        ? `/api/student/capstone/${id}`
        : `/api/student/thesis/${id}`;

    axios.get(`http://127.0.0.1:8000${endpoint}`)
      .then((res) => {
        const data = res.data;
        const normalized = {
          id: data.CapstoneID || data.ThesisID,
          Title: data.Title,
          Abstract: data.Abstract,
          Keywords: data.Keywords,
          Authors: Array.isArray(data.Authors) ? data.Authors.join(', ') : data.Authors,
          Adviser: data.Adviser,
          YearPublished: data.YearPublished,
          DocumentID: data.DocumentID
        };
        setProject(normalized);
      })
      .catch((err) => console.error('Error fetching project:', err))
      .finally(() => setLoading(false));
  }, [id, type, guestMode]);

  if (loading) return <div className="app-container"><h3>Loading...</h3></div>;

  if (!project)
    return (
      <div className="app-container">
        <AppHeader title="PROJECT ABSTRACT" />
        <div className="dashboard-content" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3>No project data found.</h3>
          <Link to={guestMode ? '/dashboard/guest' : '/dashboard/student'} className="btn btn-secondary" style={{ padding: '10px 16px', borderRadius: '8px' }}>Back</Link>
        </div>
        <UniversityFooter />
      </div>
    );

  return (
    <div className="app-container">
      <AppHeader title="PROJECT ABSTRACT" />
      <div className="app-body" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {guestMode && <GuestNotice guestMode={guestMode} />}
        <div className="abstract-container" style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px' }}>{project.Title}</h2>
          <div className="abstract-content" style={{ textAlign: 'justify', lineHeight: 1.6 }}>
            <p><strong>Authors:</strong> {project.Authors}</p>
            {project.Adviser && <p><strong>Adviser:</strong> {project.Adviser}</p>}
            <p><strong>Year Published:</strong> {project.YearPublished}</p>
            {project.Keywords && <p><strong>Keywords:</strong> {project.Keywords}</p>}
            <hr style={{ margin: '16px 0' }} />
            <p style={{ fontSize: '16px' }}>{project.Abstract}</p>
          </div>
        </div>
        <div className="back-link" style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to={guestMode ? '/dashboard/guest' : '/dashboard/student'} className="btn btn-secondary" style={{ padding: '10px 16px', borderRadius: '8px', display: 'inline-block' }}>
            Back to Projects
          </Link>
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}

export default StudentViewAbstract;
