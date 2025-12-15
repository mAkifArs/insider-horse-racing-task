import { HTMLAttributes, ReactNode, ElementType } from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body1"
  | "body2"
  | "caption"
  | "label";

export type TypographyColor = "primary" | "secondary" | "inverse" | "inherit";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** Text content */
  children: ReactNode;
  /** Typography variant */
  variant?: TypographyVariant;
  /** Text color */
  color?: TypographyColor;
  /** HTML element to render */
  as?: ElementType;
  /** Bold text */
  bold?: boolean;
  /** Center text */
  center?: boolean;
}
