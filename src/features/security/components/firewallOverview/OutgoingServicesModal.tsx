import { useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ChevronUp } from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';

export type OutgoingMode = 'all' | 'defined';

interface Service {
  name: string;
  dir:  'both' | 'in';
}

const SERVICES: Service[] = [
  { name: 'HTTP',     dir: 'both' },
  { name: 'FTP',      dir: 'both' },
  { name: 'PPTP_TCP', dir: 'both' },
  { name: 'SNMP',     dir: 'in'   },
  { name: 'TFTP',     dir: 'in'   },
  { name: 'SSH',      dir: 'both' },
  { name: 'TELNET',   dir: 'both' },
];

interface Props {
  open:            boolean;
  initialMode:     OutgoingMode;
  initialSelected: Set<string>;
  onClose:         () => void;
  onSave:          (mode: OutgoingMode, selected: Set<string>) => void;
}

export function OutgoingServicesModal({ open, initialMode, initialSelected, onClose, onSave }: Props) {
  const [mode,         setMode]         = useState<OutgoingMode>(initialMode);
  const [selected,     setSelected]     = useState<Set<string>>(new Set(initialSelected));
  const [listOpen,     setListOpen]     = useState(true);

  function toggle(name: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function handleModeChange(m: OutgoingMode) {
    setMode(m);
    if (m === 'defined') setListOpen(true);
  }

  return (
    <Modal
      open={open}
      title="Outgoing Services"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave(mode, selected)}>OK</Button>
        </>
      }
    >
      <div className="os-body">
        <label className="os-radio-label">
          <input
            type="radio"
            name="outMode"
            checked={mode === 'all'}
            onChange={() => handleModeChange('all')}
          />
          Allow all outgoing services
        </label>

        <label className="os-radio-label">
          <input
            type="radio"
            name="outMode"
            checked={mode === 'defined'}
            onChange={() => handleModeChange('defined')}
          />
          Block all outgoing services except the following
        </label>

        {mode === 'defined' && (
          <div className="os-multiselect">
            <button
              type="button"
              className="os-multiselect-trigger"
              onClick={() => setListOpen(o => !o)}
              aria-expanded={listOpen}
            >
              <ChevronUp
                size={14}
                style={{
                  transform:  listOpen ? 'none' : 'rotate(180deg)',
                  transition: 'transform 0.15s',
                  color:      'var(--text-secondary)',
                }}
              />
            </button>

            {listOpen && (
              <div className="os-multiselect-list">
                {SERVICES.map(svc => (
                  <label key={svc.name} className="os-svc-row">
                    <input
                      type="checkbox"
                      checked={selected.has(svc.name)}
                      onChange={() => toggle(svc.name)}
                    />
                    {svc.dir === 'both'
                      ? <ArrowLeftRight size={12} className="os-svc-icon" />
                      : <ArrowLeft     size={12} className="os-svc-icon" />
                    }
                    <span>{svc.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
