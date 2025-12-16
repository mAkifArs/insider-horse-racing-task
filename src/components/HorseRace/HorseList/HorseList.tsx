import React, { memo, useMemo } from "react";
import styles from "./HorseList.module.scss";
import { Horse } from "../../../types/horse";
import Panel from "../../Panel";
import DataTable, { Column } from "../../DataTable";
import Typography from "../../Typography";
import { HorseListProps } from "./types";

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
        render: (horse) => (
          <div
            className={styles.colorSwatch}
            style={{ backgroundColor: horse.color }}
          />
        ),
      },
    ],
    []
  );

  // Show loading state when horses haven't been initialized
  if (horses.length === 0) {
    return (
      <Panel title="Horse List" variant="danger" className={styles.panel}>
        <div className={styles.loadingMessage}>
          <Typography variant="body2" color="secondary">
            Loading horses...
          </Typography>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title={`Horse List (1-${horses.length})`}
      variant="danger"
      className={styles.panel}
    >
      <DataTable
        columns={columns}
        data={horses}
        keyExtractor={(horse) => horse.id}
      />
    </Panel>
  );
});

HorseList.displayName = "HorseList";

export default HorseList;
