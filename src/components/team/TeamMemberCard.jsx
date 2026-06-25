import React from 'react';
import { Users, Globe, Code } from 'lucide-react';

export default function TeamMemberCard({ member }) {
  return (
    <div className="sci-card" style={{ overflow: 'visible' }}>
      <div className="sci-card-body" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: 6, flexShrink: 0,
          background: member.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 14, fontWeight: 700, color: '#fff',
        }}>
          {member.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 11, color: member.color, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
            {member.role}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 1 }}>
            {member.dept}
          </div>

          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {member.focus.map((f) => (
              <span key={f} className="badge badge-silver" style={{ fontSize: 9 }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
