import React, { useState } from 'react';
import axios from 'axios';
import './upload.css';

const UploadStudent = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [duplicateCount, setDuplicateCount] = useState(0);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post('https://krpbus.vercel.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      

      if (response.data.duplicateCount > 0) {
        setMessage(`Some rows contain duplicate enrollment codes. File uploaded with unique entries. Duplicate count: ${response.data.duplicateCount}`);
      } else {
        setMessage('File uploaded successfully with all unique entries.');
      }
      setDuplicateCount(response.data.duplicateCount);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Student Excel File</h2>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {duplicateCount > 0 && (
        <div className="duplicate-entries">
          <h3>Duplicate Entries Count: {duplicateCount}</h3>
        </div>
      )}
    </div>
  );
};

export default UploadStudent;
