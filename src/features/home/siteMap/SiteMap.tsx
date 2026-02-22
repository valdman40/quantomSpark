import { Link } from 'react-router-dom';
import { NAV_CONFIG } from '../../../router/navConfig';

const EXCLUDED = new Set(['Home', 'Demo']);

export function SiteMap() {
  const sections = NAV_CONFIG.filter(s => !EXCLUDED.has(s.label));

  return (
    <div className="sitemap-grid">
      {sections.map(section => (
        <div key={section.label} className="sitemap-col">
          <div className="sitemap-section-hdr">
            <strong>{section.label}</strong>
          </div>
          {section.groups.map(group => (
            <div key={group.label} className="sitemap-group">
              <div className="sitemap-group-hdr">{group.label}</div>
              {group.items.map(item => (
                <Link key={item.path} to={item.path} className="sitemap-leaf">
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
