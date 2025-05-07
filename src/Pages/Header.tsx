import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Header.css";

interface User {
  id: string | number;
  name?: string;
  avatar?: string;
}

interface HeaderProps {
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-left" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <h1 className="header-title">SkillExplorer</h1>
      </div>

      <nav className="header-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/skill-updates" className="nav-link">Skill Updates</Link>
        <Link to="/profile" className="nav-link">Profile</Link> {/* ✅ Profile Link */}
      </nav>

      <div className="header-right">
        {currentUser && (
          <div className="user-info">
            {currentUser.avatar && (
              <img src={currentUser.avatar} alt="Avatar" className="avatar" />
            )}
            <span className="user-name">{currentUser.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
