import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';
import { useDns } from '../../hooks/useDns';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Button } from '../../../../components/common/Button';
import { Card } from '../../../../components/common/Card';
import type { DnsSettings as DnsSettingsType } from '../../../../types/network';

export function DnsSettings() {
  const dispatch = useAppDispatch();
  const { data: dns, isLoading } = useDns();

  const { register, handleSubmit, reset } = useForm<DnsSettingsType>();

  useEffect(() => {
    if (dns) reset(dns);
  }, [dns, reset]);

  const onSubmit = (data: DnsSettingsType) => {
    dispatch({ type: 'network/saveDns', payload: data });
  };

  if (isLoading) return <div className="loading-box"><span className="spinner" /></div>;

  return (
    <div className="page-form-wrapper">
      <PageHeader title="DNS Settings" subtitle="Configure domain name resolution servers" />
      <Card>
        <form id="dns-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary DNS Server</label>
              <input className="form-control" {...register('primaryDns')} placeholder="8.8.8.8" />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary DNS Server</label>
              <input className="form-control" {...register('secondaryDns')} placeholder="8.8.4.4" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tertiary DNS Server</label>
              <input className="form-control" {...register('tertiaryDns')} placeholder="1.1.1.1" />
            </div>
            <div className="form-group">
              <label className="form-label">Default Domain Suffix</label>
              <input className="form-control" {...register('domainSuffix')} placeholder="corp.local" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('enableCache')} />
              <span>Enable DNS cache on the gateway</span>
            </label>
            <span className="form-hint">Caches DNS responses to improve response time</span>
          </div>
        </form>
      </Card>
      <div className="page-actions">
        <Button type="submit" form="dns-form" variant="primary">Save DNS Settings</Button>
      </div>
    </div>
  );
}
