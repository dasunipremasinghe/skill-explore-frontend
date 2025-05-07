import React, { useState } from "react";
import Like from "./Like";
import CommentList from "./CommentList";
import Share from "./Share";
import "../css/Post.css";
import { MapsUgcOutlined } from "@mui/icons-material";

interface User {
  id: string | number;
  name?: string;
  username?: string;
  avatar?: string;
}

interface LikeData {
  id: number;
  userId: string | number;
  username?: string;
  timestamp: string;
}

interface Post {
  id: string | number;
  content: string;
  image?: string;
  timestamp: string | Date;
  username?: string;
  userAvatar?: string;
  user?: User;
  likes?: LikeData[];
  commentCount?: number;
  shares?: number;
}

interface PostProps {
  post: Post;
  currentUser: User | null;
}

const Post: React.FC<PostProps> = ({ post, currentUser }) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  
  const toggleComments = (): void => {
    setShowComments(!showComments);
  };
  
  return (
    <div className="post">
      <div className="post-header">
        <div className="post-user">
          <img 
            className="post-avatar" 
            src={post.userAvatar || "/default-avatar.png"} 
            alt={post.username || 'User'} 
          />
          <div className="post-user-info">
            <h3 className="post-username">{post.username || 'Anonymous'}</h3>
            <span className="post-time">{new Date(post.timestamp).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="post-menu">
          <button className="post-menu-button">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      
      <div className="post-content">
        <p className="post-text">{post.content}</p>
        
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="Post" />
          </div>
        )}
      </div>
            
      <div className="post-actions">
        <Like 
          postId={post.id} 
          initialLikes={post.likes || []} 
          currentUser={currentUser}
          postOwner={post.user} 
        />
        
        <button className="post-action-button" onClick={toggleComments}>
          <MapsUgcOutlined className="far fa-comment"/>
          <span>Comment</span>
        </button>
        
        <Share post={post} currentUser={currentUser} />
      </div>
      
      {showComments && (
        <CommentList postId={post.id} currentUser={currentUser} />
      )}
    </div>
  );
};

export default Post; 