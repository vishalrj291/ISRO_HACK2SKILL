import React from 'react';
import ModelPerformanceCard from '../components/cards/ModelPerformanceCard';
import ModelMetricsChart from '../components/charts/ModelMetricsChart';
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart';
import { MODEL_METRICS, ICE_DETECTION } from '../data/missionData';

export default function ModelInsights() {
  const cm = MODEL_METRICS.confusionMatrix;
  const total = cm.tp + cm.fp + cm.fn + cm.tn;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Model Insights</div>
          <div className="page-subtitle">{MODEL_METRICS.modelName} · LUNARNET ICE CLASSIFIER</div>
        </div>
      </div>
      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          <ModelPerformanceCard data={MODEL_METRICS} />
          <div className="sci-card">
            <div className="sci-card-header"><span className="sci-card-title">Accuracy History</span></div>
            <div className="sci-card-body" style={{ padding: '12px 8px 8px' }}>
              <ModelMetricsChart data={MODEL_METRICS.metricsHistory} height={200} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Confusion matrix */}
          <div className="sci-card">
            <div className="sci-card-header"><span className="sci-card-title">Confusion Matrix</span></div>
            <div className="sci-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'TRUE POSITIVE',  value: cm.tp, color: 'var(--green)' },
                  { label: 'FALSE POSITIVE', value: cm.fp, color: 'var(--red)' },
                  { label: 'FALSE NEGATIVE', value: cm.fn, color: 'var(--amber)' },
                  { label: 'TRUE NEGATIVE',  value: cm.tn, color: 'var(--silver)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 4, padding: '12px 14px' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{(value / total * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature importance */}
          <div className="sci-card">
            <div className="sci-card-header"><span className="sci-card-title">Feature Importance</span></div>
            <div className="sci-card-body" style={{ padding: '12px 8px 8px' }}>
              <FeatureImportanceChart data={ICE_DETECTION.featureImportance} height={200} />
            </div>
          </div>
        </div>

        {/* ROC Curve approximation */}
        <div className="sci-card">
          <div className="sci-card-header">
            <span className="sci-card-title">ROC Curve · AUC = {MODEL_METRICS.rocAuc}</span>
          </div>
          <div className="sci-card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MODEL_METRICS.rocCurve.map((pt, i) => (
                <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-dim)' }}>
                  ({pt.fpr.toFixed(2)}, {pt.tpr.toFixed(2)})
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
              Training set: {MODEL_METRICS.trainingSet}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
