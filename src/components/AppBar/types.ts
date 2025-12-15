import { ReactNode } from "react";

export interface AppBarProps {
  /** Title displayed on the left */
  title: string;
  /** Action buttons/elements displayed on the right */
  actions?: ReactNode;
}
