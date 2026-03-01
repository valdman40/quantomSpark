import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Chip } from '../../../../components/common/Chip';
import { useNetworkObjects } from '../../hooks/useNetworkObjects';
import { useServices } from '../../hooks/useServices';
import { networkIcon, serviceIcon } from './ruleIcons';
import type { NetworkItem, ServiceItem } from '../../../../types/security';

// ── Tab definitions ───────────────────────────────────────────────────────────

const NETWORK_TABS = [
  { key: 'all',     label: 'All' },
  { key: 'host',    label: 'Hosts' },
  { key: 'network', label: 'Networks' },
  { key: 'group',   label: 'Groups' },
  { key: 'vpn',     label: 'VPN' },
] as const;

const SERVICE_TABS = [
  { key: 'service',     label: 'Services' },
  { key: 'application', label: 'Applications' },
] as const;

type NetworkTab = typeof NETWORK_TABS[number]['key'];

function networkTabCategory(item: NetworkItem): NetworkTab {
  const t = item.type ?? '';
  if (t === 'Host')          return 'host';
  if (t.includes('group'))   return 'group';
  if (t.includes('VPN'))     return 'vpn';
  return 'network';
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ObjectPickerProps {
  mode:     'network' | 'service';
  title:    string;
  anchor:   DOMRect;
  selected: NetworkItem[] | ServiceItem[];
  onConfirm(items: NetworkItem[] | ServiceItem[]): void;
  onClose(): void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PICKER_WIDTH  = 440;
const PICKER_HEIGHT = 480;
const PAGE_SIZE     = 25;

// ── Component ─────────────────────────────────────────────────────────────────

export function ObjectPicker({ mode, title, anchor, selected, onConfirm, onClose }: ObjectPickerProps) {
  const { data: networkObjects = [], isLoading: netLoading } = useNetworkObjects();
  const { data: allServices    = [], isLoading: svcLoading } = useServices();

  // ── Seed checked set from current form selection ──────────────────────────
  const [checked, setChecked] = useState<Set<string>>(() => {
    const names = new Set<string>();
    for (const item of selected) {
      if (item.name !== 'Any') names.add(item.name);
    }
    return names;
  });

  const [search,    setSearch]    = useState('');
  const [negate,    setNegate]    = useState(false);
  const [activeTab, setActiveTab] = useState<string>(
    mode === 'network' ? 'all' : 'service'
  );
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the filter changes
  const resetPage = useCallback(() => setPage(1), []);
  useEffect(resetPage, [activeTab, search, resetPage]);

  // ── Close on outside click + Escape ──────────────────────────────────────
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown',   onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown',   onKeyDown);
    };
  }, [onClose]);

  // ── Position: prefer below anchor, flip up if near bottom ────────────────
  const style = useMemo(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top  = anchor.bottom + 6;
    let left = anchor.left;
    if (top + PICKER_HEIGHT > vh - 16) top = anchor.top - PICKER_HEIGHT - 6;
    if (top < 8) top = 8;
    if (left + PICKER_WIDTH > vw - 16) left = vw - PICKER_WIDTH - 16;
    if (left < 8) left = 8;
    return { top, left, width: PICKER_WIDTH };
  }, [anchor]);

  // ── Filtered items (typed per mode to avoid union-array inference issues) ─
  const filteredNetworkItems: NetworkItem[] = useMemo(() => {
    if (mode !== 'network') return [];
    const q = search.toLowerCase();
    return networkObjects.filter((item: NetworkItem) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (activeTab === 'all') return true;
      return networkTabCategory(item) === activeTab;
    });
  }, [mode, activeTab, search, networkObjects]);

  const filteredServiceItems: ServiceItem[] = useMemo(() => {
    if (mode !== 'service') return [];
    const q = search.toLowerCase();
    return allServices.filter((item: ServiceItem) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (activeTab === 'application') return item.appId != null;
      return item.appId == null;
    });
  }, [mode, activeTab, search, allServices]);

  const isLoading    = mode === 'network' ? netLoading : svcLoading;
  const totalCount   = mode === 'network' ? filteredNetworkItems.length : filteredServiceItems.length;
  const totalPages   = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageStart    = (page - 1) * PAGE_SIZE;
  const pageEnd      = Math.min(pageStart + PAGE_SIZE, totalCount);

  const pagedNetItems: NetworkItem[] = filteredNetworkItems.slice(pageStart, pageEnd);
  const pagedSvcItems: ServiceItem[] = filteredServiceItems.slice(pageStart, pageEnd);

  // ── Selected items preview panel ──────────────────────────────────────────
  const selectedNetItems: NetworkItem[] = networkObjects.filter((item: NetworkItem) => checked.has(item.name));
  const selectedSvcItems: ServiceItem[] = allServices.filter((item: ServiceItem)   => checked.has(item.name));

  // ── Toggle logic ──────────────────────────────────────────────────────────
  function toggleAny() { setChecked(new Set()); }

  function toggleItem(name: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  const isAnySelected = checked.size === 0;

  // ── Confirm ───────────────────────────────────────────────────────────────
  function handleSelect() {
    if (checked.size === 0) {
      onConfirm([{ name: 'Any' }]);
    } else if (mode === 'network') {
      onConfirm(networkObjects.filter((i: NetworkItem) => checked.has(i.name)));
    } else {
      onConfirm(allServices.filter((i: ServiceItem) => checked.has(i.name)));
    }
    onClose();
  }

  const tabs        = mode === 'network' ? NETWORK_TABS : SERVICE_TABS;
  const negateLabel = `Any ${title.toLowerCase()} except…`;
  const selectedCount = mode === 'network' ? selectedNetItems.length : selectedSvcItems.length;

  return createPortal(
    <div className="obj-picker" style={style} ref={panelRef} role="dialog" aria-label={`Pick ${title}`}>

      {/* Search */}
      <div className="obj-picker-search-row">
        <Search size={14} className="obj-picker-search-icon" />
        <input
          className="obj-picker-search"
          placeholder="Search…"
          autoFocus
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="obj-picker-tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`obj-picker-tab${activeTab === tab.key ? ' obj-picker-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item list */}
      <div className="obj-picker-list">
        {isLoading ? (
          <div className="obj-picker-loading"><span className="spinner" /> Loading…</div>
        ) : (
          <>
            {/* Any row */}
            <label className="obj-picker-item obj-picker-any">
              <input type="checkbox" checked={isAnySelected} onChange={toggleAny} />
              <span className="obj-picker-any-star">✱</span>
              <span>Any</span>
            </label>

            {mode === 'network'
              ? pagedNetItems.map((item: NetworkItem) => (
                  <label key={item.name} className="obj-picker-item">
                    <input type="checkbox" checked={checked.has(item.name)} onChange={() => toggleItem(item.name)} />
                    <span className="obj-picker-item-icon">{networkIcon(item.iconKey)}</span>
                    <span className="obj-picker-item-name">{item.name}</span>
                    {item.type && <span className="obj-picker-item-type">{item.type}</span>}
                  </label>
                ))
              : pagedSvcItems.map((item: ServiceItem) => (
                  <label key={item.name} className="obj-picker-item">
                    <input type="checkbox" checked={checked.has(item.name)} onChange={() => toggleItem(item.name)} />
                    <span className="obj-picker-item-icon">
                      {item.appId != null
                        ? <img src={`https://sc1.checkpoint.com/za/images/facetime/small_png/${item.appId}_sml.png`} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} />
                        : serviceIcon(item.name)
                      }
                    </span>
                    <span className="obj-picker-item-name">{item.name}</span>
                  </label>
                ))
            }

            {totalCount === 0 && (
              <p className="obj-picker-empty">No items match your search.</p>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="obj-picker-pagination">
        <span className="obj-picker-count">
          {totalCount === 0 ? 'No items' : `${pageStart + 1}–${pageEnd} of ${totalCount}`}
        </span>
        {totalPages > 1 && (
          <div className="obj-picker-page-controls">
            <button
              className="obj-picker-page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              aria-label="Previous page"
            >‹</button>
            <span className="obj-picker-page-label">{page} / {totalPages}</span>
            <button
              className="obj-picker-page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              aria-label="Next page"
            >›</button>
          </div>
        )}
      </div>

      {/* Selected items panel */}
      <div className="obj-picker-selected-hdr">Selected items ({selectedCount})</div>
      <div className="obj-picker-selected-body">
        {selectedCount === 0 ? (
          <p className="obj-picker-selected-empty">There are no selected items.</p>
        ) : (
          <div className="obj-picker-selected-chips">
            {mode === 'network'
              ? selectedNetItems.map((item: NetworkItem) => (
                  <Chip key={item.name} label={item.name} icon={networkIcon(item.iconKey)} onRemove={() => toggleItem(item.name)} />
                ))
              : selectedSvcItems.map((item: ServiceItem) => (
                  <Chip key={item.name} label={item.name}
                    icon={item.appId != null
                      ? <img src={`https://sc1.checkpoint.com/za/images/facetime/small_png/${item.appId}_sml.png`} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} />
                      : serviceIcon(item.name)
                    }
                    onRemove={() => toggleItem(item.name)}
                  />
                ))
            }
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="obj-picker-footer">
        <label className="obj-picker-negate">
          <input type="checkbox" checked={negate} onChange={e => setNegate(e.target.checked)} />
          <span>{negateLabel}</span>
        </label>
        <div className="obj-picker-footer-actions">
          <Button size="sm" variant="ghost" type="button" disabled title="Not yet implemented">Import</Button>
          <Button size="sm" variant="ghost" type="button" disabled title="Not yet implemented">Add</Button>
          <Button size="sm" variant="primary" type="button" onClick={handleSelect}>Select</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
