import { type ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Info, MinusCircle, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';
import { OutgoingServicesModal, type OutgoingMode } from './OutgoingServicesModal';

type FwMode  = 'custom' | 'strict' | 'standard' | 'off';
type AppMode = 'on' | 'url-only' | 'off';

const FW_MODES:  [FwMode,  string][] = [['custom', 'Custom'], ['strict', 'Strict'], ['standard', 'Standard'], ['off', 'Off']];
const APP_MODES: [AppMode, string][] = [['on', 'On'], ['url-only', 'URL Filtering only'], ['off', 'Off']];
const TRACK_OPTS = ['All', 'Outgoing', 'Incoming and Internal'];

// ── Shared "No servers" row ───────────────────────────────────────────────────
const NO_SERVERS = (
  <div className="bc-info-row">
    <FileText size={13} className="bc-icon bc-icon--file" />
    <span>No servers are configured &nbsp;|&nbsp; <Link to="/access-policy/servers" className="bc-link">Add a server...</Link></span>
  </div>
);

// Static per-mode messages (custom / strict / off don't need dynamic content)
const FW_MESSAGES_STATIC: Partial<Record<FwMode, ReactNode>> = {
  custom: (
    <>
      <div className="bc-info-row">
        <Info size={13} className="bc-icon bc-icon--info" />
        <span>
          Access policy for <strong>outgoing</strong>, <strong>incoming</strong> and{' '}
          <strong>internal</strong> traffic is determined by <strong>manual rules</strong>
        </span>
      </div>
      {NO_SERVERS}
    </>
  ),
  strict: (
    <>
      <div className="bc-info-row">
        <MinusCircle size={13} className="bc-icon bc-icon--red" />
        <span>Block all traffic by default</span>
      </div>
      <div className="bc-info-row">
        <Info size={13} className="bc-icon bc-icon--info" />
        <span>
          Access Policy is configured in{' '}
          <Link to="/access-policy/policy" className="bc-link">Access Policy Page</Link>
        </span>
      </div>
      {NO_SERVERS}
    </>
  ),
  off: (
    <>
      <div className="bc-info-row">
        <ShieldCheck size={13} className="bc-icon bc-icon--green" />
        <span>Allow all traffic</span>
      </div>
      <div className="bc-info-row">
        <AlertTriangle size={13} className="bc-icon bc-icon--warn" />
        <span>When Firewall is deactivated your network is not secured</span>
      </div>
      {NO_SERVERS}
    </>
  ),
};

export function FirewallOverview() {
  const dispatch = useAppDispatch();

  // ── Firewall Policy ────────────────────────────────────────────
  const [fwMode, setFwMode] = useState<FwMode>('custom');

  // ── Outgoing Services modal (Standard mode) ────────────────────
  const [servicesOpen,    setServicesOpen]    = useState(false);
  const [outgoingMode,    setOutgoingMode]    = useState<OutgoingMode>('all');
  const [outgoingSelected, setOutgoingSelected] = useState<Set<string>>(new Set());

  const servicesLinkText =
    outgoingMode === 'defined' && outgoingSelected.size > 0
      ? 'the defined services...'
      : 'all services...';

  // ── Applications & URL Filtering ───────────────────────────────
  const [appMode,      setAppMode]      = useState<AppMode>('off');
  const [blockRisk,    setBlockRisk]    = useState(true);
  const [blockShare,   setBlockShare]   = useState(false);
  const [blockContent, setBlockContent] = useState(false);
  const [blockOther,   setBlockOther]   = useState(false);
  const [limitBw,      setLimitBw]      = useState(false);
  const [download,     setDownload]     = useState('100000');
  const [upload,       setUpload]       = useState('10000');

  // ── General ────────────────────────────────────────────────────
  const [userAwareness, setUserAwareness] = useState(true);
  const [logBlocked,    setLogBlocked]    = useState(true);
  const [logBlockedSel, setLogBlockedSel] = useState('All');
  const [logAllowed,    setLogAllowed]    = useState(false);
  const [logAllowedSel, setLogAllowedSel] = useState('All');

  const appEnabled = appMode !== 'off';

  return (
    <div className="page-form-wrapper">

      {/* ── Firewall Policy ──────────────────────────────────────── */}
      <div className="bc-section">
        <div className="bc-section-title">Firewall Policy</div>
        <div className="bc-section-body">

          <div className="bc-left-col">
            {FW_MODES.map(([val, label]) => (
              <label key={val} className="bc-radio-label">
                <input
                  type="radio"
                  name="fwMode"
                  value={val}
                  checked={fwMode === val}
                  onChange={() => setFwMode(val)}
                />
                {label}
              </label>
            ))}
          </div>

          <div className="bc-right-col">
            {fwMode === 'standard' ? (
              <>
                <div className="bc-info-row">
                  <ShieldCheck size={13} className="bc-icon bc-icon--green" />
                  <span>
                    Allow traffic to the Internet on{' '}
                    <button
                      type="button"
                      className="bc-link bc-link-btn"
                      onClick={() => setServicesOpen(true)}
                    >
                      {servicesLinkText}
                    </button>
                  </span>
                </div>
                <div className="bc-info-row">
                  <ShieldCheck size={13} className="bc-icon bc-icon--green" />
                  <span>Allow traffic between internal networks</span>
                </div>
                <div className="bc-info-row">
                  <MinusCircle size={13} className="bc-icon bc-icon--red" />
                  <span>Block incoming traffic</span>
                </div>
                {NO_SERVERS}
              </>
            ) : (
              FW_MESSAGES_STATIC[fwMode]
            )}
          </div>

        </div>
      </div>

      {/* ── Applications & URL Filtering ─────────────────────────── */}
      <div className="bc-section">
        <div className="bc-section-title">Applications &amp; URL Filtering</div>
        <div className="bc-section-body">

          <div className="bc-left-col">
            {APP_MODES.map(([val, label]) => (
              <label key={val} className="bc-radio-label">
                <input
                  type="radio"
                  name="appMode"
                  value={val}
                  checked={appMode === val}
                  onChange={() => setAppMode(val)}
                />
                {label}
              </label>
            ))}
          </div>

          <div className={`bc-right-col bc-checkboxes${!appEnabled ? ' bc-checkboxes--disabled' : ''}`}>
            <label className="bc-checkbox-label">
              <input type="checkbox" checked={blockRisk} disabled={!appEnabled}
                onChange={e => setBlockRisk(e.target.checked)} />
              Block security risk categories
            </label>
            <label className="bc-checkbox-label">
              <input type="checkbox" checked={blockShare} disabled={!appEnabled}
                onChange={e => setBlockShare(e.target.checked)} />
              Block file sharing applications
            </label>
            <label className="bc-checkbox-label">
              <input type="checkbox" checked={blockContent} disabled={!appEnabled}
                onChange={e => setBlockContent(e.target.checked)} />
              Block inappropriate content
            </label>
            <label className="bc-checkbox-label">
              <input type="checkbox" checked={blockOther} disabled={!appEnabled}
                onChange={e => setBlockOther(e.target.checked)} />
              Block other undesired applications
            </label>
            <label className="bc-checkbox-label">
              <input type="checkbox" checked={limitBw} disabled={!appEnabled}
                onChange={e => setLimitBw(e.target.checked)} />
              Limit bandwidth consuming applications
            </label>

            <div className="bc-bw-block">
              <div className="bc-bw-row">
                <span className={`bc-bw-label${(!appEnabled || !limitBw) ? ' bc-bw-label--off' : ''}`}>Download</span>
                <input
                  type="number"
                  className="form-control bc-bw-input"
                  value={download}
                  disabled={!appEnabled || !limitBw}
                  onChange={e => setDownload(e.target.value)}
                />
              </div>
              <div className="bc-bw-row">
                <span className={`bc-bw-label${(!appEnabled || !limitBw) ? ' bc-bw-label--off' : ''}`}>Upload</span>
                <input
                  type="number"
                  className="form-control bc-bw-input"
                  value={upload}
                  disabled={!appEnabled || !limitBw}
                  onChange={e => setUpload(e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── General ──────────────────────────────────────────────── */}
      <div className="bc-section">
        <div className="bc-section-title">General</div>
        <div className="bc-general-body">

          {/* User Awareness */}
          <div className="bc-gen-sub">User Awareness</div>
          <div className="bc-gen-row">
            <label className="bc-checkbox-label">
              <input type="checkbox" checked={userAwareness}
                onChange={e => setUserAwareness(e.target.checked)} />
              Enable User Awareness
            </label>
            <Link to="/access-policy/user-awareness" className="bc-link bc-link--action">Edit settings</Link>
            <Link to="/access-policy/user-awareness" className="bc-link bc-link--action">Active Directory servers</Link>
          </div>

          {/* Tracking */}
          <div className="bc-gen-sub">Tracking</div>
          <div className="bc-track-row">
            <input type="checkbox" checked={logBlocked} onChange={e => setLogBlocked(e.target.checked)} />
            <span className="bc-track-word">Log</span>
            <select className="form-control bc-track-select"
              value={logBlockedSel} onChange={e => setLogBlockedSel(e.target.value)}>
              {TRACK_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
            <span>blocked traffic</span>
          </div>
          <div className="bc-track-row">
            <input type="checkbox" checked={logAllowed} onChange={e => setLogAllowed(e.target.checked)} />
            <span className="bc-track-word">Log</span>
            <select className="form-control bc-track-select"
              value={logAllowedSel} onChange={e => setLogAllowedSel(e.target.value)}>
              {TRACK_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
            <span>allowed traffic</span>
          </div>

          {/* Access Policy rules */}
          <div className="bc-gen-sub">Access Policy rules</div>
          <div className="bc-info-row">
            <Info size={13} className="bc-icon bc-icon--info" />
            <span>
              <Link to="/access-policy/policy" className="bc-link">8 manual rules</Link>
              {' '}are configured
            </span>
          </div>

          {/* AppWiki links */}
          <div className="bc-gen-sub">Tracking</div>
          <div className="bc-info-row">
            <Info size={13} className="bc-icon bc-icon--info" />
            <Link to="/users/applications" className="bc-link">View Applications &amp; URLs</Link>
          </div>
          <div className="bc-info-row">
            <span className="bc-icon bc-icon--cp" aria-hidden="true">&#9679;</span>
            <a href="https://appwiki.checkpoint.com" target="_blank" rel="noreferrer" className="bc-link">
              Check Point AppWiki
            </a>
          </div>

        </div>
      </div>

      {/* ── Outgoing Services modal ──────────────────────────────── */}
      <OutgoingServicesModal
        key={servicesOpen ? 'open' : 'closed'}
        open={servicesOpen}
        initialMode={outgoingMode}
        initialSelected={outgoingSelected}
        onClose={() => setServicesOpen(false)}
        onSave={(mode, selected) => {
          setOutgoingMode(mode);
          setOutgoingSelected(selected);
          setServicesOpen(false);
        }}
      />

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="page-actions">
        <button type="button" className="btn btn-secondary">Cancel</button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => dispatch(addNotification({ type: 'success', message: 'Firewall blade control settings saved.' }))}
        >
          Save
        </button>
      </div>

    </div>
  );
}
