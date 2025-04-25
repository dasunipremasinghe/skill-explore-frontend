import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProgressUpdate } from '../../api/progressAPI';
import './Progress.css';



interface Props {
  item: ProgressUpdate;
  onEdit: () => void;
  onDelete: (id: string) => void;
  currentUserId: string;
}

export default function ProgressCard({ item, onEdit, onDelete, currentUserId }: Props) {
  const isOwner = item.userId === currentUserId;

  return (
    <div className="testimonial-card">
      <div className="rating">🌟 {item.rating}/5</div>
      <h4 className="testimonial-quote">"{item.description}"</h4>
      <p className="avatar-name">{item.title}</p>

      {isOwner && (
        <div className="testimonial-actions">
          <button onClick={onEdit} title="Edit"><EditOutlined /></button>
          <button onClick={() => onDelete(item.id!)} title="Delete"><DeleteOutlined /></button>
        </div>
      )}
    </div>
  );
}
