import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import '../assets/design.css';
import axios from '../axiosConfig';

axios.defaults.withCredentials = true;

const PROJECTS_PER_PAGE = 8;

const FolderCard = ({ folder, onClick }) => (
  <div
    className="folder"
    onClick={() => onClick(folder)}
    style={{
      flex: '1 1 200px',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    <div style={{ fontSize: '40px', marginBottom: '10px' }}>{folder.icon}</div>
    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{folder.name}</div>
    <div style={{ color: '#6b7280' }}>{folder.count} items</div>
  </div>
);

const ProjectCard = ({ project, onClick }) => (
  <div
    className="project-card"
    onClick={() => onClick(project.id, project.type)}
    style={{
      background: '#fff',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    <h3 style={{ fontSize: '18px', marginBottom: '8px', lineHeight: '1.3', wordWrap: 'break-word' }}>
      {project.title}
    </h3>
    <p
      style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '8px',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <strong>{project.type === 'capstone' ? 'Capstone Project' : 'Thesis'}</strong> | {project.year || project.program}
    </p>
    <p
      style={{
        fontSize: '14px',
        color: '#374151',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      By: {project.authors || project.author}
    </p>
    {project.abstract && (
      <p
        style={{
          fontSize: '13px',
          color: '#4b5563',
          marginTop: '6px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {project.abstract}
      </p>
    )}
  </div>
);

function StudentDashboard() {
  const [activeView, setActiveView] = useState('folders');
  const [currentFolder, setCurrentFolder] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [folderProjects, setFolderProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiData, setApiData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/student/dashboard')
      .then((res) => {
        setApiData(res.data);
        if (res.data.projects) setMyProjects(res.data.projects);
      })
      .catch((err) => console.error('Dashboard fetch error:', err));
  }, []);

  const studentFolders = [
    { id: 1, name: 'Capstone Project', count: apiData?.dashboard_stats?.total_capstones || 0, icon: '📘', type: 'capstone' },
    { id: 2, name: 'Thesis', count: apiData?.dashboard_stats?.total_theses || 0, icon: '📗', type: 'thesis' },
  ];

  const handleFolderClick = async (folder) => {
    setCurrentFolder(folder.type);
    setActiveView('projects');
    setCurrentPage(1);

    try {
      const url = folder.type === 'capstone' ? '/api/student/capstones' : '/api/student/theses';
      const res = await axios.get(`http://127.0.0.1:8000${url}`);
      const dataArray = Array.isArray(res.data) ? res.data : res.data.data || [];

      const normalized = dataArray.map((item) => ({
        id: folder.type === 'capstone' ? item.CapstoneID : item.ThesisID,
        title: item.Title,
        authors: Array.isArray(item.Authors) ? item.Authors.join(', ') : item.Authors || 'Unknown Author',
        year: item.YearPublished,
        type: folder.type,
      }));

      setFolderProjects(normalized);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setFolderProjects([]);
    }
  };

  const handleBackToFolders = () => {
    setActiveView('folders');
    setCurrentFolder('');
    setFolderProjects([]);
  };

  const displayedProjects = currentFolder ? folderProjects : myProjects;
  const filteredProjects = displayedProjects.filter(
    (project) =>
      !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.authors && project.authors.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE);

  const viewProject = async (id, type) => {
    try {
      const url = type === 'capstone' ? `/api/student/capstone/${id}` : `/api/student/thesis/${id}`;
      const res = await axios.get(`http://127.0.0.1:8000${url}`);
      navigate(`/student/project/${type}/${id}`, { state: { project: res.data } });
    } catch (err) {
      console.error('Error fetching project details:', err);
      alert('Failed to load project details.');
    }
  };

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="app-container">
      <AppHeader title={<span style={{ color: '#FFD700' }}>Student Dashboard</span>} />

      <div className="dashboard-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <form onSubmit={(e) => e.preventDefault()} style={{ flex: 1, marginRight: '20px' }}>
            <input
              type="text"
              placeholder="Search your projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </form>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Upload Project
            </Link>
            <Link to="/login" className="btn btn-danger">Logout</Link>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div style={{ marginBottom: '30px', padding: '20px', background: '#f9fafb', borderRadius: '10px' }}>
            <h3>Upload New Project</h3>
            <form>{/* Fields unchanged */}</form>
          </div>
        )}

        {/* Dashboard Content */}
        {apiData && (
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '10px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3>{apiData.student_profile.FirstName} {apiData.student_profile.LastName}</h3>
              <p><strong>Program:</strong> {apiData.student_profile.Program}</p>
              <p><strong>Email:</strong> {apiData.student_profile.Email}</p>
              <p><strong>Created:</strong> {apiData.student_profile.DateCreated}</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 2, justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center', background: '#f1f5f9', padding: '15px', borderRadius: '10px', flex: 1 }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {apiData.dashboard_stats.total_capstones + apiData.dashboard_stats.total_theses}
                </span>
                <div>Total Projects</div>
              </div>
              <div style={{ textAlign: 'center', background: '#f1f5f9', padding: '15px', borderRadius: '10px', flex: 1 }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {apiData.dashboard_stats.total_capstones}
                </span>
                <div>Capstones</div>
              </div>
              <div style={{ textAlign: 'center', background: '#f1f5f9', padding: '15px', borderRadius: '10px', flex: 1 }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6366f1' }}>
                  {apiData.dashboard_stats.total_theses}
                </span>
                <div>Theses</div>
              </div>
            </div>
          </div>
        )}

        {/* Folders or Projects */}
        {activeView === 'folders' ? (
          <>
            <h2>My Folders</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {studentFolders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} onClick={handleFolderClick} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={handleBackToFolders}>← Back</button>
              <span>/</span>
              <strong>{currentFolder === 'capstone' ? 'Capstone Projects' : 'Thesis'}</strong>
            </div>

            <h2>{currentFolder === 'capstone' ? 'My Capstone Projects' : 'My Thesis'}</h2>

            {filteredProjects.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {paginatedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onClick={viewProject} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <h3>No projects found</h3>
                <Link to="/submit-project" className="btn btn-primary" style={{ marginTop: '20px' }}>
                  Upload Your First Project
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-secondary ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="btn btn-secondary" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;