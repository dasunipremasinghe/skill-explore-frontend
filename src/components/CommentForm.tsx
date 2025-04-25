import React, { useState, FormEvent, ChangeEvent } from "react";
import "../css/CommentForm.css";

interface User {
  id: string | number;
  name?: string;
  avatar?: string;
}

interface CommentFormProps {
  onSubmit: (text: string) => Promise<boolean>;
  currentUser: User | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, currentUser }) => {
  const [text, setText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(text);
      if (success) {
        setText("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form-avatar">
        <img src={currentUser?.avatar || "/default-avatar.png"} alt={currentUser?.name || 'User'} />
      </div>
      
      <div className="comment-form-input">
        <textarea
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          placeholder="Write a comment..."
          disabled={isSubmitting}
          required
        />
        
        <button 
          type="submit" 
          className="comment-submit-btn"
          disabled={isSubmitting || !text.trim()}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 