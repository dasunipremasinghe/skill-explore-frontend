import React, { useState } from 'react';
import Header from '../Pages/Header';
import '../CSS/UploadMedia.css';

const MAX_SIZE_MB = 100;

const UploadMedia: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const name = localStorage.getItem('user_name');
  const avatar = localStorage.getItem('user_picture');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > MAX_SIZE_MB) {
      setError(`File is too large. Max allowed size is ${MAX_SIZE_MB} MB.`);
      setFile(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setFile(selectedFile);
  };

  const handlePost = async () => {
    if (!file) {
      setError('Please select a file to post.');
      return;
    }

    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');

    if (!userId || !userName || !userEmail) {
      setError('User details missing. Please log in again.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('userId', userId);
    formData.append('userName', userName);
    formData.append('userEmail', userEmail);

    try {
      const response = await fetch('http://localhost:8080/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${responseText}`);
      }

      setSuccess('✅ Post uploaded successfully!');
      setFile(null);
      setCaption('');
    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error';
      console.error('Upload error:', errorMessage);
      setError('Failed to upload media: ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDiscard = () => {
    setFile(null);
    setCaption('');
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <Header
        currentUser={{
          id: 'local-user',
          name: name || '',
          avatar: avatar || undefined,
        }}
      />

      <div className="upload-page-container">
        <div className="uploader-container">
          <label className="upload-label">
            Upload Media (Image or Video)
            <input
              type="file"
              accept="image/*,video/mp4,video/webm"
              onChange={handleFileChange}
            />
          </label>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          {file && (
            <div className="preview">
              <p>Selected: {file.name}</p>

              {file.type.startsWith('image') ? (
                <img src={URL.createObjectURL(file)} alt="preview" />
              ) : (
                <video controls width="100%" style={{ borderRadius: '12px' }}>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              )}

              <textarea
                className="caption-box"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              <div className="action-buttons">
                <button className="btn-post" onClick={handlePost} disabled={uploading}>
                  {uploading ? 'Posting...' : 'Post'}
                </button>
                <button className="btn-discard" onClick={handleDiscard} disabled={uploading}>
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadMedia;
