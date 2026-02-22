import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

export function DrSpark() {
  const dispatch = useAppDispatch();

  const fire = (msg: string) =>
    dispatch(addNotification({ type: 'info', message: msg }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 'fit-content' }}>
      <button
        className="btn btn-secondary"
        style={{ minWidth: 240 }}
        onClick={() => fire('Generating Dr. Spark Report…')}
      >
        Generate Dr. Spark Report
      </button>
      <button
        className="btn btn-secondary"
        style={{ minWidth: 240 }}
        onClick={() => fire('Downloading last Dr. Spark report…')}
      >
        Download the Last Report
      </button>
      <button
        className="btn btn-secondary"
        style={{ minWidth: 240 }}
        onClick={() => fire('Loading Dr. Spark…')}
      >
        Dr. Spark - Load
      </button>
    </div>
  );
}
