import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import BackButton from '../components/BackButton';
const ResistanceFeaturePage = () => {
  const [speciesData, setSpeciesData] = useState(null); // Add state for species data
  const [resistanceData, setResistanceData] = useState(null); // Add state for resistance data
  const [featureImages, setFeatureImages] = useState({ pseudoIonImage: null, msSpectrumImage: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('analysisData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSpeciesData(parsedData.speciesResult); // Load species data
      setResistanceData(parsedData.resistanceResult); // Load resistance data

      // Assuming the images are also part of the data
      setFeatureImages({
        pseudoIonImage: parsedData.speciesResult.pseudoIonImage || '/images/grad_cam.png', // default fallback
        msSpectrumImage: parsedData.resistanceResult.msSpectrumImage || '/images/spectrum.png' // default fallback
      });
    }
    setLoading(false);
  }, []);

  const handleBackToResistance = () => navigate('/resistance');
  const handleBackToMain = () => navigate('/');

  if (loading) {
    return (
      <div className="loading-container">
        <AppBar />
        <div className="loading">載入中...</div>
      </div>
    );
  }

  if (!speciesData || !resistanceData) {
    return (
      <div className="error-container">
        <AppBar />
        <div className="error-message">無法載入特徵數據</div>
      </div>
    );
  }

  return (
    <div className="feature-page">
      <AppBar />
      <div className="feature-content">
        <h2>抗藥性判斷 — 模型判斷特徵</h2>
        <div className="feature-images">
          <div className="image-container">
            <h3>psuedo-ion 對於結果之重要性呈現</h3>
            {featureImages.pseudoIonImage && <img src={featureImages.pseudoIonImage} alt="Pseudo Ion Importance" className="feature-image" />}
          </div>
          <div className="image-container">
            <h3>MALDI-TOF MS Spectrum (First Sample)</h3>
            {featureImages.msSpectrumImage && <img src={featureImages.msSpectrumImage} alt="MS Spectrum" className="feature-image" />}
          </div>
        </div>
        <div className="action-buttons">
          <button className="back-button" onClick={handleBackToResistance}>回到上頁</button>
          <BackButton text="回到主頁" onClick={handleBackToMain} />
        </div>
      </div>
    </div>
  );
};

export default ResistanceFeaturePage;
