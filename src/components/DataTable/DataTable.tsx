import { memo } from "react";
import styles from "./DataTable.module.scss";
import { DataTableProps } from "./types";

// Generic component with proper typing
function DataTableInner<T>({
  columns,
  data,
  keyExtractor,
  showRowNumbers = false,
  startingRowNumber = 1,
}: DataTableProps<T>) {
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {showRowNumbers && (
            <th
              className={`${styles.th} ${styles.center}`}
              style={{ width: "40px" }}
            >
              #
            </th>
          )}
          {columns.map((column) => (
            <th
              key={column.key}
              className={`${styles.th} ${
                column.align ? styles[column.align] : styles.left
              }`}
              style={{ width: column.width || "auto" }}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={keyExtractor(row, index)} className={styles.tr}>
            {showRowNumbers && (
              <td className={`${styles.td} ${styles.rowNumberCell}`}>
                {startingRowNumber + index}
              </td>
            )}
            {columns.map((column) => (
              <td
                key={column.key}
                className={`${styles.td} ${
                  column.align ? styles[column.align] : styles.left
                }`}
              >
                {column.render
                  ? column.render(row, index)
                  : (row as Record<string, unknown>)[column.key]?.toString() ??
                    ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Memoized version
const DataTable = memo(DataTableInner) as typeof DataTableInner;

export default DataTable;
