import { ReactNode } from "react";

/**
 * Column definition for the DataTable
 */
export interface Column<T> {
  /** Unique key for the column */
  key: string;
  /** Header text to display */
  header: string;
  /** Custom render function for cell content */
  render?: (row: T, index: number) => ReactNode;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Column width (e.g., "100px", "20%") */
  width?: string;
}

export interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Data rows to display */
  data: T[];
  /** Function to extract unique key from each row */
  keyExtractor: (row: T, index: number) => string;
  /** Whether to show row numbers */
  showRowNumbers?: boolean;
  /** Starting row number (useful for pagination) */
  startingRowNumber?: number;
}

