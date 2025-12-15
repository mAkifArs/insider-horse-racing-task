/**
 * =============================================================================
 * TYPOGRAPHY
 * Font definitions and text styles
 * =============================================================================
 */

export const fontFamily = {
  primary: "Arial, Helvetica, sans-serif",
  mono: "Consolas, Monaco, 'Courier New', monospace",
} as const;

export const fontSize = {
  /** 10px */
  xs: "10px",
  /** 12px */
  sm: "12px",
  /** 14px */
  md: "14px",
  /** 16px */
  lg: "16px",
  /** 18px */
  xl: "18px",
  /** 24px */
  xxl: "24px",
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;
