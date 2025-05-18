import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import HistoryTable from '../components/HistoryTable';
import BackButton from '../components/BackButton';
import { getUserHistory, clearUserHistory } from '../utils/api';
import { saveAnalysisData } from '../utils/storage';
import './HistoryPage.css';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const data = await getUserHistory();
        console.log("取得的歷史資料:", data);
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
    const selectedRecord = historyData.find(record => record.analysis_id === recordId);
    if (selectedRecord) {
      const analysisData = {
        analysis_id: selectedRecord.analysis_id,
        species_result: selectedRecord.species_result,
        resistance_result: selectedRecord.resistance_result,
      };
      saveAnalysisData(analysisData);
      localStorage.setItem('currentStage', 0); // Reset stage
      navigate('/');
    }
  };

  // 新增清除歷史紀錄功能
  const handleClearHistory = async () => {
    
    if (window.confirm('確定要清除所有歷史紀錄嗎？此操作不可復原。')) {
      try {
        await clearUserHistory();  // 呼叫後端 API 清除歷史
        setHistoryData([]);        // 清空畫面上的資料
        localStorage.removeItem('userHistory');  // 清本地
        alert('歷史紀錄已清除');
        navigate('/', { state: { shouldClearStorage: true } }); // 👈 傳遞狀態
      } catch (error) {
        console.error('清除歷史紀錄失敗:', error);
        alert('清除歷史紀錄失敗，請稍後再試');
      }
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
          <div className="history-table-wrapper">
            <HistoryTable 
              data={historyData} 
              onViewDetails={handleViewDetails}
            />
          </div>
        )}
        <div className="button-container">
          <button className="clear-history-button" onClick={handleClearHistory}>
            清除歷史紀錄
          </button>
          <BackButton text="回到主頁" onClick={handleBackToMain} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
