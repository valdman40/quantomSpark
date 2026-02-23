import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { openAddRule, openEditRule } from '../../securitySlice';
import { useFirewallRules } from '../../hooks/useFirewallRules';
import { queryClient } from '../../../../app/queryClient';
import { queryKeys } from '../../../../services/queryKeys';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Button } from '../../../../components/common/Button';
import { Modal } from '../../../../components/common/Modal';
import { RuleForm } from './RuleForm';
import { DraggableRuleRow } from './DraggableRuleRow';
import type { FirewallRule } from '../../../../types/security';

export function RuleTable() {
  const dispatch = useAppDispatch();
  const { ruleModalOpen, selectedRuleId, policyInstall } = useAppSelector(s => s.security);
  const { data: serverRules = [], isLoading } = useFirewallRules();

  // ── Local ordered copy for instant visual feedback ──────────
  const [orderedRules, setOrderedRules] = useState<FirewallRule[]>(serverRules);
  const [pendingReorder, setPendingReorder] = useState(false);

  // Sync from server whenever data changes (rule added/deleted/server refresh)
  useEffect(() => {
    setOrderedRules(serverRules);
    setPendingReorder(false);
  }, [serverRules]);

  // The id of the rule currently being dragged (drives DragOverlay)
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeRule = orderedRules.find(r => r.id === activeId) ?? null;

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
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setOrderedRules(prev => {
      const oldIdx = prev.findIndex(r => r.id === active.id);
      const newIdx = prev.findIndex(r => r.id === over.id);
      // Reassign `number` to match the new visual position (1-based)
      const reordered = arrayMove(prev, oldIdx, newIdx)
        .map((rule, i) => ({ ...rule, number: i + 1 }));

      // ① Optimistic: update the React Query cache immediately
      queryClient.setQueryData<FirewallRule[]>(
        queryKeys.security.rules(),
        reordered
      );

      // ② Persist via saga — rolls back on network error
      dispatch({
        type: 'security/reorderRules',
        payload: { ruleIds: reordered.map(r => r.id) },
      });

      setPendingReorder(true);
      return reordered;
    });
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  // ── Row callbacks ────────────────────────────────────────────
  const onEdit   = (id: string) => dispatch(openEditRule(id));
  const onDelete = (id: string) => dispatch({ type: 'security/deleteRule', payload: id });

  const installing = policyInstall.status === 'installing';
  const selected   = orderedRules.find(r => r.id === selectedRuleId);

  return (
    <div>
      <PageHeader
        title="Firewall Rules"
        subtitle="Access control policy — drag rows to reorder, then install policy"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: 'security/installPolicy' })}
              loading={installing}
            >
              {installing
                ? `Installing… ${policyInstall.progress ?? 0}%`
                : '▶ Install Policy'}
            </Button>
            <Button variant="primary" onClick={() => dispatch(openAddRule())}>
              + Add Rule
            </Button>
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

      {isLoading ? (
        <div className="loading-box"><span className="spinner" /><span>Loading rules…</span></div>
      ) : (
        <div className="card">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragStart={handleDragStart}
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
                    items={orderedRules.map(r => r.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {orderedRules.map(rule => (
                      <DraggableRuleRow
                        key={rule.id}
                        rule={rule}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
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
                    />
                  </tbody>
                </table>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      <Modal
        open={ruleModalOpen}
        title={selected ? `Edit Rule — ${selected.name}` : 'Add Firewall Rule'}
        onClose={() => dispatch({ type: 'security/closeRuleModal' })}
      >
        <RuleForm initial={selected} />
      </Modal>
    </div>
  );
}
