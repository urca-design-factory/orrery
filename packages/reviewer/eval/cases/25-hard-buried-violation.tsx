// @expect N-06
import { forwardRef, useCallback, useMemo, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

type SortDirection = "asc" | "desc";

interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: number;
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function useSortedRows<T extends Record<string, unknown>>(
  rows: T[],
  sortKey: string | null,
  direction: SortDirection,
) {
  return useMemo(() => {
    if (!sortKey) return rows;
    const sorted = [...rows].sort((a, b) =>
      compareValues(a[sortKey], b[sortKey]),
    );
    return direction === "desc" ? sorted.reverse() : sorted;
  }, [rows, sortKey, direction]);
}

const cell = cva("px-3 py-2 text-sm", {
  variants: {
    variant: {
      default: "text-fg-primary",
      muted: "text-fg-secondary",
      bold: "font-medium text-fg-primary",
      wide: "px-6",
    },
    align: { start: "text-left", end: "text-right" },
  },
  defaultVariants: { variant: "default", align: "start" },
});

export interface TableCellProps
  extends React.ComponentPropsWithoutRef<"td">, VariantProps<typeof cell> {}

/** A single cell within a data row. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, variant, align, ...props }, ref) => (
    <td
      ref={ref}
      className={[cell({ variant, align }), className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

export interface SortableTableProps<T extends Record<string, unknown>> {
  /** Column definitions in display order. */
  columns: Column<T>[];
  /** Row data to render. */
  rows: T[];
  /** Called when the user selects a row. */
  onRowSelect?: (row: T) => void;
}

/** A table whose columns can be sorted by clicking their headers. */
export function SortableTable<T extends Record<string, unknown>>({
  columns,
  rows,
  onRowSelect,
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [direction, setDirection] = useState<SortDirection>("asc");
  const sorted = useSortedRows(rows, sortKey, direction);

  const toggleSort = useCallback(
    (key: string) => {
      setDirection((d) => (sortKey === key && d === "asc" ? "desc" : "asc"));
      setSortKey(key);
    },
    [sortKey],
  );

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-border-default">
          {columns.map((column) => (
            <th
              key={column.key}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.sortable ? (
                <button type="button" onClick={() => toggleSort(column.key)}>
                  {column.header}
                </button>
              ) : (
                column.header
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, index) => (
          <tr
            key={index}
            onClick={() => onRowSelect?.(row)}
            className="border-b border-border-default"
          >
            {columns.map((column) => (
              <TableCell key={column.key} variant="default">
                {String(row[column.key])}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
