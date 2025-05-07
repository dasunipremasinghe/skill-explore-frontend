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
    title: '',
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
    } else {
      fetchUserName('user123');
    }
  }, [editing]);

  const fetchUserName = async (userId: string) => {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      setForm(prev => ({ ...prev, title: res.data.name || 'Unknown User' }));
    } catch (err) {
      message.error('Failed to fetch user name');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (value: number) => {
    setForm({ ...form, rating: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let result;
    try {
      if (editing && editing.id) {
        // PUT request for update
        result = await axios.put(`/api/progress/${editing.id}`, form);
      } else {
        // POST request for insert
        result = await axios.post('/api/progress', form);
      }
      onSave(result.data);  // Notify parent component (ProgressGrid)
      onClose(); // Close modal after save
    } catch (error) {
      message.error('Error saving progress update');
      console.error(error);
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
