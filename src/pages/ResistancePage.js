import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import ChartDisplay from '../components/ChartDisplay';
import { getResistanceResult } from '../utils/api';
import './ResistancePage.css';

const ResistancePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resistanceData, setResistanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // 加載抗藥性分析結果
    const loadResistanceData = async () => {
      try {
        const analysisId = localStorage.getItem('currentAnalysisId');
        if (!analysisId) {
          navigate('/');
          return;
        }

        const data = await getResistanceResult(analysisId);
        setResistanceData(data);
        setLoading(false);
      } catch (error) {
        console.error('載入抗藥性資料失敗:', error);
        alert('載入資料失敗，請重試');
        navigate('/');
      }
    };

    // 使用模擬數據進行開發
    const loadMockData = () => {
      const mockData = {
        species: 'K. pneumoniae',
        resistantTo: ['AMC', 'CAZ', 'CRO'],
        chartData: {
          labels: ['AMC', 'CAZ', 'CIP', 'CRO', 'CXM'],
          datasets: [
            {
              label: '抗藥性程度',
              data: [85, 90, 15, 88, 20],
            },
          ],
        },
      };
      setResistanceData(mockData);
      setLoading(false);
    };

    // 在開發階段使用模擬數據
    loadMockData();
    // 實際使用時切換為下面的代碼
    // loadResistanceData();
  }, [navigate]);

  const handleViewFeatures = () => {
    navigate('/resistance-feature');
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
    <div className="resistance-page">
      <AppBar isLoggedIn={isLoggedIn} />
      
      <div className="result-content">
        <div className="result-header">
          <h2>抗藥性判斷—{resistanceData.species}</h2>
        </div>
        
        <div className="result-details">
          <div className="resistance-info">
            <h3>此菌株對{resistanceData.resistantTo.join('、')}具有抗藥性</h3>
            
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
              data={resistanceData.chartData} 
              title="抗藥性判斷結果" 
              type="resistance"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResistancePage;