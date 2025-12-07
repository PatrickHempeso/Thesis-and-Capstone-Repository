import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentRegistration from './pages/StudentRegistration';
import FacultyRegistration from './pages/FacultyRegistration';
import Terms from './pages/Terms';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import GuestDashboard from './pages/GuestDashboard';
import ProjectRepository from './pages/ProjectRepository';
import ProjectAbstract from './pages/ProjectAbstract';
import ManageRepository from './pages/ManageRepository';
import FacultyUpload from './pages/FacultyUpload';
import Projects from './pages/Projects';
import SubmitProject from './pages/SubmitProject';
import StudentViewAbstract from './pages/StudentViewAbstract'; // <-- updated import
import './assets/design.css';

// Guest mode hook
function useGuestMode() {
  const [guestMode, setGuestMode] = React.useState(false);

  React.useEffect(() => {
    const isGuest = localStorage.getItem('guestMode') === 'true';
    setGuestMode(isGuest);
  }, []);

  const setGuestModeStatus = (isGuest) => {
    if (isGuest) {
      localStorage.setItem('guestMode', 'true');
    } else {
      localStorage.removeItem('guestMode');
    }
    setGuestMode(isGuest);
  };

  return { guestMode, setGuestMode: setGuestModeStatus };
}

// Wrappers
function GuestDashboardWrapper() {
  const { guestMode } = useGuestMode();
  return <GuestDashboard guestMode={guestMode} />;
}

function ProjectRepositoryWrapper() {
  const { guestMode } = useGuestMode();
  return <ProjectRepository guestMode={guestMode} />;
}

function ProjectAbstractWrapper() {
  const { guestMode } = useGuestMode();
  return <ProjectAbstract guestMode={guestMode} />;
}

function WelcomeWrapper() {
  const { setGuestMode } = useGuestMode();
  return <Welcome setGuestMode={setGuestMode} />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeWrapper />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/student" element={<StudentRegistration />} />
          <Route path="/register/faculty" element={<FacultyRegistration />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
          <Route path="/dashboard/guest" element={<GuestDashboardWrapper />} />
          
          {/* Project detail routes */}
          <Route path="/faculty/project/:id" element={<ProjectAbstract />} />
          <Route path="/student/project/:type/:id" element={<StudentViewAbstract />} /> {/* <-- updated route */}
          <Route path="/projects" element={<ProjectRepositoryWrapper />} />
          <Route path="/abstract/:id" element={<ProjectAbstractWrapper />} />
          <Route path="/manage" element={<ManageRepository />} />
          <Route path="/manage/upload" element={<FacultyUpload />} />
          <Route path="/projects/view" element={<Projects />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
