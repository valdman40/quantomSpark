import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleSidebar } from '../../app/uiSlice';
import { StatusDot } from '../common/StatusDot';

export function TopBar() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger */}
        <button className="hamburger-btn" onClick={() => dispatch(toggleSidebar())} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <HamburgerIcon />
        </button>

        <div className="topbar-divider" />

        {/* Device */}
        <div className="topbar-brand">
          <div className="topbar-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div className="topbar-device-name">QS-1500W-Primary</div>
            <div className="topbar-model">Quantum Spark 1500W · R81.20.10</div>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {/* System status */}
        <div className="topbar-status-row">
          <StatusDot color="green" label="Threat Prevention" />
          <div className="topbar-divider" />
          <StatusDot color="green" label="HA Active" />
        </div>

        <div className="topbar-divider" />

        {/* Admin */}
        <div className="topbar-user">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>admin</span>
        </div>

        {/* Help */}
        <button className="topbar-icon-btn" title="Help">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
      </div>
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
