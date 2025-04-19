import React, { useRef } from 'react';
import './UploadButton.css';

const UploadButton = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.txt')) {
      onFileUpload(file);
    } else {
      alert('請上傳 .txt 格式的質譜數據文件');
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