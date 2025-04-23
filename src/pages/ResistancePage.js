import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import ChartDisplay from '../components/ChartDisplay';
import BackButton from '../components/BackButton';
import './ResistancePage.css'
const ResistancePage = () => {
  const [resistanceData, setResistanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('analysisData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setResistanceData(parsedData.resistanceResult);
    }
    setLoading(false);
  }, []);

  const handleViewFeatures = () => navigate('/resistance-feature');
  const handleBackToMain = () => navigate('/');

  if (loading) {
    return (
      <div className="loading-container">
        <AppBar />
        <div className="loading">載入中...</div>
      </div>
    );
  }

  if (!resistanceData) {
    return (
      <div className="error-container">
        <AppBar />
        <div className="error-message">無法載入抗藥性數據</div>
      </div>
    );
  }

  return (
    <div className="resistance-page">
      <AppBar />
      <div className="result-content">
        <div className="result-header">
          <h2>抗藥性判斷—{resistanceData.species}</h2>
        </div>
        <div className="result-details">
          <div className="resistance-info">
            <h3>此菌株對{resistanceData.resistantTo.join('、')}具有抗藥性</h3>
            <div className="bottom-left-buttons">
              <button className="general-button" onClick={handleViewFeatures}>看模型判斷之特徵</button>
              <BackButton text="回到主頁" onClick={handleBackToMain} />
            </div>

          </div>
          <div className="chart-area">
            <ChartDisplay data={resistanceData.chartData} title="抗藥性判斷結果" type="resistance" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResistancePage;
