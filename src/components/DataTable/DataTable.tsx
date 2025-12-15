import { memo } from "react";
import styled from "styled-components";
import { DataTableProps } from "./types";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
`;

const TableHeader = styled.thead`
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #e8e8e8;
  }
`;

const TableHeaderCell = styled.th<{ $align?: string; $width?: string }>`
  padding: 8px 10px;
  text-align: ${(props) => props.$align || "left"};
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  font-size: 11px;
  color: #333;
  width: ${(props) => props.$width || "auto"};
`;

const TableCell = styled.td<{ $align?: string }>`
  padding: 6px 10px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  text-align: ${(props) => props.$align || "left"};
`;

const RowNumberCell = styled(TableCell)`
  text-align: center;
  color: #666;
  width: 40px;
`;

// Generic component with proper typing
function DataTableInner<T>({
  columns,
  data,
  keyExtractor,
  showRowNumbers = false,
  startingRowNumber = 1,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <tr>
          {showRowNumbers && (
            <TableHeaderCell $align="center" $width="40px">
              #
            </TableHeaderCell>
          )}
          {columns.map((column) => (
            <TableHeaderCell
              key={column.key}
              $align={column.align}
              $width={column.width}
            >
              {column.header}
            </TableHeaderCell>
          ))}
        </tr>
      </TableHeader>
      <tbody>
        {data.map((row, index) => (
          <TableRow key={keyExtractor(row, index)}>
            {showRowNumbers && (
              <RowNumberCell>{startingRowNumber + index}</RowNumberCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key} $align={column.align}>
                {column.render
                  ? column.render(row, index)
                  : (row as Record<string, unknown>)[column.key]?.toString() ??
                    ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}

// Memoized version
const DataTable = memo(DataTableInner) as typeof DataTableInner;

export default DataTable;
