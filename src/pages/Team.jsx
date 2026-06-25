import React from 'react';
import TeamMemberCard from '../components/team/TeamMemberCard';
import { TEAM_DATA, MISSION_META } from '../data/missionData';

export default function Team() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Team</div>
          <div className="page-subtitle">BHARATIYA ANTARIKSH HACKATHON 2024 · ISRO LSPS</div>
        </div>
      </div>
      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, padding: '12px 16px' }}>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>MISSION</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{MISSION_META.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{MISSION_META.missionId} · {MISSION_META.region}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
          {TEAM_DATA.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
