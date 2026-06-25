/**
 * data/hooks/useApi.js
 * ====================
 * Centralised API client hooks for all backend endpoints.
 * Each hook returns { data, loading, error, execute }.
 * 'execute' is a function that triggers the actual fetch.
 *
 * Base URL is read from VITE_API_URL env var, defaulting to localhost:8000.
 */

import { useState, useCallback } from 'react';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Generic fetch helper ──────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const json = await response.json();
      detail = json.detail || json.message || detail;
    } catch (_) {}
    throw new Error(detail);
  }
  return response.json();
}

// ── useApiCall — generic hook factory ─────────────────────────────────────
function useApiCall() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (fetcher) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute, setData };
}

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────
export function useHealthCheck() {
  const { data, loading, error, execute } = useApiCall();
  const check = useCallback(
    () => execute(() => apiFetch('/api/health')),
    [execute]
  );
  return { data, loading, error, check };
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload raster
// ─────────────────────────────────────────────────────────────────────────────
export function useUploadRaster() {
  const { data, loading, error, execute } = useApiCall();

  const upload = useCallback(
    (file) => {
      const form = new FormData();
      form.append('file', file);
      return execute(() =>
        apiFetch('/api/upload-raster', { method: 'POST', body: form })
      );
    },
    [execute]
  );

  return { data, loading, error, upload };
}

// ─────────────────────────────────────────────────────────────────────────────
// Analyse DEM
// ─────────────────────────────────────────────────────────────────────────────
export function useAnalyseDEM() {
  const { data, loading, error, execute } = useApiCall();

  const analyse = useCallback(
    (fileId, band = 1) => {
      const form = new FormData();
      form.append('file_id', fileId);
      form.append('band', band);
      return execute(() =>
        apiFetch('/api/analyze-dem', { method: 'POST', body: form })
      );
    },
    [execute]
  );

  return { data, loading, error, analyse };
}

// ─────────────────────────────────────────────────────────────────────────────
// Detect landing sites
// ─────────────────────────────────────────────────────────────────────────────
export function useDetectLandingSites() {
  const { data, loading, error, execute } = useApiCall();

  const detect = useCallback(
    ({ demFileId, illuminationFileId = '', nSites = 5, minSepPixels = 50 }) => {
      const form = new FormData();
      form.append('dem_file_id', demFileId);
      form.append('illumination_file_id', illuminationFileId);
      form.append('n_sites', nSites);
      form.append('min_sep_pixels', minSepPixels);
      return execute(() =>
        apiFetch('/api/detect-landing-sites', { method: 'POST', body: form })
      );
    },
    [execute]
  );

  return { data, loading, error, detect };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ice probability
// ─────────────────────────────────────────────────────────────────────────────
export function useIceProbability() {
  const { data, loading, error, execute } = useApiCall();

  const compute = useCallback(
    ({ radarFileId = '', temperatureFileId = '', psrFileId = '', illuminationFileId = '', nCandidates = 10 }) => {
      const form = new FormData();
      form.append('radar_file_id',       radarFileId);
      form.append('temperature_file_id', temperatureFileId);
      form.append('psr_file_id',         psrFileId);
      form.append('illumination_file_id', illuminationFileId);
      form.append('n_candidates',        nCandidates);
      return execute(() =>
        apiFetch('/api/ice-probability', { method: 'POST', body: form })
      );
    },
    [execute]
  );

  return { data, loading, error, compute };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hazard map
// ─────────────────────────────────────────────────────────────────────────────
export function useHazardMap() {
  const { data, loading, error, execute } = useApiCall();

  const generate = useCallback(
    ({ demFileId, shadowFileId = '' }) => {
      const form = new FormData();
      form.append('dem_file_id',    demFileId);
      form.append('shadow_file_id', shadowFileId);
      return execute(() =>
        apiFetch('/api/hazard-map', { method: 'POST', body: form })
      );
    },
    [execute]
  );

  return { data, loading, error, generate };
}

// ─────────────────────────────────────────────────────────────────────────────
// Plan route
// ─────────────────────────────────────────────────────────────────────────────
export function usePlanRoute() {
  const { data, loading, error, execute } = useApiCall();

  const plan = useCallback(
    ({ demFileId, hazardFileId = null, start, goal, slopePenalty = 2.0, hazardPenalty = 5.0 }) => {
      return execute(() =>
        apiFetch('/api/plan-route', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dem_file_id:    demFileId,
            hazard_file_id: hazardFileId,
            start,
            goal,
            slope_penalty:  slopePenalty,
            hazard_penalty: hazardPenalty,
          }),
        })
      );
    },
    [execute]
  );

  return { data, loading, error, plan };
}
