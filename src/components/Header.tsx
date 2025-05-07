import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import NotificationPanel from "./NotificationPanel";
import "../css/Header.css";
import { NotificationsNoneOutlined } from "@mui/icons-material";

interface User {
  id: string | number;
  name?: string;
  avatar?: string;
}

interface HeaderProps {
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const toggleNotificationPanel = (): void => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <h1>Skill-explore</h1>
        </div>
      </div>

      <nav className="main-nav">
        <ul>
          <li className="nav-item">
            <i className="fas fa-users"></i>
            <span>Comment Section</span>
          </li>
        </ul>
      </nav>

      <div className="header-right">
        <div className="notification-container">
          <button
            className="notification-button"
            onClick={toggleNotificationPanel}
          >
            <NotificationsNoneOutlined className="fas fa-bell" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          <NotificationPanel
            isOpen={isNotificationPanelOpen}
            onClose={() => setIsNotificationPanelOpen(false)}
          />
        </div>

        <div className="user-menu">
          <div className="user-avatar">
            <img src={currentUser?.avatar || "/default-avatar.png"} alt={currentUser?.name || 'User'} />
          </div>
          <span className="user-name">{currentUser?.name || "Guest"}</span>
          <i className="fas fa-caret-down"></i>

          <div className="user-dropdown">
            <ul>
              <li>
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </li>
              <li>
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </li>
              <li>
                <i className="fas fa-question-circle"></i>
                <span>Help</span>
              </li>
              <li>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 