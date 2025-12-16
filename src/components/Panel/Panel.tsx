import React, { memo } from "react";
import styles from "./Panel.module.scss";
import Typography from "../Typography";
import { PanelProps } from "./types";

const Panel: React.FC<PanelProps> = memo(
  ({ title, variant = "danger", children, className }) => {
    const containerClasses = [
      styles.container,
      styles[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        <div className={styles.header}>
          <Typography variant="body2" bold>
            {title}
          </Typography>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
);

Panel.displayName = "Panel";

export default Panel;
