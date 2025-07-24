import { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ token }) => {
  const [file, setFile] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = e => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);

    try {
      const res = await axios.post('/api/upload/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setUploadedFile({
        fileName: res.data.data.file,
        filePath: `/uploads/${res.data.data.file}`
      });

      setMessage('File uploaded successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>File Upload</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="customFile">Choose Image</label>
          <input
            type="file"
            id="customFile"
            onChange={onChange}
            accept="image/*"
            className="file-input"
          />
          <small style={{ display: 'block', marginTop: '0.5rem', color: '#6b7280' }}>
            Supported formats: JPG, PNG, GIF (Max: 5MB)
          </small>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Uploading...' : 'Upload Profile Image'}
        </button>
      </form>
      
      {uploadedFile && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3>Uploaded Image</h3>
          <div style={{ marginTop: '1rem' }}>
            <img 
              src={uploadedFile.filePath} 
              alt="Uploaded"
              style={{ 
                width: '100%', 
                maxWidth: '300px', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;