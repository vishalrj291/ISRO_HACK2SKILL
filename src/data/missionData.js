// Mission & scientific data for all components

export const MISSION_META = {
  name: 'CHANDRAYAAN-4 SOUTH POLE ICE SURVEY',
  missionId: 'ISRO-LPS-2024-004',
  region: 'Lunar South Polar Region',
  targetCrater: 'Shackleton–Haworth Complex',
  lat: -89.9,
  lon: 0.0,
  startDate: '2024-08-23',
  status: 'ACTIVE',
  sol: 312,
  roverPosition: { lat: -89.54, lon: -3.21 },
  targetPosition:  { lat: -89.88, lon: 12.44 },
};

export const ICE_DETECTION = {
  overallProbability: 78.4,
  candidateRegions: 14,
  confirmedRegions: 6,
  trend: [
    { sol: 280, prob: 61.2 }, { sol: 285, prob: 65.8 }, { sol: 290, prob: 68.4 },
    { sol: 295, prob: 72.1 }, { sol: 300, prob: 74.3 }, { sol: 305, prob: 76.0 },
    { sol: 310, prob: 77.8 }, { sol: 312, prob: 78.4 },
  ],
  candidateTable: [
    { id: 'R-001', name: 'Shackleton Rim NW',   lat: -89.91, lon: -18.2, prob: 92.3, area: 4.2,  conf: 'HIGH',   depth: 0.8 },
    { id: 'R-002', name: 'Haworth Basin Floor',  lat: -87.42, lon: -5.6,  prob: 87.1, area: 11.7, conf: 'HIGH',   depth: 1.2 },
    { id: 'R-003', name: 'Nobile Ejecta Field',  lat: -85.18, lon: 52.3,  prob: 81.6, area: 6.3,  conf: 'HIGH',   depth: 0.6 },
    { id: 'R-004', name: 'De Gerlache Shadow',   lat: -88.72, lon: -93.0, prob: 76.4, area: 8.9,  conf: 'MED',    depth: 0.9 },
    { id: 'R-005', name: 'Sverdrup Ridge PSR',   lat: -88.03, lon: 157.1, prob: 69.2, area: 3.1,  conf: 'MED',    depth: 0.4 },
    { id: 'R-006', name: 'Cabeus Floor Central', lat: -84.94, lon: -43.2, prob: 64.8, area: 14.5, conf: 'MED',    depth: 1.5 },
    { id: 'R-007', name: 'Amundsen W Shadow',    lat: -84.29, lon: -87.4, prob: 57.3, area: 9.2,  conf: 'LOW',    depth: 0.3 },
    { id: 'R-008', name: 'Idel\'son PSR South',  lat: -81.14, lon: 113.4, prob: 48.9, area: 5.7,  conf: 'LOW',    depth: 0.2 },
  ],
  confidenceDistribution: [
    { range: '0–20%',  count: 2  },
    { range: '20–40%', count: 5  },
    { range: '40–60%', count: 8  },
    { range: '60–80%', count: 14 },
    { range: '80–100%',count: 9  },
  ],
  featureImportance: [
    { feature: 'PSR Coverage',        importance: 0.312 },
    { feature: 'Mini-RF Radar Sig.',  importance: 0.248 },
    { feature: 'Surface Temp (<90K)', importance: 0.181 },
    { feature: 'Crater Morphology',   importance: 0.134 },
    { feature: 'Slope (°)',           importance: 0.089 },
    { feature: 'Albedo Anomaly',      importance: 0.036 },
  ],
  timeline: [
    { date: 'Aug 2024', detections: 3 }, { date: 'Sep 2024', detections: 5 },
    { date: 'Oct 2024', detections: 7 }, { date: 'Nov 2024', detections: 8 },
    { date: 'Dec 2024', detections: 11 },{ date: 'Jan 2025', detections: 12 },
    { date: 'Feb 2025', detections: 14 },
  ],
};

export const HAZARD_DATA = {
  highRisk: 7,
  moderateRisk: 18,
  lowRisk: 31,
  cratersDetected: 142,
  maxSlope: 38.7,
  severityScore: 62,
  categories: [
    { name: 'High Risk',  count: 7,  fill: '#C24D4D' },
    { name: 'Moderate',   count: 18, fill: '#D9A441' },
    { name: 'Low Risk',   count: 31, fill: '#7AA874' },
  ],
  hazardZones: [
    { id: 'HZ-001', type: 'Crater',       severity: 'HIGH',     lat: -89.77, lon: 4.2,   radius: 1.2 },
    { id: 'HZ-002', type: 'Steep Slope',  severity: 'HIGH',     lat: -89.41, lon: -7.1,  radius: 0.8 },
    { id: 'HZ-003', type: 'Boulder Field',severity: 'MODERATE', lat: -89.12, lon: 2.8,   radius: 0.5 },
    { id: 'HZ-004', type: 'Shadow Zone',  severity: 'MODERATE', lat: -89.63, lon: -1.4,  radius: 2.1 },
    { id: 'HZ-005', type: 'Crater',       severity: 'HIGH',     lat: -88.90, lon: 11.3,  radius: 0.9 },
    { id: 'HZ-006', type: 'Crater',       severity: 'LOW',      lat: -88.34, lon: -14.7, radius: 0.4 },
  ],
  slopeDistribution: [
    { range: '0–5°',   area: 28 }, { range: '5–10°',  area: 34 },
    { range: '10–20°', area: 22 }, { range: '20–30°', area: 11 },
    { range: '>30°',   area: 5  },
  ],
};

export const NAVIGATION_DATA = {
  routeDistance: 14.73,
  estimatedTime: 62.4,
  energyConsumption: 84.2,
  safetyScore: 87,
  routeDifficulty: 'MODERATE',
  waypoints: [
    { id: 0, lat: -89.54, lon: -3.21, elev: -1240, type: 'START' },
    { id: 1, lat: -89.59, lon: -1.44, elev: -1185, type: 'WP' },
    { id: 2, lat: -89.63, lon:  0.82, elev: -1098, type: 'WP' },
    { id: 3, lat: -89.70, lon:  3.15, elev: -1024, type: 'WP' },
    { id: 4, lat: -89.76, lon:  6.48, elev:  -987, type: 'WP' },
    { id: 5, lat: -89.81, lon:  9.12, elev:  -943, type: 'WP' },
    { id: 6, lat: -89.88, lon: 12.44, elev:  -891, type: 'END' },
  ],
  elevationProfile: [
    { dist: 0,    elev: -1240 }, { dist: 2.1,  elev: -1215 },
    { dist: 3.8,  elev: -1185 }, { dist: 5.4,  elev: -1148 },
    { dist: 7.2,  elev: -1098 }, { dist: 9.0,  elev: -1024 },
    { dist: 10.6, elev:  -987 }, { dist: 12.1, elev:  -943 },
    { dist: 14.73,elev:  -891 },
  ],
  energyProfile: [
    { dist: 0,    energy: 0  }, { dist: 2.1,  energy: 8  },
    { dist: 3.8,  energy: 18 }, { dist: 5.4,  energy: 29 },
    { dist: 7.2,  energy: 44 }, { dist: 9.0,  energy: 57 },
    { dist: 10.6, energy: 67 }, { dist: 12.1, energy: 76 },
    { dist: 14.73,energy: 84 },
  ],
};

export const MODEL_METRICS = {
  accuracy: 91.4,
  precision: 88.7,
  recall: 93.2,
  f1: 90.9,
  rocAuc: 0.964,
  modelName: 'LunarIceNet-v2.1',
  trainingSet: 'LROC NAC + Mini-RF + LCROSS',
  lastUpdated: '2025-02-14',
  confusionMatrix: {
    tp: 186, fp: 24,
    fn: 14,  tn: 276,
  },
  rocCurve: [
    { fpr: 0.00, tpr: 0.00 }, { fpr: 0.03, tpr: 0.41 },
    { fpr: 0.06, tpr: 0.63 }, { fpr: 0.10, tpr: 0.76 },
    { fpr: 0.15, tpr: 0.84 }, { fpr: 0.22, tpr: 0.89 },
    { fpr: 0.30, tpr: 0.93 }, { fpr: 0.45, tpr: 0.96 },
    { fpr: 0.60, tpr: 0.97 }, { fpr: 0.80, tpr: 0.98 },
    { fpr: 1.00, tpr: 1.00 },
  ],
  metricsHistory: [
    { version: 'v1.0', accuracy: 82.1, f1: 80.4 },
    { version: 'v1.5', accuracy: 86.3, f1: 84.8 },
    { version: 'v2.0', accuracy: 89.7, f1: 88.1 },
    { version: 'v2.1', accuracy: 91.4, f1: 90.9 },
  ],
};

export const TEAM_DATA = [
  {
    id: 1,
    name: 'Divyanshi',
    role: 'ML & Data Science',
    dept: 'Machine Learning Lead',
    focus: ['Ice Detection Modeling', 'Feature Engineering', 'Random Forest & CNN', 'Scientific Data Analysis'],
    avatar: 'DV',
    color: '#7AA874',
  },
  {
    id: 2,
    name: 'Vishal Raj',
    role: 'Full Stack Developer',
    dept: 'Engineering Lead',
    focus: ['React Architecture', 'API Integration', 'Data Pipeline', 'Performance Optimization'],
    avatar: 'VR',
    color: '#F47C20',
  },
  {
    id: 3,
    name: 'Pranjal',
    role: 'UI/UX & Visualization',
    dept: 'Design Lead',
    focus: ['Scientific Interface Design', 'GIS Visualization', 'Interaction Design', 'Data Storytelling'],
    avatar: 'PR',
    color: '#D9A441',
  },
];

export const UPLOAD_HISTORY = [
  { id: 1, name: 'lroc_nac_south_pole_dem.tif',      type: 'GeoTIFF', size: '124.3 MB', date: '2025-02-12', status: 'PROCESSED' },
  { id: 2, name: 'mini_rf_s2_band_ratios.csv',        type: 'CSV',     size: '8.7 MB',  date: '2025-02-10', status: 'PROCESSED' },
  { id: 3, name: 'lcross_impact_spectrum.csv',         type: 'CSV',     size: '2.1 MB',  date: '2025-01-28', status: 'PROCESSED' },
  { id: 4, name: 'crater_database_south_84_90.csv',   type: 'CSV',     size: '5.4 MB',  date: '2025-01-15', status: 'PROCESSED' },
  { id: 5, name: 'psr_illumination_map_2024.tif',     type: 'GeoTIFF', size: '89.2 MB', date: '2024-12-20', status: 'ARCHIVED'  },
];

export const TERRAIN_LAYERS = [
  { id: 'dem',         label: 'Digital Elevation Model', unit: 'm',   range: '-6143 to +10786', source: 'LOLA DEM' },
  { id: 'slope',       label: 'Slope Map',               unit: '°',   range: '0 to 85.4°',     source: 'LOLA slope' },
  { id: 'illumination',label: 'Illumination Map',        unit: '%',   range: '0–100%',         source: 'LROC WAC' },
  { id: 'shadow',      label: 'Permanently Shadowed',    unit: 'hrs', range: 'Annual PSR',     source: 'DIVINER' },
  { id: 'crater',      label: 'Crater Density Map',      unit: '/km²',range: '0 to 4.7',       source: 'CraterTools' },
  { id: 'roughness',   label: 'Surface Roughness',       unit: 'm',   range: '0 to 2.3m RMS',  source: 'LOLA' },
];
