import React from 'react';
import ReportGenerator from '../components/reports/ReportGenerator';

export default function MissionReports() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Mission Reports</div>
          <div className="page-subtitle">AUTOMATED ANALYSIS REPORT · ISRO LSPS</div>
        </div>
      </div>
      <div className="page-body flex-1 overflow-y-auto">
        <ReportGenerator />
      </div>
    </div>
  );
}
