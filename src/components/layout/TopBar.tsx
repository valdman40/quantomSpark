import { useState } from 'react';
import {
  Menu, Search, Mail, Network, Settings, User,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleSidebar, toggleMobileSidebar } from '../../app/uiSlice';
import { CheckPointLogo } from '../../assets/CheckPointLogo';

export function TopBar() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const [search, setSearch] = useState('');

  return (
    <header className="topbar">
      {/* Left: hamburger + brand */}
      <div className="topbar-left">
        <button
          className="topbar-icon-btn hamburger-btn"
          onClick={() => {
            // On mobile toggle the overlay; on desktop toggle collapse
            if (window.innerWidth <= 768) {
              dispatch(toggleMobileSidebar());
            } else {
              dispatch(toggleSidebar());
            }
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        {/* Quantum Spark brand mark */}
        <div className="topbar-brand">
          {/* Orange spark/flame icon */}
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#f97316" />
            <path
              d="M16 6 C16 6 22 12 20 17 C20 17 18 14 14 15 C14 15 18 18 16 26 C16 26 9 20 11 14 C11 14 13 17 15 16 C15 16 12 11 16 6Z"
              fill="#fff"
            />
          </svg>
          <span className="topbar-brand-name">Quantum Spark</span>
        </div>

        {/* Device chip */}
        <div className="topbar-device-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="10" rx="2"/>
            <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/>
            <circle cx="11" cy="12" r="1" fill="currentColor" stroke="none"/>
          </svg>
          <span>Gateway-ID-569EFED1</span>
        </div>
      </div>

      {/* Center: global search */}
      <div className="topbar-search">
        <Search size={14} className="topbar-search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Global search"
        />
      </div>

      {/* Right: action icons + CP logo */}
      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Notifications">
          <Mail size={16} />
        </button>
        <button className="topbar-icon-btn" title="Connections">
          <Network size={16} />
        </button>
        <button className="topbar-icon-btn" title="Settings">
          <Settings size={16} />
        </button>
        <button className="topbar-icon-btn" title="Account">
          <User size={16} />
        </button>

        <div className="topbar-divider" />
        <CheckPointLogo variant="light" size={20} />
      </div>
    </header>
  );
}
