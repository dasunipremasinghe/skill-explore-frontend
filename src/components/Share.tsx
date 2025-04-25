import React, { useState, ReactNode } from "react";
import { useNotifications } from "../context/NotificationContext";
import "../css/Share.css";
import { AddLinkOutlined, EmailOutlined, ForwardToInboxRounded, SendOutlined, ShareOutlined, TimelineOutlined } from "@mui/icons-material";
import Toast from "./Toast";

interface User {
  id: string | number;
  name?: string;
}

interface Post {
  id: string | number;
  content?: string;
}

interface ShareOption {
  id: string;
  name: string;
  icon: ReactNode;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ShareProps {
  post: Post;
  currentUser: User | null;
}

const Share: React.FC<ShareProps> = ({ post, currentUser }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { addNotification } = useNotifications();

  const shareOptions: ShareOption[] = [
    { id: 'timeline', name: 'Share to Timeline', icon: <TimelineOutlined /> },
    { id: 'message', name: 'Send as Message', icon: <ForwardToInboxRounded/> },
    { id: 'copy', name: 'Copy Link', icon: <AddLinkOutlined/> },
    { id: 'email', name: 'Share via Email', icon: <EmailOutlined/> }
  ];

  const toggleShareModal = (): void => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success'): void => {
    setToast({ message, type });
  };

  const handleShare = (option: ShareOption): void => {
    // In a real app, this would implement actual sharing functionality
    console.log(`Sharing post ${post.id} via ${option.id}`);
    
    // Create a notification for the share
    addNotification({
      id: Date.now(),
      type: 'info',
      message: `You shared your post via ${option.name}`,
      timestamp: new Date(),
      read: false
    });
    
    // Handle different share methods
    switch (option.id) {
      case 'copy':
        // In a real app, you'd copy a URL to clipboard
        showToast("Link copied to clipboard!", "success");
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out this post&body=I thought you might be interested in this: ${window.location.href}`;
        showToast("Email client opened!", "info");
        break;
      default:
        // For timeline and message, just show confirmation
        showToast(`Post shared via ${option.name}!`, "success");
    }
    
    setIsShareModalOpen(false);
  };

  return (
    <div className="share-container">
      <button className="share-button" onClick={toggleShareModal}>
        <ShareOutlined className="share-icon"/>
        <span>Share</span>
      </button>
      
      {isShareModalOpen && (
        <div className="share-modal-overlay" onClick={toggleShareModal}>
          <div className="share-modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share this post</h3>
              <button className="share-modal-close" onClick={toggleShareModal}>
                <SendOutlined className="fas fa-times"/>
              </button>
            </div>
            
            <div className="share-options">
              {shareOptions.map(option => (
                <button 
                  key={option.id}
                  className="share-option" 
                  onClick={() => handleShare(option)}
                >
                  <span className="share-option-icon">{option.icon}</span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Share; 