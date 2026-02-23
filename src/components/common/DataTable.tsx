import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends object>({
  columns, data, rowKey, loading, emptyMessage = 'No records found',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="loading-box">
        <span className="spinner" />
        <span>Loading…</span>
      </div>
    );
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={col.width ? { width: col.width } : undefined}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="empty">{emptyMessage}</td>
          </tr>
        ) : (
          data.map(row => (
            <tr key={String(row[rowKey])}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render
                    ? col.render(row)
                    : (row as Record<string, unknown>)[col.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
