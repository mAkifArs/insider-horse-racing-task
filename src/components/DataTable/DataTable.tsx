import { memo } from "react";
import styled from "styled-components";
import { DataTableProps } from "./types";
import { fontSize, fontWeight, colors, spacing } from "../../theme";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${fontSize.sm};
`;

const TableHeader = styled.thead`
  background-color: ${colors.neutral.gray100};
  position: sticky;
  top: 0;
  z-index: 1;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.neutral.gray50};
  }

  &:hover {
    background-color: ${colors.neutral.gray200};
  }
`;

const TableHeaderCell = styled.th<{ $align?: string; $width?: string }>`
  padding: ${spacing.sm};
  text-align: ${(props) => props.$align || "left"};
  border-bottom: 1px solid ${colors.neutral.gray300};
  font-weight: ${fontWeight.bold};
  font-size: ${fontSize.xs};
  color: ${colors.text.primary};
  width: ${(props) => props.$width || "auto"};
`;

const TableCell = styled.td<{ $align?: string }>`
  padding: 6px ${spacing.sm};
  border-bottom: 1px solid ${colors.neutral.gray200};
  vertical-align: middle;
  text-align: ${(props) => props.$align || "left"};
`;

const RowNumberCell = styled(TableCell)`
  text-align: center;
  color: ${colors.text.secondary};
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
