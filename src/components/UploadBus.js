import React, { useState } from 'react';
import axios from 'axios';
import './upload.css';

const UploadBus = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please upload a valid Excel file.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('busFile', file);

    setUploading(true);
    try {
      const response = await axios.post('https://krpbus.vercel.app/upload-bus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.duplicateCount > 0) {
        setMessage(`Some rows contain duplicate bus numbers. File uploaded with unique entries. Duplicate count: ${response.data.duplicateCount}`);
      } else {
        setMessage('File uploaded successfully with all unique entries.');
      }
      setDuplicateCount(response.data.duplicateCount);
      
      // Refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Bus Details Excel File</h2>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          accept=".xlsx"
          onChange={onFileChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {uploading && (
        <div className="loader-container">
          <div className="loader"></div> {/* Loader animation */}
        </div>
      )}
      {message && <p className="message">{message}</p>}
      {duplicateCount > 0 && (
        <div className="duplicate-entries">
          <h3>Duplicate Entries Count: {duplicateCount}</h3>
        </div>
      )}
    </div>
  );
};

export default UploadBus;
