import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface DateTimeForm {
  timeMode: 'manual' | 'ntp';
  ntp1: string;
  ntp2: string;
  updateInterval: number;
  ntpAuth: boolean;
  sharedSecret: string;
  sharedSecretId: string;
  timezone: string;
  dstAdjust: boolean;
  runLocalNtp: boolean;
}

export function DateAndTime() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState({ adjust: true, timezone: true, localNtp: true });
  const { register, watch, handleSubmit, reset } = useForm<DateTimeForm>({
    defaultValues: {
      timeMode: 'ntp',
      ntp1: 'ntp.roypoint.com',
      ntp2: 'ntp2.roypoint.com',
      updateInterval: 30,
      ntpAuth: false,
      sharedSecret: '',
      sharedSecretId: '',
      timezone: 'GMT+02:00 Jerusalem',
      dstAdjust: true,
      runLocalNtp: false,
    },
  });

  const timeMode = watch('timeMode');
  const ntpAuth = watch('ntpAuth');

  const toggle = (key: 'adjust' | 'timezone' | 'localNtp') =>
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const onSave = (_data: DateTimeForm) => {
    dispatch(addNotification({ type: 'success', message: 'Date and time settings saved.' }));
  };

  return (
    <div className="page-form-wrapper">
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Date and Time</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Configuring device's date and time manually or using NTP
        </p>
      </div>

      <p className="dt-current-time">Current system time: Sunday, February 22nd, 2026 07:44:28 PM</p>

      <form onSubmit={handleSubmit(onSave)}>
        {/* Adjust Date and Time */}
        <div className="sysop-section" style={{ maxWidth: 640 }}>
          <div className="sysop-section-hdr" onClick={() => toggle('adjust')}>
            <span>Adjust Date and Time</span>
            {open.adjust ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {open.adjust && (
            <div className="sysop-section-body">
              <div className="dt-radio-group">
                {/* Manual option */}
                <div>
                  <label className="dt-radio-label">
                    <input type="radio" value="manual" {...register('timeMode')} />
                    Set date and time manually
                  </label>
                  {timeMode === 'manual' && (
                    <div className="dt-subfields">
                      <div className="dt-field-row">
                        <span className="dt-field-label">Date:</span>
                        <input className="form-control" style={{ width: 200 }} placeholder="Sunday, February 22nd, 2026" />
                      </div>
                      <div className="dt-field-row">
                        <span className="dt-field-label">Time:</span>
                        <input className="form-control" style={{ width: 60 }} placeholder="07" />
                        <span>:</span>
                        <input className="form-control" style={{ width: 60 }} placeholder="44" />
                        <select className="form-control" style={{ width: 70 }} defaultValue="PM">
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* NTP option */}
                <div>
                  <label className="dt-radio-label">
                    <input type="radio" value="ntp" {...register('timeMode')} />
                    Set date and time using a Network Time Protocol (NTP) server
                  </label>
                  {timeMode === 'ntp' && (
                    <div className="dt-subfields">
                      <div className="dt-field-row">
                        <span className="dt-field-label">NTP server:</span>
                        <input className="form-control" style={{ width: 220 }} {...register('ntp1')} />
                      </div>
                      <div className="dt-field-row">
                        <span className="dt-field-label">NTP server:</span>
                        <input className="form-control" style={{ width: 220 }} {...register('ntp2')} />
                      </div>
                      <div className="dt-field-row">
                        <span className="dt-field-label">Update Interval (minutes):</span>
                        <input className="form-control" style={{ width: 80 }} type="number" {...register('updateInterval', { valueAsNumber: true })} />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', cursor: 'pointer', marginTop: 4 }}>
                        <input type="checkbox" {...register('ntpAuth')} />
                        NTP authentication
                      </label>
                      <div className="dt-field-row" style={{ opacity: ntpAuth ? 1 : 0.45 }}>
                        <span className="dt-field-label">Shared Secret:</span>
                        <input className="form-control" style={{ width: 220 }} disabled={!ntpAuth} {...register('sharedSecret')} />
                      </div>
                      <div className="dt-field-row" style={{ opacity: ntpAuth ? 1 : 0.45 }}>
                        <span className="dt-field-label">Shared Secret Identifier:</span>
                        <input className="form-control" style={{ width: 220 }} disabled={!ntpAuth} {...register('sharedSecretId')} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Time Zone */}
        <div className="sysop-section" style={{ maxWidth: 640 }}>
          <div className="sysop-section-hdr" onClick={() => toggle('timezone')}>
            <span>Time Zone</span>
            {open.timezone ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {open.timezone && (
            <div className="sysop-section-body">
              <div className="dt-field-row" style={{ marginBottom: 10 }}>
                <span className="dt-field-label">Local time zone:</span>
                <select className="form-control" style={{ width: 240 }} {...register('timezone')}>
                  <option value="GMT+02:00 Jerusalem">(GMT+02:00) Jerusalem</option>
                  <option value="GMT+00:00 UTC">(GMT+00:00) UTC</option>
                  <option value="GMT-05:00 Eastern">(GMT-05:00) Eastern Time (US & Canada)</option>
                  <option value="GMT+01:00 London">(GMT+01:00) London</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
                <input type="checkbox" {...register('dstAdjust')} />
                Automatically adjust clock for daylight saving changes
              </label>
            </div>
          )}
        </div>

        {/* Local NTP Server */}
        <div className="sysop-section" style={{ maxWidth: 640 }}>
          <div className="sysop-section-hdr" onClick={() => toggle('localNtp')}>
            <span>Local NTP Server</span>
            {open.localNtp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {open.localNtp && (
            <div className="sysop-section-body">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
                <input type="checkbox" {...register('runLocalNtp')} />
                Run NTP server on this appliance
              </label>
            </div>
          )}
        </div>

        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
