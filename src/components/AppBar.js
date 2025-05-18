import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppBar.css';

const AppBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const loadHistory = () => {
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
  };

  const handleHistoryClick = () => {
    loadHistory();
    navigate('/history');
  };

  const handleLogout = () => {
    localStorage.removeItem('history');
    setHistory([]);
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <div className="app-bar">
      <div className="title" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
        抗藥性分析
      </div>
      <div className="user-section">
        <div
          className="user-button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="user-icon">👤</div>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleHistoryClick}>
                歷史上傳數據
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;
