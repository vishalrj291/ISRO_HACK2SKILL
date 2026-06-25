import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileType, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useUploadRaster } from '../../data/hooks/useApi';

const DATASET_TYPES = [
  { value: 'dem',         label: 'DEM — Digital Elevation Model'    },
  { value: 'radar',       label: 'Mini-RF Radar (CPR)'               },
  { value: 'temperature', label: 'Diviner Temperature'               },
  { value: 'psr',         label: 'PSR Mask'                          },
  { value: 'illumination',label: 'Illumination Map'                  },
];

export default function DataUpload({ onUploadComplete }) {
  const [dragOver, setDragOver]   = useState(false);
  const [datasetType, setType]    = useState('dem');
  const [selectedFile, setFile]   = useState(null);
  const inputRef                  = useRef();
  const { upload, loading, error, data: result } = useUploadRaster();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) return;
    const res = await upload(selectedFile);
    if (res && onUploadComplete) {
      onUploadComplete({ type: datasetType, ...res });
    }
  };

  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">Upload Raster Dataset</span>
        <Upload size={13} style={{ color: 'var(--orange)' }} />
      </div>
      <div className="sci-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Dataset type selector */}
        <div>
          <label style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: 5 }}>
            DATASET TYPE
          </label>
          <select
            className="sci-select"
            style={{ width: '100%' }}
            value={datasetType}
            onChange={(e) => setType(e.target.value)}
          >
            {DATASET_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Drop zone */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          style={{ padding: 32 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".tif,.tiff,.geotiff"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Upload size={24} style={{ color: 'var(--text-dim)', margin: '0 auto 10px' }} />
          {selectedFile ? (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Drop GeoTIFF here or click to browse
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                Accepts .tif / .tiff / .geotiff · Max 2 GB
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 4,
            background: 'rgba(194,77,77,0.1)', border: '1px solid rgba(194,77,77,0.3)',
            fontSize: 11, color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace',
          }}>
            <AlertCircle size={12} /> {error}
          </div>
        )}

        {/* Success */}
        {result && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            padding: '8px 12px', borderRadius: 4,
            background: 'rgba(122,168,116,0.1)', border: '1px solid rgba(122,168,116,0.3)',
            fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)' }}>
              <CheckCircle size={12} /> UPLOAD SUCCESSFUL
            </div>
            <div style={{ color: 'var(--text-muted)' }}>FILE ID: {result.file_id}</div>
            <div style={{ color: 'var(--text-dim)' }}>
              {result.rows} × {result.cols} px · {result.bands} band(s) · {result.driver}
            </div>
            {result.crs && <div style={{ color: 'var(--text-dim)' }}>CRS: {result.crs}</div>}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={!selectedFile || loading}
            onClick={handleSubmit}
          >
            {loading
              ? <><Loader size={12} className="animate-spin" /> Uploading…</>
              : <><Upload size={12} /> Upload Raster</>
            }
          </button>
          {selectedFile && (
            <button
              className="btn btn-ghost"
              onClick={() => { setFile(null); }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
