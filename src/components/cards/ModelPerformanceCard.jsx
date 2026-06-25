import React from 'react';
import { BrainCircuit } from 'lucide-react';

const MetricRow = ({ label, value, color = 'var(--text-primary)' }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '6px 0', borderBottom: '1px solid var(--border)',
  }}>
    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
      {label}
    </span>
    <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: 'JetBrains Mono, monospace' }}>
      {value}
    </span>
  </div>
);

export default function ModelPerformanceCard({ data }) {
  if (!data) return null;

  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">Model Performance</span>
        <BrainCircuit size={13} style={{ color: 'var(--orange)' }} />
      </div>
      <div className="sci-card-body">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
            {data.modelName}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
            Updated: {data.lastUpdated}
          </div>
        </div>

        <MetricRow label="ACCURACY"  value={`${data.accuracy}%`}   color="var(--orange)" />
        <MetricRow label="PRECISION" value={`${data.precision}%`}  color="var(--text-primary)" />
        <MetricRow label="RECALL"    value={`${data.recall}%`}     color="var(--text-primary)" />
        <MetricRow label="F1 SCORE"  value={`${data.f1}%`}         color="var(--green)" />
        <MetricRow label="ROC AUC"   value={data.rocAuc.toFixed(3)} color="var(--silver)" />

        <div style={{ marginTop: 12, fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          TRAINING: {data.trainingSet}
        </div>
      </div>
    </div>
  );
}
