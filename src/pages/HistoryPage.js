import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import HistoryTable from '../components/HistoryTable';
import BackButton from '../components/BackButton';
import { getUserHistory } from '../utils/api';
import './HistoryPage.css';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const data = await getUserHistory();
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryData();
  }, []);

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleViewDetails = (recordId) => {
    // Navigate to the main page with the selected record ID
    navigate(`/?recordId=${recordId}`);
  };

  return (
    <div className="history-page">
      <AppBar title="抗藥性分析" />
      <div className="history-content">
        <h2>歷史上傳數據</h2>
        {isLoading ? (
          <div className="loading">載入中...</div>
        ) : (
          <HistoryTable 
            data={historyData} 
            onViewDetails={handleViewDetails}
          />
        )}
        <div className="button-container">
          <BackButton text="回到主頁" onClick={handleBackToMain} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;