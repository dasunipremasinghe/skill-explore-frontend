import React from 'react';
import '../CSS/Profile.css';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const name = localStorage.getItem('user_name');
  const email = localStorage.getItem('user_email');
  const picture = localStorage.getItem('user_picture');

  return (
    <div className="profile-container">
      <div className="profile-card">
        {picture && <img src={picture} alt="Profile" className="profile-photo" />}
        <h2 className="profile-name">Welcome, {name}</h2>
        <p className="profile-email">{email}</p>
        <div className="profile-actions">
          <button className="btn">Edit Profile</button>
          <button className="btn btn-secondary">Logout</button>
          <Link to="/explore">
              <button style={{ marginBottom: "1rem" }}>🌐 Explore Other Plans</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
