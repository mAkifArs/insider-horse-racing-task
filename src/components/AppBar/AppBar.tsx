import React, { memo } from "react";
import styles from "./AppBar.module.scss";
import { AppBarProps } from "./types";
import Typography from "../Typography";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const AppBar: React.FC<AppBarProps> = memo(({ title, actions }) => {
  return (
    <header className={styles.container}>
      <div className={styles.titleSection}>
        <Typography variant="h3" color="inverse" as="h1">
          {title}
        </Typography>
      </div>
      {actions && <div className={styles.actionsSection}>{actions}</div>}
    </header>
  );
});

AppBar.displayName = "AppBar";

export default AppBar;
