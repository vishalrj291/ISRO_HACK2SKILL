import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Mountain, Snowflake, AlertTriangle,
  Route, Layers, BrainCircuit, FileText, Upload, Users, Settings, Satellite,
} from 'lucide-react';

/**
 * Layout
 * ───────
 * Root shell: 68px icon-only sidebar + 52px dark topbar + scrollable dark content.
 * Mobile: hamburger opens full overlay sidebar.
 */

const NAV_MOBILE = [
  { group: 'MISSION',  items: [
    { to: '/',               icon: LayoutDashboard, label: 'Dashboard'       },
    { to: '/terrain',        icon: Mountain,        label: 'Terrain Analysis' },
  ]},
  { group: 'ANALYSIS', items: [
    { to: '/ice-detection',  icon: Snowflake,       label: 'Ice Detection'    },
    { to: '/hazard',         icon: AlertTriangle,   label: 'Hazard Assessment'},
    { to: '/path-planning',  icon: Route,           label: 'Path Planning'    },
  ]},
  { group: 'DATA',     items: [
    { to: '/data-layers',    icon: Layers,          label: 'Data Layers'      },
    { to: '/model-insights', icon: BrainCircuit,    label: 'Model Insights'   },
  ]},
  { group: 'OPS',      items: [
    { to: '/reports',        icon: FileText,        label: 'Mission Reports'  },
    { to: '/upload',         icon: Upload,          label: 'Upload Dataset'   },
  ]},
  { group: 'SYSTEM',   items: [
    { to: '/team',           icon: Users,           label: 'Team'             },
    { to: '/settings',       icon: Settings,        label: 'Settings'         },
  ]},
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Dark icon-only sidebar — spans full height, hidden on mobile */}
      <aside className="sidebar">
        <Sidebar />
      </aside>

      {/* Minimal top navigation bar */}
      <header className="topbar">
        <TopNavBar onHamburger={() => setMobileOpen(true)} />
      </header>

      {/* Main scrollable content area */}
      <main className="main-content">
        {children}
      </main>

      {/* ── Mobile Sidebar Overlay ─────────────────────── */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`sidebar-mobile${mobileOpen ? ' open' : ''}`}>
        {/* Mobile sidebar header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 64,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6,
              background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(244,124,32,0.30)',
            }}>
              <Satellite size={14} color="#FFFFFF" strokeWidth={1.75} />
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              ISRO MCC
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 4,
              display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Mobile nav items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {NAV_MOBILE.map(({ group, items }) => (
            <div key={group}>
              <div className="sidebar-mobile-group-label">{group}</div>
              {items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `sidebar-mobile-item${isActive ? ' active' : ''}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={15} strokeWidth={1.75} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--green)',
            animation: 'pulse-ring-green 2s infinite',
          }} />
          <span style={{
            fontSize: 9, fontWeight: 700,
            color: 'var(--text-dim)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.10em',
          }}>
            BHARATIYA ANTARIKSH HACKATHON 2024
          </span>
        </div>
      </div>
    </div>
  );
}
