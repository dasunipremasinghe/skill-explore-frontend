import React from 'react';
import '../CSS/Profile.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* You can add profile photo support later if needed */}
        <h2 className="profile-name">Welcome, {user?.name || "Guest"}</h2>
        <p className="profile-email">{user?.email}</p>
        <div className="profile-actions">
          <button className="btn">Edit Profile</button>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
          <Link to="/explore">
            <button style={{ marginBottom: "1rem" }}>🌐 Explore Other Plans</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
