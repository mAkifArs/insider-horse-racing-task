import { ReactNode } from "react";

export type PanelVariant = "danger" | "primary" | "success";

export interface PanelProps {
  title: string;
  variant?: PanelVariant;
  children: ReactNode;
  className?: string;
}

export const variantColors: Record<
  PanelVariant,
  { header: string; border: string }
> = {
  danger: {
    header: "#cd5c5c",
    border: "#8b0000",
  },
  primary: {
    header: "#5b9bd5",
    border: "#2e75b6",
  },
  success: {
    header: "#70ad47",
    border: "#538135",
  },
};
