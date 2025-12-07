import React from 'react';
import { Link } from 'react-router-dom';

function GuestNotice({ guestMode }) {
  if (!guestMode) return null;

  return (
    <div
      className="guest-notice"
      style={{
        textAlign: 'center',
        margin: '20px 0',
        padding: '16px 20px',
        backgroundColor: '#fff3b0', // light yellow
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'inline-block',
      }}
    >
      <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '500' }}>
        You are browsing as a guest
      </p>
      <Link
        to="/login"
        className="btn btn-small"
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          backgroundColor: '#8B0000',  
          color: 'white',
          textDecoration: 'none',
          fontWeight: '500',
          display: 'inline-block',
        }}
      >
        Login to Access More Features
      </Link>
    </div>
  );
}

export default GuestNotice;
