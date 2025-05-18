// UploadButton.js
import React, { useRef } from 'react';
import './UploadButton.css';
import { uploadFile } from '../utils/api'; // 引入 api.js 中的上傳函數

const UploadButton = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };
  

  return (
    <div className="upload-container">
      <button className="upload-button" onClick={handleButtonClick}>
        上傳數據
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadButton;
