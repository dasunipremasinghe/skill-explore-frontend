import React from "react";
import "../css/NotificationItem.css";

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'share' | 'default' | 'info';
  username?: string;
  message: string;
  timestamp: string | Date;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onRemove: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead, onRemove }) => {
  const { id, type, username, message, timestamp, read } = notification;
  
  const getNotificationIcon = (): string => {
    switch (type) {
      case 'like':
        return 'fas fa-heart notification-icon-like';
      case 'comment':
        return 'fas fa-comment notification-icon-comment';
      case 'share':
        return 'fas fa-share notification-icon-share';
      default:
        return 'fas fa-bell notification-icon-default';
    }
  };

  const formattedTime = new Date(timestamp).toLocaleString();

  return (
    <div className={`notification-item ${read ? 'read' : 'unread'}`}>
      <div className="notification-icon">
        <i className={getNotificationIcon()}></i>
      </div>
      
      <div className="notification-content">
        <div className="notification-text">{message}</div>
        <div className="notification-time">{formattedTime}</div>
      </div>
      
      <div className="notification-actions">
        {!read && (
          <button 
            className="notification-mark-read" 
            onClick={() => onMarkAsRead(id)}
            title="Mark as read"
          >
            <i className="fas fa-check"></i>
          </button>
        )}
        
        <button 
          className="notification-remove" 
          onClick={() => onRemove(id)}
          title="Remove notification"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem; 