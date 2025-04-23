import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import ChartDisplay from '../components/ChartDisplay';
import '../components/Button.css';
import './SpeciesResultPage.css'
import BackButton from '../components/BackButton';
const SpeciesResultPage = () => {
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('analysisData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSpeciesData(parsedData.speciesResult);
    }
    setLoading(false);
  }, []);

  const handleViewFeatures = () => {
    navigate('/species-feature');
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <AppBar />
        <div className="loading">載入中...</div>
      </div>
    );
  }

  if (!speciesData) {
    return (
      <div className="error-container">
        <AppBar />
        <div className="error-message">無法載入菌種結果資料</div>
      </div>
    );
  }

  return (
    <div className="species-result-page">
      <AppBar />
      <div className="result-content">
        <div className="result-header">
          <h2>數據菌種判斷</h2>
        </div>
        <div className="result-details">
          <div className="species-info">
            <h3>判斷結果為 {speciesData.species}</h3>
            <p>為該細菌之機率為 {speciesData.probability}%</p>
            <div className="action-buttons">
              <button className="general-button" onClick={handleViewFeatures}>看模型判斷之特徵</button>
              <BackButton text="回到主頁" onClick={handleBackToMain} />
            </div>
          </div>
          <div className="chart-area">
            <ChartDisplay data={speciesData.chartData} title="菌種機率分布" type="species" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesResultPage;
