import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SpeciesResultPage from './pages/SpeciesResultPage';
import SpeciesFeaturePage from './pages/SpeciesFeaturePage';
import ResistancePage from './pages/ResistancePage';
import ResistanceFeaturePage from './pages/ResistanceFeaturePage';
import HistoryPage from './pages/HistoryPage';
import { AnalysisProvider } from './context/AnalysisContext'; // ✅ 引入全域 context

function App() {
  return (
    <AnalysisProvider> {/* ✅ 包住整個 app 提供 context */}
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/species-result" element={<SpeciesResultPage />} />
          <Route path="/species-feature" element={<SpeciesFeaturePage />} />
          <Route path="/resistance" element={<ResistancePage />} />
          <Route path="/resistance-feature" element={<ResistanceFeaturePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Router>
    </AnalysisProvider>
  );
}

export default App;
