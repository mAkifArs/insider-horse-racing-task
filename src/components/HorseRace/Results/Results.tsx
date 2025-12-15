import React, { memo, useMemo } from "react";
import styled from "styled-components";
import Panel from "../../Panel";
import DataTable, { Column } from "../../DataTable";
import Typography from "../../Typography";
import { RaceResult, RaceResultEntry } from "../../../types";
import { ResultsProps } from "./types";
import { spacing, colors } from "../../../theme";
import { formatRoundLabel } from "../../../utils/formatters";

/**
 * Data structure for displaying a result entry in the table
 */
interface ResultTableEntry {
  position: number;
  name: string;
  horseId: string;
}

const StyledPanel = styled(Panel)`
  min-width: 240px;
  max-width: 240px;
  height: 100%;

  @media (max-width: 1024px) {
    min-width: unset;
    max-width: unset;
    width: 100%;
    height: auto;
    max-height: 400px;
  }
`;

const RoundSection = styled.div`
  margin-bottom: ${spacing.sm};
`;

const RoundHeader = styled.div`
  background-color: ${colors.success.light};
  padding: ${spacing.xs} ${spacing.sm};
  text-align: center;
`;

const ScrollContainer = styled.div`
  overflow-y: auto;
`;

const EmptyMessage = styled.div`
  padding: ${spacing.xl};
  text-align: center;
`;

/**
 * Table columns for results
 */
const resultColumns: Column<ResultTableEntry>[] = [
  {
    key: "position",
    header: "Position",
    align: "center" as const,
    width: "60px",
  },
  {
    key: "name",
    header: "Name",
  },
];

/**
 * Component to display a single race result
 */
const RaceResultSection: React.FC<{
  result: RaceResult;
}> = memo(({ result }) => {
  const tableData: ResultTableEntry[] = useMemo(() => {
    return result.results.map((entry: RaceResultEntry) => ({
      position: entry.position,
      name: entry.horse.name,
      horseId: entry.horseId,
    }));
  }, [result.results]);

  return (
    <RoundSection>
      <RoundHeader>
        <Typography variant="caption" bold>
          {formatRoundLabel(result.roundNumber, result.distance)}
        </Typography>
      </RoundHeader>
      <DataTable
        columns={resultColumns}
        data={tableData}
        keyExtractor={(entry) => entry.horseId}
      />
    </RoundSection>
  );
});

RaceResultSection.displayName = "RaceResultSection";

/**
 * Results component
 * Displays race outcomes as they complete
 */
const Results: React.FC<ResultsProps> = memo(({ results }) => {
  if (results.length === 0) {
    return (
      <StyledPanel title="Results" variant="primary">
        <EmptyMessage>
          <Typography variant="caption" color="secondary">
            No races completed yet
          </Typography>
        </EmptyMessage>
      </StyledPanel>
    );
  }

  return (
    <StyledPanel title="Results" variant="primary">
      <ScrollContainer>
        {results.map((result) => (
          <RaceResultSection key={result.roundNumber} result={result} />
        ))}
      </ScrollContainer>
    </StyledPanel>
  );
});

Results.displayName = "Results";

export default Results;
