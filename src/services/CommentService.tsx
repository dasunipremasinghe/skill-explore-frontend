import axios from "axios";

const API_URL = "http://localhost:8080";

export interface Comment {
  _id: string | number;
  id?: string;
  content: string;
  userId: string | number;
  postId: string | number;
  username?: string;
  userAvatar?: string;
  timestamp: string | Date;
}

export const commentService = {
  getComments: async (postId: string | number): Promise<Comment[]> => {
    try {
      const response = await axios.get<Comment[]>(`${API_URL}/Comments?postId=${postId}`);
      console.log('API Response:', response); 
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
  
  addComment: async (commentData: Omit<Comment, '_id'>): Promise<Comment> => {
    try {
      const response = await axios.post<Comment>(`${API_URL}/Comments/AddComment`, commentData);
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },
  
  updateComment: async (id: string | number, commentData: Partial<Comment>): Promise<Comment> => {
    try {
      const response = await axios.put<Comment>(`${API_URL}/Comments/UpdateComment/${id}`, commentData);
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },
  
  deleteComment: async (id: string | number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/Comments/DeleteComment/${id}`);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
};

export default commentService; 