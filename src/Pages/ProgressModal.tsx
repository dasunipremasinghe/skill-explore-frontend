import { useState, useEffect } from 'react';
import { Rate, message } from 'antd';
import axios from 'axios';
import '../CSS/Progress.css';

interface ProgressUpdate {
  id?: string;
  userId: string;
  title: string;
  rating: number;
  description: string;
  date: string;
}

interface Props {
  onClose: () => void;
  onSave: (item: ProgressUpdate) => void;
  editing: ProgressUpdate | null;
}

export default function ProgressModal({ onClose, onSave, editing }: Props) {
  const [form, setForm] = useState<ProgressUpdate>({
    userId: 'user123',
    title: 'John Doe', // Provide default title (was failing before)
    description: '',
    rating: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({ description: '' });

  const validateForm = () => {
    const newErrors = { description: '' };
    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    setErrors(newErrors);
    return !newErrors.description;
  };

  useEffect(() => {
    if (editing) {
      setForm(editing);
    }
  }, [editing]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (value: number) => {
    setForm({ ...form, rating: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editing?.id
        ? `http://localhost:8080/api/progress/${editing.id}`
        : `http://localhost:8080/api/progress`;

      const method = editing?.id ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: form,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving progress update:', error);
      message.error('Failed to save progress update');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{editing ? 'Edit Progress' : 'Add New Progress'}</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          {errors.description && <p className="error">{errors.description}</p>}

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating:</label>
          <Rate onChange={handleRatingChange} value={form.rating || 0} />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
