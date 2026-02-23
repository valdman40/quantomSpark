import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface RoutingOptionsForm {
  bgpRank: number;
  ospfRank: number;
}

export function RoutingOptions() {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset } = useForm<RoutingOptionsForm>({
    defaultValues: { bgpRank: 170, ospfRank: 10 },
  });

  const onSave = (_data: RoutingOptionsForm) => {
    dispatch(addNotification({ type: 'success', message: 'Routing options saved.' }));
  };

  return (
    <div className="page-form-wrapper">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Routing Options</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Protocol ranks configuration
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        <div className="simple-form">
          <div className="simple-form-row">
            <span className="simple-form-label">BGP rank:</span>
            <input
              className="form-control"
              style={{ width: 100 }}
              type="number"
              {...register('bgpRank', { valueAsNumber: true })}
            />
          </div>
          <div className="simple-form-row">
            <span className="simple-form-label">OSPF rank:</span>
            <input
              className="form-control"
              style={{ width: 100 }}
              type="number"
              {...register('ospfRank', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
