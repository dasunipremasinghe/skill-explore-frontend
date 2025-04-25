import React, { useState } from 'react';
import '../CSS/UploadMedia.css';

const MAX_SIZE_MB = 16;

const MediaUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
    setFile(selectedFile);
  };

  const handlePost = async () => {
    if (!file) {
      setError('Please select a file to post.');
      return;
    }

    const userId = localStorage.getItem('user_id');
    console.log("Using user_id:", userId);

    if (!userId) {
      setError('User not logged in.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('userId', userId);

    try {
      const response = await fetch('http://localhost:8080/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text(); // parse response for logging
      console.log("Raw response text:", responseText);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${responseText}`);
      }

      alert('Post uploaded successfully!');
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
  };

  return (
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

      {file && (
        <div className="preview">
          <p>Selected: {file.name}</p>
          {file.type.startsWith('image') ? (
            <img src={URL.createObjectURL(file)} alt="preview" />
          ) : (
            <video controls width="300">
              <source src={URL.createObjectURL(file)} />
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
  );
};

export default MediaUploader;
