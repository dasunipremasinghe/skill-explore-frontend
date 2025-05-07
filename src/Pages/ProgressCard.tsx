import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../CSS/Progress.css';
import axios from 'axios';


interface ProgressUpdate {
  id?: string;
  userId: string;
  title: string;
  rating: number;
  description: string;
  date: string;
}

interface Props {
  item: ProgressUpdate;
  onEdit: () => void;
  onDelete: (id: string) => void;
  currentUserId: string;
}

export default function ProgressCard({ item, onEdit, onDelete, currentUserId }: Props) {
  const isOwner = item.userId === currentUserId;

  const handleDelete = async (id: string) => {
    try {
      
      await axios.delete(`http://localhost:8080/api/progress/${id}`);
      onDelete(id);
    } catch (err) {
      console.error('Error deleting progress', err);
    }
  };
  

  return (
    <div className="testimonial-card">
      <div className="rating">🌟 {item.rating}/5</div>
      <h4 className="testimonial-quote">"{item.description}"</h4>
      <p className="avatar-name">{item.title}</p>

      {isOwner && (
        <div className="testimonial-actions">
          <button onClick={onEdit} title="Edit"><EditOutlined /></button>
          <button onClick={() => handleDelete(item.id!)} title="Delete"><DeleteOutlined /></button>
        </div>
      )}
    </div>
  );
}
