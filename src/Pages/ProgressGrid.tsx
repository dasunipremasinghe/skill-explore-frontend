import { useEffect, useState } from 'react';
import axios from 'axios';
import './Progress.css';
import ProgressCard from './ProgressCard';
import ProgressModal from './ProgressModal';
import FloatingAddButton from './FloatingAddButton';
import DeleteConfirmModal from './DeleteConfirmModal';

interface ProgressUpdate {
  id?: string;
  userId: string;
  title: string;
  rating: number;
  description: string;
  date: string;
}

export default function ProgressGrid() {
  const [items, setItems] = useState<ProgressUpdate[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProgressUpdate | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const currentUserId = 'user123'; // Simulate logged-in user

  useEffect(() => {
    fetchAllProgress();
  }, []);

  const fetchAllProgress = async () => {
    const res = await axios.get<ProgressUpdate[]>('http://localhost:8080/api/progress');
    setItems(res.data);
  };

  const handleSave = (newItem: ProgressUpdate) => {
    if (editing) {
      setItems(items.map((i) => (i.id === newItem.id ? newItem : i)));
    } else {
      setItems([newItem, ...items]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (itemToDelete) {
      await axios.delete(`http://localhost:8080/api/progress/${itemToDelete}`);
      setItems(items.filter((i) => i.id !== itemToDelete));
      setShowConfirm(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="progress-page">
      <div className="success-section">
        <div className="success-left">
          <h2>Our success<br />stories</h2>
        </div>

        <div className="success-right">
          <div className="testimonial-grid">
            {items.map((item) => (
              <ProgressCard
                key={item.id}
                item={item}
                onDelete={() => confirmDelete(item.id!)}
                onEdit={() => {
                  setEditing(item);
                  setModalOpen(true);
                }}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>

        <FloatingAddButton onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }} />

        {modalOpen && (
          <ProgressModal
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSave={handleSave}
            editing={editing}
          />
        )}

        {showConfirm && (
          <DeleteConfirmModal
            onCancel={() => {
              setShowConfirm(false);
              setItemToDelete(null);
            }}
            onConfirm={handleDeleteConfirmed}
          />
        )}
      </div>
    </div>
  );
}
