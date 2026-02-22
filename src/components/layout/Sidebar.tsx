import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleSidebar } from '../../app/uiSlice';
import { NAV_CONFIG } from '../../router/navConfig';

// ─── Section icon map ────────────────────────────────────────────
function SectionIcon({ name }: { name: string }) {
  switch (name) {
    case 'home':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      );
    case 'gateway-device':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="10" rx="2"/>
          <circle cx="7" cy="12" r="1.2" fill="currentColor"/>
          <circle cx="11" cy="12" r="1.2" fill="currentColor"/>
          <line x1="17" y1="10" x2="17" y2="14"/>
          <line x1="19" y1="12" x2="15" y2="12"/>
        </svg>
      );
    case 'firewall':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
          <line x1="12" y1="9" x2="12" y2="15"/>
        </svg>
      );
    case 'threat-prevention':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <line x1="12" y1="8" x2="12" y2="13"/>
          <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none"/>
        </svg>
      );
    case 'site-to-site-vpn':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9"/>
          <path d="M3.6 9h16.8M3.6 15h16.8"/>
          <path d="M12 3a12 12 0 010 18M12 3a12 12 0 000 18"/>
        </svg>
      );
    case 'asset-management':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      );
    case 'logs':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      );
    case 'test':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
  }
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`nav-chevron${open ? ' open' : ''}`}
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Sidebar component ───────────────────────────────────────────
export function Sidebar() {
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const dispatch  = useAppDispatch();
  const location  = useLocation();

  // Auto-open the section that contains the current path
  const findActiveSection = (): string | null => {
    for (const section of NAV_CONFIG) {
      for (const group of section.groups) {
        if (group.items.some(item => location.pathname.startsWith(item.path))) {
          return section.label;
        }
      }
    }
    return NAV_CONFIG[0]?.label ?? null;
  };

  const [openSection, setOpenSection] = useState<string | null>(findActiveSection);

  const handleTopLevelClick = (sectionLabel: string) => {
    if (collapsed) {
      // Expand sidebar first, then open the section
      dispatch(toggleSidebar());
      setOpenSection(sectionLabel);
    } else {
      setOpenSection(prev => (prev === sectionLabel ? null : sectionLabel));
    }
  };

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div className="sidebar-logo-text">QUANTUM SPARK</div>
            <div className="sidebar-logo-sub">1500W</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_CONFIG.map(section => {
          const isOpen = openSection === section.label;
          const hasActive = section.groups.some(g =>
            g.items.some(item => location.pathname.startsWith(item.path))
          );

          return (
            <div key={section.label} className="nav-toplevel">
              {/* Top-level clickable row */}
              <div
                className={[
                  'nav-toplevel-btn',
                  isOpen      ? 'open'       : '',
                  hasActive   ? 'has-active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleTopLevelClick(section.label)}
                title={collapsed ? section.label : undefined}
                role="button"
                aria-expanded={isOpen}
              >
                <span className="nav-icon">
                  <SectionIcon name={section.icon} />
                </span>
                <span className="nav-label">{section.label}</span>
                <ChevronIcon open={isOpen} />
              </div>

              {/* Groups + leaves (only when expanded and not collapsed) */}
              {isOpen && !collapsed && (
                <div className="nav-section-body">
                  {section.groups.map(group => (
                    <div key={group.label} className="nav-group">
                      <div className="nav-group-header">{group.label}</div>
                      {group.items.map(item => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `nav-leaf${isActive ? ' active' : ''}`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
