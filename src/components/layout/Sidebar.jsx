import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mountain,
  Snowflake,
  AlertTriangle,
  Route,
  Layers,
  BrainCircuit,
  FileText,
  Upload,
  Users,
  Settings,
  Satellite,
} from 'lucide-react';

/* ── Navigation groups ──────────────────────────────────── */
const NAV = [
  {
    group: 'MISSION',
    items: [
      { to: '/',               icon: LayoutDashboard, label: 'Dashboard'       },
      { to: '/terrain',        icon: Mountain,        label: 'Terrain Analysis' },
    ],
  },
  {
    group: 'ANALYSIS',
    items: [
      { to: '/ice-detection',  icon: Snowflake,       label: 'Ice Detection'    },
      { to: '/hazard',         icon: AlertTriangle,   label: 'Hazard Assessment'},
      { to: '/path-planning',  icon: Route,           label: 'Path Planning'    },
    ],
  },
  {
    group: 'DATA',
    items: [
      { to: '/data-layers',    icon: Layers,          label: 'Data Layers'      },
      { to: '/model-insights', icon: BrainCircuit,    label: 'Model Insights'   },
    ],
  },
  {
    group: 'OPS',
    items: [
      { to: '/reports',        icon: FileText,        label: 'Mission Reports'  },
      { to: '/upload',         icon: Upload,          label: 'Upload Dataset'   },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { to: '/team',           icon: Users,           label: 'Team'             },
      { to: '/settings',       icon: Settings,        label: 'Settings'         },
    ],
  },
];

export default function Sidebar() {
  return (
    <nav className="sidebar-nav">
      {/* ── Logo mark ──────────────────────────────────── */}
      <div className="sidebar-logo" title="ISRO Mission Control">
        <div className="sidebar-logo-inner">
          <Satellite size={18} color="#FFFFFF" strokeWidth={1.75} />
        </div>
      </div>

      {/* ── Nav groups ─────────────────────────────────── */}
      <div style={{ flex: 1, width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map(({ group, items }) => (
          <div key={group} className="sidebar-group">
            {items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                data-label={label}
                className={({ isActive }) =>
                  `sidebar-item${isActive ? ' active' : ''}`
                }
              >
                <Icon size={18} strokeWidth={1.75} />
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* ── Bottom badge ───────────────────────────────── */}
      <div
        style={{
          padding: '12px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
        title="ISRO · Bharatiya Antariksh Hackathon 2024"
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'rgba(244,124,32,0.12)',
            border: '1px solid rgba(244,124,32,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: 'var(--sidebar-active)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1,
            }}
          >
            ISRO
          </span>
        </div>
      </div>
    </nav>
  );
}
