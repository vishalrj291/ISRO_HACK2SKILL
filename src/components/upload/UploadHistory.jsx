import React from 'react';
import { FileText, CheckCircle, Archive } from 'lucide-react';
import { UPLOAD_HISTORY } from '../../data/missionData';

export default function UploadHistory({ uploads = [] }) {
  // Merge API uploads with static history (static as fallback)
  const items = uploads.length > 0 ? uploads : UPLOAD_HISTORY;

  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">Upload History</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-dim)' }}>
          {items.length} files
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Type</th>
              <th>Size</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id || item.file_id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={11} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                      {item.name || item.original_name}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.type || item.driver || 'GeoTIFF'}
                  </span>
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                  {item.size || (item.size_bytes ? `${(item.size_bytes / 1024 / 1024).toFixed(1)} MB` : '—')}
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {item.date || new Date().toLocaleDateString('en-IN')}
                </td>
                <td>
                  <span className={`badge ${item.status === 'PROCESSED' || item.status === 'uploaded' ? 'badge-green' : 'badge-silver'}`}>
                    {item.status === 'PROCESSED' || item.status === 'uploaded'
                      ? <CheckCircle size={9} />
                      : <Archive size={9} />
                    }
                    {item.status || 'UPLOADED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
