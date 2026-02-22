import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setFilters, resetFilters } from '../logsSlice';
import { Button } from '../../../components/common/Button';
import type { LogFilters as LogFiltersType } from '../../../types/logs';

export function LogFilters() {
  const dispatch = useAppDispatch();
  const current = useAppSelector(s => s.logs.filters);
  const { register, handleSubmit, reset } = useForm<LogFiltersType>({ defaultValues: current });

  const onSubmit = (data: LogFiltersType) => dispatch(setFilters(data));
  const onReset  = () => { dispatch(resetFilters()); reset(); };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Time Range</label>
        <select className="form-control" {...register('timeRange')}>
          <option value="1h">Last 1 hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Action</label>
        <select className="form-control" {...register('action')}>
          <option value="">All</option>
          <option value="Accept">Accept</option>
          <option value="Drop">Drop</option>
          <option value="Block">Block</option>
          <option value="Detect">Detect</option>
        </select>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Source IP</label>
        <input className="form-control" {...register('sourceIp')} placeholder="192.168.1.x" style={{ width: 140 }} />
      </div>
      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
        <label className="form-label">Search</label>
        <input className="form-control" {...register('searchText')} placeholder="Search logs…" />
      </div>
      <Button type="submit" variant="primary" size="sm">Apply</Button>
      <Button type="button" variant="ghost" size="sm" onClick={onReset}>Reset</Button>
    </form>
  );
}
