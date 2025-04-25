import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import "../css/Like.css";

interface User {
  id: string | number;
  name?: string;
}

interface Like {
  id: number;
  userId: string | number;
  username?: string;
  timestamp: string;
}

interface LikeProps {
  postId: string | number;
  initialLikes?: Like[];
  currentUser: User | null;
  postOwner?: User;
}

const Like: React.FC<LikeProps> = ({ postId, initialLikes = [], currentUser, postOwner }) => {
  const [likes, setLikes] = useState<Like[]>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(
    initialLikes.some(like => like.userId === currentUser?.id)
  );
  const { addNotification } = useNotifications();

  const handleLike = (): void => {
    if (!currentUser) return;

    if (isLiked) {
      // Remove like
      setLikes(prevLikes => 
        prevLikes.filter(like => like.userId !== currentUser.id)
      );
    } else {
      // Add like
      const newLike: Like = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.name,
        timestamp: new Date().toISOString()
      };
      
      setLikes(prevLikes => [...prevLikes, newLike]);
      
      // Create notification for the like with post owner's name
      addNotification({
        id: Date.now(),
        type: 'info',
        message: `You liked ${postOwner ? postOwner.name + "'s" : "a"} post`,
        timestamp: new Date(),
        read: false 
      });
    }
    
    setIsLiked(!isLiked);
  };

  return (
    <div className="like-container">
      <button 
        className={`like-button ${isLiked ? 'liked' : ''}`} 
        onClick={handleLike}
      >
        {isLiked ? (
          <FavoriteIcon className="like-icon" />
        ) : (
          <FavoriteBorderIcon className="like-icon" />
        )}
        {likes.length > 0 && (
          <span className="like-count">{likes.length}</span>
        )}
      </button>
    </div>
  );
};

export default Like; 