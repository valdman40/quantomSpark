import { useState, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { AlertTriangle, RefreshCw, ShieldOff } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { openEditRule, setFocusedRule } from '../../securitySlice';
import { addNotification } from '../../../../app/uiSlice';
import { useFirewallRules } from '../../hooks/useFirewallRules';
import { queryClient } from '../../../../app/queryClient';
import { queryKeys } from '../../../../services/queryKeys';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Button } from '../../../../components/common/Button';
import { Modal } from '../../../../components/common/Modal';
import { RuleForm } from './RuleForm';
import { DraggableRuleRow } from './DraggableRuleRow';
import type { FirewallRule } from '../../../../types/security';

// Stable fallback reference — prevents useEffect([serverRules]) from firing on every
// render when the query has no data yet (a new `[]` literal each render would do that).
const EMPTY_RULES: FirewallRule[] = [];

// ── Section label maps ───────────────────────────────────────────────────────

const ZONE_LABELS: Record<string, string> = {
  'ZONE.OUTGOING':          'Outgoing Internet Access',
  'ZONE.INTERNAL_INCOMING': 'Incoming, Internal and VPN Traffic',
};

const ORIGIN_LABELS: Record<string, string> = {
  'RULE_ORIGIN.SMP_PRE':   'SMP Pre-Policy Rules',
  'RULE_ORIGIN.MANUAL':    'Policy Rules',
  'RULE_ORIGIN.SMP_POST':  'SMP Post-Policy Rules',
  'RULE_ORIGIN.GENERATED': 'Auto Generated Rules',
  'RULE_ORIGIN.IOT':       'IoT Rules',
};

type DisplayItem =
  | { kind: 'zone';   key: string; label: string; collapsed: boolean }
  | { kind: 'origin'; key: string; label: string; collapsed: boolean }
  | { kind: 'rule';   rule: FirewallRule };

function buildDisplayItems(
  rules: FirewallRule[],
  collapsedZones: Set<string>,
  collapsedOrigins: Set<string>,
): DisplayItem[] {
  const items: DisplayItem[] = [];
  let lastZone   = '';
  let lastOrigin = '';

  for (const rule of rules) {
    const zone      = rule.zone   ?? '';
    const origin    = rule.origin ?? '';
    const zoneKey   = `zone-${zone}`;
    const originKey = `origin-${zone}-${origin}`;

    if (zone !== lastZone) {
      const label = ZONE_LABELS[zone];
      if (label) items.push({ kind: 'zone', key: zoneKey, label, collapsed: collapsedZones.has(zoneKey) });
      lastZone   = zone;
      lastOrigin = '';
    }

    // Zone collapsed — skip everything inside it
    if (collapsedZones.has(zoneKey)) continue;

    if (origin !== lastOrigin) {
      const label = ORIGIN_LABELS[origin];
      if (label) items.push({ kind: 'origin', key: originKey, label, collapsed: collapsedOrigins.has(originKey) });
      lastOrigin = origin;
    }

    // Origin collapsed — skip rules inside it
    if (ORIGIN_LABELS[origin] && collapsedOrigins.has(originKey)) continue;

    items.push({ kind: 'rule', rule });
  }
  return items;
}

// ── New Rule Dropdown ────────────────────────────────────────────────────────

type NewPosition = 'top' | 'bottom' | 'above' | 'below';

interface NewRuleDropdownProps {
  focusedRuleId: string | null;
  onSelect: (position: NewPosition) => void;
}

function NewRuleDropdown({ focusedRuleId, onSelect }: NewRuleDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const items: { position: NewPosition; label: string; disabled?: boolean }[] = [
    { position: 'top',    label: 'Top Rule' },
    { position: 'bottom', label: 'Bottom Rule' },
    { position: 'above',  label: 'Above Selected', disabled: !focusedRuleId },
    { position: 'below',  label: 'Below Selected', disabled: !focusedRuleId },
  ];

  return (
    <div className="new-rule-dropdown" ref={ref}>
      <Button
        variant="primary"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        ✦ New &nbsp;▾
      </Button>
      {open && (
        <div className="new-rule-dropdown-menu" role="menu">
          {items.map(item => (
            <button
              key={item.position}
              className="new-rule-dropdown-item"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                onSelect(item.position);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function RuleTable() {
  const dispatch = useAppDispatch();
  const { ruleModalOpen, selectedRuleId, newRuleGatewayDefaults, focusedRuleId, policyInstall, lastSavedRuleId } =
    useAppSelector(s => s.security);
  const { data: serverRules = EMPTY_RULES, isLoading, isRefetching, isError, error, refetch } = useFirewallRules();

  // ── Local ordered copy for instant visual feedback ──────────
  const [orderedRules, setOrderedRules] = useState<FirewallRule[]>(serverRules);
  const [pendingReorder, setPendingReorder] = useState(false);

  // Sync from server whenever data changes (rule added/deleted/server refresh).
  // ZONE.NONE rules are structural/internal — strip them from the visible list.
  useEffect(() => {
    setOrderedRules(serverRules.filter(r => r.zone !== 'ZONE.NONE'));
    setPendingReorder(false);
  }, [serverRules]);

  // ── Row highlight (create or edit) ──────────────────────────
  // Two separate effects to avoid a timer-cancellation bug:
  // If both "consume lastSavedRuleId" and "manage the timer" lived in one effect,
  // any side-effect that changes lastSavedRuleId (e.g. clearSavedRuleId dispatch)
  // would re-run the effect, causing its own cleanup to cancel the timer.
  const [highlightedRuleId, setHighlightedRuleId] = useState<string | null>(null);

  // Effect 1 — copy Redux value into local state (no timer, no cleanup side-effects).
  useEffect(() => {
    if (lastSavedRuleId) setHighlightedRuleId(lastSavedRuleId);
  }, [lastSavedRuleId]);

  // Effect 2 — own the 2.4s timer; its cleanup only fires when highlightedRuleId
  // changes (next save), NOT due to unrelated Redux changes.
  useEffect(() => {
    if (!highlightedRuleId) return;
    const timer = setTimeout(() => setHighlightedRuleId(null), 2400);
    return () => clearTimeout(timer);
  }, [highlightedRuleId]);

  // ── Section collapse state ───────────────────────────────────
  const [collapsedZones,   setCollapsedZones]   = useState<Set<string>>(new Set());
  const [collapsedOrigins, setCollapsedOrigins] = useState<Set<string>>(new Set());

  function toggleZone(key: string) {
    setCollapsedZones(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function toggleOrigin(key: string) {
    setCollapsedOrigins(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  // The id of the rule currently being dragged (drives DragOverlay)
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeRule = orderedRules.find(r => r.id === activeId) ?? null;

  // The id of the rule the dragged item is hovering over
  const [overId, setOverId] = useState<string | null>(null);

  // Legal = dragged rule and hovered rule share the same zone + origin
  const isDragLegal: boolean | null = useMemo(() => {
    if (!activeId || !overId) return null;
    const draggedRule = orderedRules.find(r => r.id === activeId);
    const overRule    = orderedRules.find(r => r.id === overId);
    if (!draggedRule || !overRule) return null;
    return (
      (draggedRule.zone   ?? '') === (overRule.zone   ?? '') &&
      (draggedRule.origin ?? '') === (overRule.origin ?? '')
    );
  }, [activeId, overId, orderedRules]);

  // ── Sensors ─────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 6px movement before a drag starts — prevents accidental drags on clicks
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Handlers ────────────────────────────────────────────────
  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
    setOverId(null);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId((over?.id as string) ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    // Block cross-section drops
    if (isDragLegal === false) {
      dispatch(addNotification({ type: 'error', message: 'Rules cannot be moved between different zones or policy sections.' }));
      return;
    }

    setOrderedRules(prev => {
      const fromPos = prev.findIndex(r => r.id === active.id);
      const toPos   = prev.findIndex(r => r.id === over.id);

      // Reassign `number` to match the new visual position (1-based)
      const reordered = arrayMove(prev, fromPos, toPos)
        .map((rule, i) => ({ ...rule, number: i + 1 }));

      const moved = reordered[toPos];

      // Compute fractional idx midpoint between neighbours in the same section
      const section   = reordered.filter(r =>
        (r.zone   ?? '') === (moved.zone   ?? '') &&
        (r.origin ?? '') === (moved.origin ?? ''));
      const posInSect = section.findIndex(r => r.id === moved.id);
      const prev2     = section[posInSect - 1] ?? null;
      const next2     = section[posInSect + 1] ?? null;

      let newFracIdx: number;
      if (prev2 && next2) newFracIdx = ((prev2.idx ?? 0) + (next2.idx ?? (prev2.idx ?? 0) + 2)) / 2;
      else if (prev2)     newFracIdx = (prev2.idx ?? 0) + 1;
      else if (next2)     newFracIdx = (next2.idx ?? 2) / 2;
      else                newFracIdx = 1;

      reordered[toPos] = { ...reordered[toPos], idx: newFracIdx };

      // ① Optimistic: update the React Query cache immediately
      queryClient.setQueryData<FirewallRule[]>(
        queryKeys.security.rules(),
        reordered
      );

      // ② Persist via saga — rolls back on network error
      dispatch({
        type: 'security/reorderRules',
        payload: { ruleIds: reordered.map(r => r.id), movedRuleId: moved.id, newIdx: newFracIdx },
      });

      setPendingReorder(true);
      return reordered;
    });
  }

  function handleDragCancel() {
    setActiveId(null);
    setOverId(null);
  }

  // ── Row callbacks ────────────────────────────────────────────
  const onEdit   = (id: string) => dispatch(openEditRule(id));
  const onDelete = (id: string) => dispatch({ type: 'security/deleteRule', payload: id });
  const onFocus  = (id: string) => dispatch(setFocusedRule(id));

  function handleNewRule(position: NewPosition) {
    dispatch({
      type: 'security/openNewRule',
      payload: { position, focusedRuleId },
    });
  }

  const installing = policyInstall.status === 'installing';
  const selected   = orderedRules.find(r => r.id === selectedRuleId);

  // Only pass visible rule IDs to SortableContext — collapsed sections hide rows but their
  // IDs would still be in orderedRules. dnd-kit requires every id in `items` to have a
  // registered droppable element; missing ones break collision detection.
  const displayItems = buildDisplayItems(orderedRules, collapsedZones, collapsedOrigins);
  const sortableIds  = displayItems.filter(i => i.kind === 'rule').map(i => i.rule.id);

  return (
    <div className="fw-page">
      <PageHeader
        title="Firewall Rules"
        subtitle="Access control policy — drag rows to reorder, then install policy"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => refetch()}
              loading={isRefetching}
              title="Reload rules from gateway"
            >
              <RefreshCw size={13} style={{ marginRight: isRefetching ? 0 : 5 }} />
              {!isRefetching && 'Refresh'}
            </Button>
            <Button
              variant="secondary"
              disabled={!focusedRuleId}
              onClick={() => focusedRuleId && onEdit(focusedRuleId)}
              title={focusedRuleId ? 'Edit selected rule' : 'Click a rule row to select it first'}
            >
              ✎ Edit
            </Button>
            <Button
              variant="secondary"
              disabled={!focusedRuleId}
              onClick={() => focusedRuleId && onDelete(focusedRuleId)}
              title={focusedRuleId ? 'Delete selected rule' : 'Click a rule row to select it first'}
            >
              🗑 Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: 'security/installPolicy' })}
              loading={installing}
            >
              {installing
                ? `Installing… ${policyInstall.progress ?? 0}%`
                : '▶ Install Policy'}
            </Button>
            <NewRuleDropdown focusedRuleId={focusedRuleId} onSelect={handleNewRule} />
          </>
        }
      />

      {/* Policy install progress bar */}
      {policyInstall.status === 'installing' && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
            <span>Installing policy…</span>
            <span>{policyInstall.progress}%</span>
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${policyInstall.progress}%` }} />
          </div>
        </div>
      )}

      {/* Pending-reorder hint */}
      {pendingReorder && policyInstall.status !== 'installing' && (
        <div className="reorder-hint">
          <span>⚠</span>
          <span>Rule order changed — click <strong>Install Policy</strong> to apply to traffic.</span>
          <Button
            size="sm"
            variant="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => dispatch({ type: 'security/installPolicy' })}
          >
            Install Now
          </Button>
        </div>
      )}

      <div className="fw-page-body">
      {isLoading ? (
        <div className="loading-box"><span className="spinner" /><span>Loading rules…</span></div>
      ) : isError ? (
        <div className="error-state">
          <ShieldOff size={40} className="error-state-icon" />
          <h3 className="error-state-title">Failed to load firewall rules</h3>
          <p className="error-state-msg">
            {(error as Error)?.message ?? 'An unexpected error occurred while contacting the gateway.'}
          </p>
          <div className="error-state-actions">
            <Button variant="primary" onClick={() => refetch()}>
              <RefreshCw size={14} style={{ marginRight: 6 }} />
              Try Again
            </Button>
            <span className="error-state-hint">
              <AlertTriangle size={13} />
              Check that the gateway is reachable and your session cookie is valid.
            </span>
          </div>
        </div>
      ) : (
        <div className="card">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="card-table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }} aria-label="Drag handle" />
                    <th style={{ width: 36 }}>#</th>
                    <th>Name</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Service</th>
                    <th>Action</th>
                    <th>Track</th>
                    <th>Status</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <SortableContext
                    items={sortableIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {displayItems.map(item => {
                      if (item.kind === 'zone') return (
                        <tr key={item.key} className="fw-zone-header" onClick={() => toggleZone(item.key)}>
                          <td colSpan={10}>
                            <span className={`fw-section-chevron ${item.collapsed ? 'fw-section-chevron--collapsed' : ''}`}>▾</span>
                            {item.label}
                          </td>
                        </tr>
                      );
                      if (item.kind === 'origin') return (
                        <tr key={item.key} className="fw-origin-header" onClick={() => toggleOrigin(item.key)}>
                          <td colSpan={10}>
                            <span className={`fw-section-chevron ${item.collapsed ? 'fw-section-chevron--collapsed' : ''}`}>▾</span>
                            {item.label}
                          </td>
                        </tr>
                      );
                      return (
                        <DraggableRuleRow
                          key={item.rule.id}
                          rule={item.rule}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onFocus={onFocus}
                          focused={focusedRuleId === item.rule.id}
                          highlight={item.rule.id === highlightedRuleId}
                        />
                      );
                    })}
                  </SortableContext>
                </tbody>
              </table>
            </div>

            {/*
             * DragOverlay renders a detached floating clone while dragging.
             * It breaks out of the <table> DOM, so we wrap it in its own mini-table
             * to preserve the correct row/cell widths.
             */}
            <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
              {activeRule && (
                <table className="data-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <tbody>
                    <DraggableRuleRow
                      rule={activeRule}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      overlay
                      dragVariant={isDragLegal === true ? 'legal' : isDragLegal === false ? 'illegal' : undefined}
                    />
                  </tbody>
                </table>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}
      </div>

      <Modal
        open={ruleModalOpen}
        title={selected ? `Edit Rule — ${selected.name}` : 'Add Firewall Rule'}
        onClose={() => dispatch({ type: 'security/closeRuleModal' })}
      >
        <RuleForm initial={selected} gatewayDefaults={newRuleGatewayDefaults} />
      </Modal>
    </div>
  );
}
