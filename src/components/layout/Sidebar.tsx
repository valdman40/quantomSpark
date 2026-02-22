import { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Server, Shield, ShieldAlert, Globe, Users, FileText,
  FlaskConical, ChevronRight, Search, ChevronsLeft, X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeMobileSidebar } from '../../app/uiSlice';
import { NAV_CONFIG } from '../../router/navConfig';

// ─── Section icon map (Lucide) ────────────────────────────────────
function SectionIcon({ name }: { name: string }) {
  const props = { size: 16, strokeWidth: 1.8 };
  switch (name) {
    case 'home':             return <Home {...props} />;
    case 'gateway-device':   return <Server {...props} />;
    case 'firewall':         return <Shield {...props} />;
    case 'threat-prevention':return <ShieldAlert {...props} />;
    case 'site-to-site-vpn': return <Globe {...props} />;
    case 'asset-management': return <Users {...props} />;
    case 'logs':             return <FileText {...props} />;
    case 'test':             return <FlaskConical {...props} />;
    default:                 return <Home {...props} />;
  }
}

// ─── Sidebar component ────────────────────────────────────────────
export function Sidebar() {
  const collapsed       = useAppSelector(s => s.ui.sidebarCollapsed);
  const mobileOpen      = useAppSelector(s => s.ui.mobileSidebarOpen);
  const dispatch        = useAppDispatch();
  const location        = useLocation();

  const [search, setSearch]           = useState('');
  const [openSection, setOpenSection] = useState<string | null>(() => {
    for (const section of NAV_CONFIG) {
      if (section.groups.some(g => g.items.some(i => location.pathname.startsWith(i.path)))) {
        return section.label;
      }
    }
    return NAV_CONFIG[0]?.label ?? null;
  });

  // ─── Filtered nav for search ──────────────────────────────────
  const filteredConfig = useMemo(() => {
    if (!search.trim()) return null; // null = show full accordion
    const q = search.toLowerCase();
    const results: { sectionLabel: string; groupLabel: string; label: string; path: string }[] = [];
    for (const section of NAV_CONFIG) {
      for (const group of section.groups) {
        for (const item of group.items) {
          if (
            item.label.toLowerCase().includes(q) ||
            section.label.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q)
          ) {
            results.push({
              sectionLabel: section.label,
              groupLabel: group.label,
              label: item.label,
              path: item.path,
            });
          }
        }
      }
    }
    return results;
  }, [search]);

  const sidebarClass = [
    'sidebar',
    collapsed    ? 'collapsed'    : '',
    mobileOpen   ? 'mobile-open'  : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => dispatch(closeMobileSidebar())}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClass} aria-label="Main navigation">
        {/* Search box */}
        {!collapsed && (
          <div className="nav-search">
            <Search size={13} className="nav-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Filter navigation"
            />
            {search && (
              <button className="nav-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Nav content */}
        <nav className="sidebar-nav">
          {/* ── SEARCH RESULTS MODE ── */}
          {filteredConfig !== null ? (
            filteredConfig.length === 0 ? (
              <div style={{ padding: '16px 14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                No results for "{search}"
              </div>
            ) : (
              filteredConfig.map(item => (
                <div key={item.path}>
                  <div className="nav-search-result-section">
                    {item.sectionLabel} › {item.groupLabel}
                  </div>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-leaf${isActive ? ' active' : ''}`}
                    onClick={() => dispatch(closeMobileSidebar())}
                  >
                    {item.label}
                  </NavLink>
                </div>
              ))
            )
          ) : (
            /* ── ACCORDION MODE ── */
            NAV_CONFIG.map(section => {
              const isOpen   = openSection === section.label;
              const hasActive = section.groups.some(g =>
                g.items.some(i => location.pathname.startsWith(i.path))
              );

              return (
                <div key={section.label} className="nav-toplevel">
                  <div
                    className={[
                      'nav-toplevel-btn',
                      isOpen     ? 'open'       : '',
                      hasActive  ? 'has-active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => {
                      if (collapsed) return; // collapsed mode: click does nothing (icons only)
                      setOpenSection(prev => prev === section.label ? null : section.label);
                    }}
                    title={collapsed ? section.label : undefined}
                    role="button"
                    aria-expanded={isOpen}
                  >
                    <span className="nav-icon">
                      <SectionIcon name={section.icon} />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="nav-label">{section.label}</span>
                        <ChevronRight
                          size={13}
                          className={`nav-chevron${isOpen ? ' open' : ''}`}
                        />
                      </>
                    )}
                  </div>

                  {isOpen && !collapsed && (
                    <div className="nav-section-body">
                      {section.groups.map(group => (
                        <div key={group.label} className="nav-group">
                          <div className="nav-group-header">{group.label}</div>
                          {group.items.map(item => (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              className={({ isActive }) => `nav-leaf${isActive ? ' active' : ''}`}
                              onClick={() => dispatch(closeMobileSidebar())}
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
            })
          )}
        </nav>

        {/* Collapse toggle (desktop only) */}
        {!collapsed && (
          <button
            className="sidebar-collapse-btn"
            onClick={() => {
              setOpenSection(null);
              dispatch({ type: 'ui/toggleSidebar' });
            }}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft size={14} />
          </button>
        )}
      </aside>
    </>
  );
}
