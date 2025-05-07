import React from "react";
import NotificationItem from "./Notification";
import { useNotifications } from "../context/NotificationContext";
import "../css/NotificationPanel.css";
import { NotificationsNoneOutlined } from "@mui/icons-material";

// Type adapter to convert between Notification interfaces
const adaptNotification = (notification: any) => {
  return {
    ...notification,
    content: notification.message || notification.content || ''
  };
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    clearNotification,
    clearAllNotifications 
  } = useNotifications();

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className={`notification-panel ${isOpen ? 'open' : ''}`}>
      <div className="notification-panel-header">
        <h3>Notifications</h3>
        <div className="notification-panel-actions">
          {notifications.length > 0 && (
            <button 
              className="notification-clear-all" 
              onClick={clearAllNotifications}
            >
              Clear All
            </button>
          )}
          <button className="notification-close" onClick={onClose}>
            <NotificationsNoneOutlined className="fas fa-times"/>
          </button>
        </div>
      </div>
      
      <div className="notification-panel-content">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <i className="fas fa-bell-slash"></i>
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={adaptNotification(notification)}
              onMarkAsRead={markAsRead}
              onRemove={clearNotification}
            />
          ))
        )}
      </div>
      
      {unreadCount > 0 && (
        <div className="notification-summary">
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel; 