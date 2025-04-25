import React, { useState } from "react";
import { commentService } from "../services/CommentService";
import '../css/Comment.css'

interface User {
  id: string | number;
  username?: string;
  avatar?: string;
}

interface CommentProps {
  comment: {
    _id: string | number;
    content: string;
    userId: string | number;
    postId: string | number;
    username?: string;
    userAvatar?: string;
    timestamp: string | Date;
  };
  onCommentUpdate: (updatedComment: CommentProps['comment']) => void;
  onCommentDelete: (commentId: string | number) => void;
  currentUser: User | null;
}

const Comment: React.FC<CommentProps> = ({ comment, onCommentUpdate, onCommentDelete, currentUser }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(comment.content);

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setEditText(comment.content);
  };

  const handleSaveEdit = async (): Promise<void> => {
    try {
      await commentService.updateComment(comment._id, { 
        ...comment, 
        content: editText 
      });
      
      onCommentUpdate({
        ...comment,
        content: editText
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await commentService.deleteComment(comment._id);
      onCommentDelete(comment._id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const isAuthor = currentUser && comment.userId === currentUser.id;

  return (
    <div className="comment">
      <div className="comment-avatar">
        <img src={comment.userAvatar || "/default-avatar.png"} alt={comment.username || 'User'} />
      </div>
      
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.username || 'Anonymous'}</span>
          <span className="comment-time">{new Date(comment.timestamp).toLocaleString()}</span>
        </div>
        
        {isEditing ? (
          <div className="comment-edit">
            <textarea
              value={editText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value)}
              className="comment-edit-textarea"
            />
            <div className="comment-edit-actions">
              <button onClick={handleSaveEdit} className="btn-save">Save</button>
              <button onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="comment-text">{comment.content}</div>
        )}
        
        {isAuthor && !isEditing && (
          <div className="comment-actions">
            <button onClick={handleEdit} className="btn-edit">Edit</button>
            <button onClick={handleDelete} className="btn-delete">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment; 