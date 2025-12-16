import React, { memo, useMemo } from "react";
import styles from "./Results.module.scss";
import Panel from "../../Panel";
import DataTable, { Column } from "../../DataTable";
import Typography from "../../Typography";
import { RaceResult, RaceResultEntry } from "../../../types";
import { ResultsProps } from "./types";
import { formatRoundLabel } from "../../../utils/formatters";

/**
 * Data structure for displaying a result entry in the table
 */
interface ResultTableEntry {
  position: number;
  name: string;
  horseId: string;
}

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
    <div className={styles.roundSection}>
      <div className={styles.roundHeader}>
        <Typography variant="caption" bold>
          {formatRoundLabel(result.roundNumber, result.distance)}
        </Typography>
      </div>
      <DataTable
        columns={resultColumns}
        data={tableData}
        keyExtractor={(entry) => entry.horseId}
      />
    </div>
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
      <Panel title="Results" variant="primary" className={styles.panel}>
        <div className={styles.emptyMessage}>
          <Typography variant="caption" color="secondary">
            No races completed yet
          </Typography>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Results" variant="primary" className={styles.panel}>
      <div className={styles.scrollContainer}>
        {results.map((result) => (
          <RaceResultSection key={result.roundNumber} result={result} />
        ))}
      </div>
    </Panel>
  );
});

Results.displayName = "Results";

export default Results;
