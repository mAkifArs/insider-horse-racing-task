import React, { memo, useMemo } from "react";
import styled from "styled-components";
import { Horse } from "../../../types/horse";
import Panel from "../../Panel";
import DataTable, { Column } from "../../DataTable";
import Typography from "../../Typography";
import { HorseListProps } from "./types";
import { spacing } from "../../../theme";

const StyledPanel = styled(Panel)`
  min-width: 280px;
  max-width: 320px;
  height: 100%;

  @media (max-width: 1024px) {
    min-width: unset;
    max-width: unset;
    width: 100%;
    height: auto;
    max-height: 300px;
  }

  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.$color};
  border: 1px solid #999;
  border-radius: 2px;
  margin: 0 auto;
`;

const LoadingMessage = styled.div`
  padding: ${spacing.xl};
  text-align: center;
`;

const HorseList: React.FC<HorseListProps> = memo(({ horses }) => {
  // Define columns with memoization to prevent unnecessary re-renders
  const columns: Column<Horse>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        render: (horse) => horse.name,
      },
      {
        key: "condition",
        header: "Condition",
        align: "center" as const,
        render: (horse) => horse.condition,
      },
      {
        key: "color",
        header: "Color",
        align: "center" as const,
        render: (horse) => <ColorSwatch $color={horse.color} />,
      },
    ],
    []
  );

  // Show loading state when horses haven't been initialized
  if (horses.length === 0) {
    return (
      <StyledPanel title="Horse List" variant="danger">
        <LoadingMessage>
          <Typography variant="body2" color="secondary">
            Loading horses...
          </Typography>
        </LoadingMessage>
      </StyledPanel>
    );
  }

  return (
    <StyledPanel title={`Horse List (1-${horses.length})`} variant="danger">
      <DataTable
        columns={columns}
        data={horses}
        keyExtractor={(horse) => horse.id}
      />
    </StyledPanel>
  );
});

HorseList.displayName = "HorseList";

export default HorseList;
