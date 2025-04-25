import React, { useState, useEffect } from "react";
import { commentService } from "../services/CommentService";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import "../css/CommentList.css";
import { useNotifications } from "../context/NotificationContext";

interface User {
  id: string | number;
  name?: string;
  avatar?: string;
}

interface CommentData {
  _id: string | number;
  id: string;
  content: string;
  postId: string | number;
  userId: string | number;
  timestamp: string | Date;
  username?: string;
  userAvatar?: string;
}

interface CommentListProps {
  postId: string | number;
  currentUser: User | null;
}

const CommentList: React.FC<CommentListProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await commentService.getComments(postId);
      console.log('Received comments data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Expected array of comments but received:', typeof data);
        throw new Error('Invalid response format');
      }

      // Transform the comments data to handle MongoDB ObjectId
      const transformedComments = data.map(comment => {
        console.log('Processing comment:', comment); // Debug log
        
        // Handle different possible structures of the comment data
        let commentId = '';
        let commentTimestamp = '';
        
        if (comment.id && typeof comment.id === 'object') {
          // If id is an object with timestamp property
          const idObj = comment.id as { timestamp?: number; date?: string };
          if (idObj.timestamp) {
            commentId = idObj.timestamp.toString();
            commentTimestamp = idObj.date || new Date().toISOString();
          } else {
            // If id is an object but doesn't have timestamp
            commentId = String(comment.id);
            commentTimestamp = new Date().toISOString(); // Use current date as fallback
          }
        } else {
          // If id is a string or number
          commentId = comment.id ? comment.id.toString() : '';
          
          // Safely handle timestamp conversion
          try {
            if (typeof comment.timestamp === 'string') {
              // Validate if it's a valid date string
              const date = new Date(comment.timestamp);
              if (!isNaN(date.getTime())) {
                commentTimestamp = date.toISOString();
              } else {
                commentTimestamp = new Date().toISOString();
              }
            } else if (comment.timestamp instanceof Date) {
              commentTimestamp = comment.timestamp.toISOString();
            } else {
              commentTimestamp = new Date().toISOString();
            }
          } catch (error) {
            console.error('Error converting timestamp:', error);
            commentTimestamp = new Date().toISOString();
          }
        }
        
        return {
          _id: comment.id || comment._id, // Use either id or _id
          id: commentId,
          content: comment.content,
          postId: comment.postId,
          userId: comment.userId,
          timestamp: commentTimestamp,
          username: currentUser?.name,
          userAvatar: currentUser?.avatar
        };
      });

      console.log('Transformed comments:', transformedComments); // Debug log
      setComments(transformedComments);
      setError(null);
    } catch (err) {
      console.error("Error details:", err);
      setError(err instanceof Error ? err.message : "Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (text: string): Promise<boolean> => {
    try {
      if (!currentUser) return false;
      
      const newComment = {
        content: text,
        postId: postId,
        userId: currentUser.id,
        timestamp: new Date().toISOString()
      };

      const savedComment = await commentService.addComment(newComment);
      
      console.log('Saved comment structure:', savedComment); // Debug log
      
      // Handle different possible structures of the saved comment data
      let commentId = '';
      let commentTimestamp = '';
      
      if (savedComment.id && typeof savedComment.id === 'object') {
        // If id is an object with timestamp property
        const idObj = savedComment.id as { timestamp?: number; date?: string };
        if (idObj.timestamp) {
          commentId = idObj.timestamp.toString();
          commentTimestamp = idObj.date || new Date().toISOString();
        } else {
          // If id is an object but doesn't have timestamp
          commentId = String(savedComment.id);
          commentTimestamp = new Date().toISOString(); // Use current date as fallback
        }
      } else {
        // If id is a string or number
        commentId = savedComment.id ? savedComment.id.toString() : '';
        
        // Safely handle timestamp conversion
        try {
          if (typeof savedComment.timestamp === 'string') {
            // Validate if it's a valid date string
            const date = new Date(savedComment.timestamp);
            if (!isNaN(date.getTime())) {
              commentTimestamp = date.toISOString();
            } else {
              commentTimestamp = new Date().toISOString();
            }
          } else if (savedComment.timestamp instanceof Date) {
            commentTimestamp = savedComment.timestamp.toISOString();
          } else {
            commentTimestamp = new Date().toISOString();
          }
        } catch (error) {
          console.error('Error converting timestamp:', error);
          commentTimestamp = new Date().toISOString();
        }
      }
      
      // Transform the saved comment to match our frontend format
      const transformedComment: CommentData = {
        _id: savedComment.id || savedComment._id, // Use either id or _id
        id: commentId,
        content: savedComment.content,
        postId: savedComment.postId,
        userId: savedComment.userId,
        timestamp: commentTimestamp,
        username: currentUser?.name,
        userAvatar: currentUser?.avatar
      };
      
      setComments(prevComments => [transformedComment, ...prevComments]);
      
      // Add notification for comment
      addNotification({
        id: Date.now(),
        type: 'comment',
        message: `You commented on a post: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
        timestamp: new Date(),
        read: false
      });
      
      return true;
    } catch (err) {
      console.error("Error adding comment:", err);
      return false;
    }
  };

  const handleUpdateComment = (updatedComment: { 
    _id: string | number; 
    content: string; 
    userId: string | number; 
    postId: string | number; 
    username?: string; 
    userAvatar?: string; 
    timestamp: string | Date; 
  }): void => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment._id === updatedComment._id ? {
          ...comment,
          content: updatedComment.content,
          timestamp: typeof updatedComment.timestamp === 'string' 
            ? updatedComment.timestamp 
            : updatedComment.timestamp.toISOString()
        } : comment
      )
    );
  };

  const handleDeleteComment = (commentId: string | number): void => {
    setComments(prevComments => 
      prevComments.filter(comment => comment._id !== commentId)
    );
  };

  if (loading) return <div className="comments-loading">Loading comments...</div>;
  
  if (error) return <div className="comments-error">{error}</div>;

  return (
    <div className="comments-section">
      <h3 className="comments-heading">Comments</h3>
      <CommentForm onSubmit={handleAddComment} currentUser={currentUser} />
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onCommentUpdate={handleUpdateComment}
              onCommentDelete={handleDeleteComment}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList; 