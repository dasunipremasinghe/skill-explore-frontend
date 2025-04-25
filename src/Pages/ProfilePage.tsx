import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('user_name');
  const email = localStorage.getItem('user_email');
  const picture = localStorage.getItem('user_picture');

  return (
    <div className="profile-container">
      <div className="profile-card">
        //{picture && <img src={picture} alt="Profile" className="profile-photo" />}
        <h2 className="profile-name">Welcome, {name}</h2>
        <p className="profile-email">{email}</p>
        <div className="profile-actions">
          <button className="btn">Edit Profile</button>
          <button className="btn btn-secondary">Logout</button>
          <button className="btn btn-upload" onClick={() => navigate('/upload')}>
            Upload Media
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
