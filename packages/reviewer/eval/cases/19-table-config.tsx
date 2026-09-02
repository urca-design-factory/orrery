// @expect P-05 P-06
export interface DataTableProps {
  columns: { key: string; header: string }[];
  rows: Record<string, unknown>[];
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  headerAlign?: "left" | "center" | "right";
  emptyMessage?: string;
}

/** Renders tabular data. */
export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((c) => (
              <td key={c.key}>{String(row[c.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
