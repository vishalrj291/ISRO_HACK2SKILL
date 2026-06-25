import React from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import { MISSION_META, ICE_DETECTION, HAZARD_DATA, NAVIGATION_DATA } from '../../data/missionData';

export default function ReportGenerator({ analysisData = {} }) {
  const { dem, ice, hazard, route } = analysisData;
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const printReport = () => window.print();

  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">Mission Report Generator</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 10 }} onClick={printReport}>
            <Printer size={11} /> Print
          </button>
          <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: 10 }}>
            <Download size={11} /> Export PDF
          </button>
        </div>
      </div>
      <div className="sci-card-body" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>

        {/* Header block */}
        <div style={{
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          borderRadius: 4, padding: '12px 16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>
            ISRO LUNAR SOUTH POLE MISSION REPORT
          </div>
          <div style={{ color: 'var(--text-dim)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
            <span>MISSION ID: {MISSION_META.missionId}</span>
            <span>REGION: {MISSION_META.region}</span>
            <span>TARGET: {MISSION_META.targetCrater}</span>
            <span>GENERATED: {ts}</span>
            <span>STATUS: <span style={{ color: 'var(--green)' }}>{MISSION_META.status}</span></span>
            <span>SOL: {MISSION_META.sol}</span>
          </div>
        </div>

        {/* Section: Terrain */}
        <ReportSection title="TERRAIN ANALYSIS">
          <Row label="Avg Slope"    value={dem?.average_slope_deg != null ? `${dem.average_slope_deg.toFixed(2)}°` : '—'} />
          <Row label="Max Slope"    value={dem?.maximum_slope_deg != null ? `${dem.maximum_slope_deg.toFixed(2)}°` : '—'} />
          <Row label="Safe Area"    value={dem?.safe_area_percent != null ? `${dem.safe_area_percent}%` : '—'} />
          <Row label="Avg Elevation" value={dem?.average_elevation_m != null ? `${dem.average_elevation_m.toFixed(1)} m` : '—'} />
          <Row label="Roughness"    value={dem?.average_roughness_m != null ? `${dem.average_roughness_m.toFixed(3)} m` : '—'} />
        </ReportSection>

        {/* Section: Ice */}
        <ReportSection title="ICE DETECTION">
          <Row label="Ice Probability" value={ice?.average_ice_probability != null ? `${(ice.average_ice_probability * 100).toFixed(1)}%` : `${ICE_DETECTION.overallProbability}%`} highlight />
          <Row label="Candidates"      value={ice?.top_candidate_regions?.length ?? ICE_DETECTION.candidateRegions} />
          <Row label="High Prob. Area" value={ice?.high_probability_area_pct != null ? `${ice.high_probability_area_pct.toFixed(1)}%` : '—'} />
        </ReportSection>

        {/* Section: Hazard */}
        <ReportSection title="HAZARD ASSESSMENT">
          <Row label="Hazard Score"  value={hazard?.hazard_score != null ? `${(hazard.hazard_score * 100).toFixed(0)}/100` : `${HAZARD_DATA.severityScore}/100`} />
          <Row label="High Risk"     value={hazard?.high_risk_area_pct   != null ? `${hazard.high_risk_area_pct.toFixed(1)}%`   : `${HAZARD_DATA.highRisk} zones`} />
          <Row label="Medium Risk"   value={hazard?.medium_risk_area_pct != null ? `${hazard.medium_risk_area_pct.toFixed(1)}%` : `${HAZARD_DATA.moderateRisk} zones`} />
          <Row label="Max Slope"     value={dem?.maximum_slope_deg != null ? `${dem.maximum_slope_deg.toFixed(1)}°` : `${HAZARD_DATA.maxSlope}°`} />
        </ReportSection>

        {/* Section: Navigation */}
        <ReportSection title="NAVIGATION">
          <Row label="Route Distance" value={route?.total_distance_m != null ? `${(route.total_distance_m / 1000).toFixed(2)} km` : `${NAVIGATION_DATA.routeDistance} km`} />
          <Row label="Safety Score"   value={route?.safety_score != null ? `${(route.safety_score * 100).toFixed(0)}%` : `${NAVIGATION_DATA.safetyScore}%`} highlight />
          <Row label="Path Steps"     value={route?.path_length_steps ?? '—'} />
          <Row label="Energy"         value={route?.estimated_energy != null ? route.estimated_energy.toFixed(1) : `${NAVIGATION_DATA.energyConsumption}`} />
        </ReportSection>
      </div>
    </div>
  );
}

function ReportSection({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 9, letterSpacing: '0.12em', color: 'var(--orange)',
        marginBottom: 6, paddingBottom: 4,
        borderBottom: '1px solid var(--border)',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '3px 0', borderBottom: '1px solid rgba(42,51,64,0.4)',
    }}>
      <span style={{ color: 'var(--text-dim)' }}>{label}</span>
      <span style={{ color: highlight ? 'var(--orange)' : 'var(--text-primary)', fontWeight: highlight ? 600 : 400 }}>
        {value}
      </span>
    </div>
  );
}
