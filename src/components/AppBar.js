import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppBar.css';

const AppBar = ({ isLoggedIn = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Login logic would go here
    console.log("Login button clicked");
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  return (
    <div className="app-bar">
      <div className="title">抗藥性分析</div>
      <div className="user-section">
        {isLoggedIn ? (
          <div 
            className="user-button"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
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
        ) : (
          <button className="login-button" onClick={handleLogin}>
            登入
          </button>
        )}
      </div>
    </div>
  );
};

export default AppBar;