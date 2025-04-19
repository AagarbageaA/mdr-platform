import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import ChartDisplay from '../components/ChartDisplay';
import { getSpeciesResult } from '../utils/api';
import './SpeciesResultPage.css';

const SpeciesResultPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // 加載菌種分析結果
    const loadSpeciesData = async () => {
      try {
        const analysisId = localStorage.getItem('currentAnalysisId');
        if (!analysisId) {
          navigate('/');
          return;
        }

        const data = await getSpeciesResult(analysisId);
        setSpeciesData(data);
        setLoading(false);
      } catch (error) {
        console.error('載入菌種資料失敗:', error);
        alert('載入資料失敗，請重試');
        navigate('/');
      }
    };

    // 使用模擬數據進行開發
    const loadMockData = () => {
      const mockData = {
        species: 'K. pneumoniae',
        probability: 86,
        chartData: {
          labels: ['K. pneumoniae', 'A. baumannii', 'E. faecium', 'S. aureus', 'P. aeruginosa'],
          datasets: [
            {
              label: '菌種機率 (%)',
              data: [86, 30, 20, 15, 10],
            },
          ],
        },
      };
      setSpeciesData(mockData);
      setLoading(false);
    };

    // 在開發階段使用模擬數據
    loadMockData();
    // 實際使用時切換為下面的代碼
    // loadSpeciesData();
  }, [navigate]);

  const handleViewFeatures = () => {
    navigate('/species-feature');
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <AppBar isLoggedIn={isLoggedIn} />
        <div className="loading">載入中...</div>
      </div>
    );
  }

  return (
    <div className="species-result-page">
      <AppBar isLoggedIn={isLoggedIn} />
      
      <div className="result-content">
        <div className="result-header">
          <h2>數據菌種判斷</h2>
        </div>
        
        <div className="result-details">
          <div className="species-info">
            <h3>判斷結果為{speciesData.species}</h3>
            <p>為該細菌之機率為 {speciesData.probability}%</p>
            
            <div className="action-buttons">
              <button className="feature-button" onClick={handleViewFeatures}>
                看模型判斷之特徵
              </button>
              <button className="main-button" onClick={handleBackToMain}>
                回到主頁
              </button>
            </div>
          </div>
          
          <div className="chart-area">
            <ChartDisplay 
              data={speciesData.chartData} 
              title="菌種機率分布" 
              type="species"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesResultPage;