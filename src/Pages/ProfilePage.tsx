import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Pages/Header';
import '../CSS/Profile.css';

interface MediaDto {
  id: string;
  filename: string;
  contentType: string;
  captionText: string;
  uploadDate: string;
  userId: string;
  userName: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('user_name');
  const email = localStorage.getItem('user_email');
  const picture = localStorage.getItem('user_picture');

  const [media, setMedia] = useState<MediaDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedMedia, setSelectedMedia] = useState<MediaDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');

  useEffect(() => {
    if (!name) {
      setError('User name is missing. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchUserMedia = async () => {
      try {
        const response = await axios.get<MediaDto[]>(
          `http://localhost:8080/api/media/user/name/${encodeURIComponent(name)}`
        );
        setMedia(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load user media.');
        } else {
          setError('Unexpected error loading user media.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserMedia();
  }, [name]);

  return (
    <>
      <Header
        currentUser={{
          id: 'local-user',
          name: name || '',
          avatar: picture || undefined,
        }}
      />

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
  {picture && <img src={picture} alt="Profile" className="profile-photo" />}
  <h2 className="profile-name">{name}</h2>
  <p className="profile-email">{email}</p>

  <div className="profile-actions">
    <button className="btn btn-upload" onClick={() => navigate('/upload')}>
      Upload Media
    </button>
    <button className="btn">Edit Profile</button>
    <button
      className="btn btn-secondary"
      onClick={() => {
        localStorage.clear();
        navigate('/');
      }}
    >
      Logout
    </button>
  </div>
</aside>

        {/* Main Content */}
        <main className="profile-content">
          <h3>Your Uploads</h3>
          {loading ? (
            <p>Loading your media...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : media.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <div className="grid-gallery">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="media-card"
                  onClick={() => {
                    setSelectedMedia(item);
                    setNewCaption(item.captionText || '');
                    setShowModal(true);
                  }}
                >
                  {item.contentType?.startsWith('image') ? (
                    <img
                      src={`http://localhost:8080/api/media/${item.id}`}
                      alt={item.captionText || 'Uploaded image'}
                      className="media-image"
                    />
                  ) : (
                    <video
                      src={`http://localhost:8080/api/media/${item.id}`}
                      className="media-image"
                      controls
                    />
                  )}
                  <p className="media-caption">{item.captionText || 'No caption'}</p>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modal */}
        {showModal && selectedMedia && (
          <div className="media-modal">
            <div className="media-modal-content">
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
              {selectedMedia.contentType.startsWith('image') ? (
                <img
                  src={`http://localhost:8080/api/media/${selectedMedia.id}`}
                  alt={selectedMedia.captionText}
                  className="modal-image"
                />
              ) : (
                <video
                  src={`http://localhost:8080/api/media/${selectedMedia.id}`}
                  className="modal-image"
                  controls
                />
              )}

              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="modal-caption-input"
                placeholder="Edit caption"
              />

              <div className="modal-buttons">
                <button
                  className="btn btn-upload"
                  onClick={async () => {
                    try {
                      await axios.patch(
                        `http://localhost:8080/api/media/${selectedMedia.id}/caption`,
                        { caption: newCaption }
                      );
                      setShowModal(false);
                      window.location.reload();
                    } catch (err: unknown) {
                      if (axios.isAxiosError(err)) {
                        alert(err.response?.data?.message || 'Failed to update caption');
                      } else {
                        alert('An unexpected error occurred while updating caption.');
                      }
                    }
                  }}
                >
                  Update Caption
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this media?')) {
                      try {
                        await axios.delete(`http://localhost:8080/api/media/${selectedMedia.id}`);
                        setShowModal(false);
                        window.location.reload();
                      } catch (err: unknown) {
                        if (axios.isAxiosError(err)) {
                          alert(err.response?.data?.message || 'Failed to delete media');
                        } else {
                          alert('An unexpected error occurred while deleting media.');
                        }
                      }
                    }
                  }}
                >
                  Delete Media
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
