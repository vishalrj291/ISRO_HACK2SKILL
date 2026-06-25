import React from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';

/**
 * Layout
 * ───────
 * Root shell: 72px icon-only sidebar + 48px compact topbar + scrollable content.
 *
 * CSS Grid:
 *   Columns: 72px | 1fr
 *   Rows:    48px | 1fr
 *
 * Sidebar spans both rows (col 1, row 1/-1).
 * TopBar sits in row 1, col 2.
 * Children render in row 2, col 2.
 */
export default function Layout({ children }) {
  return (
    <div className="app-shell">
      {/* Dark icon-only sidebar — spans full height */}
      <aside className="sidebar">
        <Sidebar />
      </aside>

      {/* Minimal top navigation bar */}
      <header className="topbar">
        <TopNavBar />
      </header>

      {/* Main scrollable content area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
