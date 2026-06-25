import React, { useState } from 'react';
import DataUpload from '../components/upload/DataUpload';
import UploadHistory from '../components/upload/UploadHistory';

export default function UploadDataset() {
  const [uploads, setUploads] = useState([]);

  const onUpload = (result) => {
    setUploads((prev) => [{
      id: result.file_id,
      name: result.original_name,
      type: result.driver || 'GeoTIFF',
      size: `${(result.size_bytes / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'PROCESSED',
      file_id: result.file_id,
      ...result,
    }, ...prev]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Upload Dataset</div>
          <div className="page-subtitle">GEOTIFF RASTER INGESTION · DEM · RADAR · TEMPERATURE · PSR · ILLUMINATION</div>
        </div>
      </div>
      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ maxWidth: 560 }}>
          <DataUpload onUploadComplete={onUpload} />
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, padding: '12px 16px', maxWidth: 560, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ color: 'var(--orange)', marginBottom: 6, fontSize: 10 }}>SUPPORTED DATASETS</div>
          {[
            'LRO LOLA DEM (.tif) — Digital Elevation Model',
            'Diviner Temperature (.tif) — Brightness temperature',
            'Mini-RF Radar CPR (.tif) — Circular polarisation ratio',
            'Illumination Map (.tif) — Annual illumination fraction',
            'PSR Mask (.tif) — Permanently shadowed region mask',
          ].map((d) => (
            <div key={d} style={{ color: 'var(--text-muted)', marginBottom: 4 }}>› {d}</div>
          ))}
        </div>

        <UploadHistory uploads={uploads} />
      </div>
    </div>
  );
}
