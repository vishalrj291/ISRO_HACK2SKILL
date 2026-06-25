import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Dashboard       from './pages/Dashboard';
import TerrainAnalysis from './pages/TerrainAnalysis';
import IceDetection    from './pages/IceDetection';
import HazardAssessment from './pages/HazardAssessment';
import PathPlanning    from './pages/PathPlanning';
import DataLayers      from './pages/DataLayers';
import ModelInsights   from './pages/ModelInsights';
import MissionReports  from './pages/MissionReports';
import UploadDataset   from './pages/UploadDataset';
import Team            from './pages/Team';
import Settings        from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/terrain"        element={<TerrainAnalysis />} />
          <Route path="/ice-detection"  element={<IceDetection />} />
          <Route path="/hazard"         element={<HazardAssessment />} />
          <Route path="/path-planning"  element={<PathPlanning />} />
          <Route path="/data-layers"    element={<DataLayers />} />
          <Route path="/model-insights" element={<ModelInsights />} />
          <Route path="/reports"        element={<MissionReports />} />
          <Route path="/upload"         element={<UploadDataset />} />
          <Route path="/team"           element={<Team />} />
          <Route path="/settings"       element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
