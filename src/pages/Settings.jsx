import React, { useState } from 'react';
import { API_BASE } from '../data/hooks/useApi';

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(API_BASE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">SYSTEM CONFIGURATION · API · DISPLAY</div>
        </div>
      </div>
      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>

        <div className="sci-card">
          <div className="sci-card-header"><span className="sci-card-title">Backend API</span></div>
          <div className="sci-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: 5 }}>
                API BASE URL
              </label>
              <input
                className="sci-input"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                Set VITE_API_URL in .env to persist. Default: http://localhost:8000
              </div>
            </div>
            <div style={{ padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 4, border: '1px solid var(--border)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
              <div style={{ color: 'var(--text-dim)', marginBottom: 4 }}>ENDPOINTS</div>
              {['/api/health', '/api/upload-raster', '/api/analyze-dem', '/api/detect-landing-sites', '/api/ice-probability', '/api/hazard-map', '/api/plan-route'].map((ep) => (
                <div key={ep} style={{ color: 'var(--orange)', marginBottom: 2 }}>{apiUrl}{ep}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="sci-card">
          <div className="sci-card-header"><span className="sci-card-title">Analysis Defaults</span></div>
          <div className="sci-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'SAFE SLOPE THRESHOLD',      value: '7°' },
              { label: 'MIN ILLUMINATION',          value: '40%' },
              { label: 'MAX ROUGHNESS (TRI)',       value: '5 m' },
              { label: 'MAX PASSABLE SLOPE (A*)',   value: '30°' },
              { label: 'ICE SCORE THRESHOLD',       value: '0.60' },
              { label: 'MOON RADIUS',               value: '1 737 400 m' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
