import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import HistoryTable from '../components/HistoryTable';
import BackButton from '../components/BackButton';
import { getUserHistory } from '../utils/api';
import { saveAnalysisData } from '../utils/storage';  // Helper function to save data to localStorage
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
    const selectedRecord = historyData.find(record => record.analysisId === recordId);
    if (selectedRecord) {
      // Save the selected record to localStorage with the appropriate data
      const analysisData = {
        analysisId: selectedRecord.analysisId,
        speciesResult: selectedRecord.speciesResult,
        resistanceResult: selectedRecord.resistanceResult,
        speciesFeatures: selectedRecord.speciesFeatures,
        resistanceFeatures: selectedRecord.resistanceFeatures
      };

      // Save the data in localStorage
      saveAnalysisData(analysisData);
      localStorage.setItem('currentStage', 0); // Reset stage to "NOT_STARTED"

      // Navigate to the main page (which will load the selected analysis data)
      navigate('/');
    }
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
            onViewDetails={handleViewDetails}  // Pass the handler to view details
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
