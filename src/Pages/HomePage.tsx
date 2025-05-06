import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/HomePage.css';

interface MediaDto {
  id: string;
  filename: string;
  contentType: string;
  captionText: string;
  uploadDate: string;
  userId: string;
  userName: string;
}

const HomePage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaDto | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get<MediaDto[]>('http://localhost:8080/api/media/all');
        setMediaList(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch media.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments(prev => [...prev, comment.trim()]);
      setComment('');
    }
  };

  if (loading) return <div className="status-message">Loading...</div>;
  if (error) return <div className="status-message error">{error}</div>;

  return (
    <div className="home-container">
      <div className="grid-gallery">
        {mediaList.map((media) => (
          <div key={media.id} className="media-card" onClick={() => setSelectedMedia(media)}>
            {media.contentType.startsWith('image') ? (
              <img
                src={`http://localhost:8080/api/media/${media.id}`}
                alt={media.captionText || 'Media'}
                className="media-image"
              />
            ) : (
              <video
                src={`http://localhost:8080/api/media/${media.id}`}
                className="media-image"
                controls
              />
            )}
          </div>
        ))}
      </div>

      {selectedMedia && (
        <div className="modal-overlay" onClick={() => setSelectedMedia(null)}>
          <div className="modal-pinterest" onClick={(e) => e.stopPropagation()}>
            <div className="modal-left">
              {selectedMedia.contentType.startsWith('image') ? (
                <img
                  src={`http://localhost:8080/api/media/${selectedMedia.id}`}
                  alt={selectedMedia.captionText}
                  className="modal-img-full"
                />
              ) : (
                <video
                  src={`http://localhost:8080/api/media/${selectedMedia.id}`}
                  controls
                  className="modal-img-full"
                />
              )}
            </div>
            <div className="modal-right">
              <div className="modal-meta">
                <h3>{selectedMedia.captionText || 'Untitled'}</h3>
                <p><strong>{selectedMedia.userName.split('@')[0]}</strong></p>
              </div>
              <div className="modal-comments">
                <h4>{comments.length} comment{comments.length !== 1 ? 's' : ''}</h4>
                <ul>
                  {comments.map((cmt, idx) => (
                    <li key={idx}>{cmt}</li>
                  ))}
                </ul>
                <div className="comment-box">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment"
                  />
                  <button onClick={handleAddComment}>Post</button>
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setSelectedMedia(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
