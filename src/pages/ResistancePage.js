import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import ChartDisplay from '../components/ChartDisplay';
import BackButton from '../components/BackButton';
import { AnalysisContext } from '../context/AnalysisContext';
import { loadAnalysisData, saveAnalysisData } from '../utils/analysisStorage';
import './ResistancePage.css';

// ... 前面程式碼保持不變

const ResistancePage = () => {
  const { analysisData, setAnalysisData } = useContext(AnalysisContext);
  const [loading, setLoading] = useState(true);
  const [resistanceChartData, setResistanceChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!analysisData) {
      const storedData = loadAnalysisData();
      if (storedData) {
        setAnalysisData(storedData);
      }
    }
    setLoading(false);
  }, [analysisData, setAnalysisData]);

  useEffect(() => {
    if (analysisData) {
      saveAnalysisData(analysisData);

      // 轉換 chartData 格式成 Chart.js 可用的格式
      const raw = analysisData.resistance_result;
      if (raw) {
        const labels = raw.chartData?.map(item => item.label) || [];
        const dataValues = raw.chartData?.map(item => item.value) || [];

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: '抗藥性概率 (%)',
              data: dataValues,
              backgroundColor: labels.map(label => {
                // 可依抗藥性標籤決定顏色
                return raw.resistant_antibiotics.includes(label) ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)';
              }),
              borderColor: labels.map(label => {
                return raw.resistant_antibiotics.includes(label) ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
              }),
              borderWidth: 1,
            },
          ],
        };

        setResistanceChartData(chartData);
      } else {
        setResistanceChartData(null);
      }
    }
  }, [analysisData, setAnalysisData]);

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

  if (!analysisData || !analysisData.resistance_result) {
    return (
      <div className="error-container">
        <AppBar />
        <div className="error-message">無法載入抗藥性數據</div>
      </div>
    );
  }

  const resistantTo = analysisData.resistance_result.resistant_antibiotics || [];

  if (!resistanceChartData) {
    return (
      <div className="error-container">
        <AppBar />
        <div className="error-message">抗藥性圖表資料無法顯示</div>
      </div>
    );
  }

  return (
    <div className="resistance-page">
      <AppBar />
      <div className="result-content">
        <div className="result-header">
          <h2>抗藥性判斷 — {analysisData.species_result?.species || '未知菌種'}</h2>
        </div>
        <div className="result-details">
          <div className="resistance-info">
            <h3>
              此菌株對
              {resistantTo.length > 0 ? resistantTo.join('、') : '無抗藥性'}
              具有抗藥性
            </h3>
            <div className="bottom-left-buttons">
              <button className="general-button" onClick={handleViewFeatures}>
                看模型判斷之特徵
              </button>
              <BackButton text="回到主頁" onClick={handleBackToMain} />
            </div>
          </div>
          <div className="chart-area">
            <ChartDisplay
              data={resistanceChartData}
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
