import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import { getSpeciesFeatures } from '../utils/api';
import './FeaturePage.css';

const SpeciesFeaturePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featureImages, setFeatureImages] = useState({
    pseudoIonImage: null,
    msSpectrumImage: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // 加載特徵圖像
    const loadFeatureImages = async () => {
      try {
        const analysisId = localStorage.getItem('currentAnalysisId');
        if (!analysisId) {
          navigate('/');
          return;
        }

        const features = await getSpeciesFeatures(analysisId);
        setFeatureImages({
          pseudoIonImage: features.pseudoIonImage,
          msSpectrumImage: features.msSpectrumImage
        });
        setLoading(false);
      } catch (error) {
        console.error('載入特徵圖像失敗:', error);
        alert('載入特徵圖像失敗，請重試');
        navigate('/species-result');
      }
    };

    // 使用模擬數據進行開發
    const loadMockImages = () => {
      // 實際應用中，這些URL會從API獲取
      setFeatureImages({
        pseudoIonImage: '/mock-data/pseudo-ion-image.png',
        msSpectrumImage: '/mock-data/ms-spectrum-image.png'
      });
      setLoading(false);
    };

    // 在開發階段使用模擬數據
    loadMockImages();
    // 實際使用時切換為下面的代碼
    // loadFeatureImages();
  }, [navigate]);

  const handleBackToSpecies = () => {
    navigate('/species-result');
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
    <div className="feature-page">
      <AppBar isLoggedIn={isLoggedIn} />
      
      <div className="feature-content">
        <div className="feature-header">
          <h2>數據菌種判斷 — 模型判斷特徵</h2>
        </div>
        
        <div className="feature-images">
          <div className="image-container">
            <h3>psuedo-ion 對於結果之重要性呈現</h3>
            <img 
              src={featureImages.pseudoIonImage} 
              alt="Pseudo Ion Importance" 
              className="feature-image" 
            />
          </div>
          
          <div className="image-container">
            <h3>MALDI-TOF MS Spectrum (First Sample)</h3>
            <img 
              src={featureImages.msSpectrumImage} 
              alt="MS Spectrum" 
              className="feature-image" 
            />
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="back-button" onClick={handleBackToSpecies}>
            回到上頁
          </button>
          <button className="main-button" onClick={handleBackToMain}>
            回到主頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeciesFeaturePage;