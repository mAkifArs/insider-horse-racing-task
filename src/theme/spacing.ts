/**
 * =============================================================================
 * SPACING & SIZING
 * Consistent spacing throughout the app
 * =============================================================================
 */

/** Base spacing unit (4px) */
const SPACING_UNIT = 4;

/**
 * Spacing scale
 * Usage: spacing.md = 16px, spacing.lg = 24px
 */
export const spacing = {
  /** 4px */
  xs: `${SPACING_UNIT}px`,
  /** 8px */
  sm: `${SPACING_UNIT * 2}px`,
  /** 12px */
  md: `${SPACING_UNIT * 3}px`,
  /** 16px */
  lg: `${SPACING_UNIT * 4}px`,
  /** 24px */
  xl: `${SPACING_UNIT * 6}px`,
  /** 32px */
  xxl: `${SPACING_UNIT * 8}px`,
} as const;

/**
 * Border radius
 */
export const borderRadius = {
  sm: "2px",
  md: "4px",
  lg: "8px",
  round: "50%",
} as const;

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  mobile: "768px",
  tablet: "1024px",
  desktop: "1280px",
} as const;

/**
 * Z-index layers
 */
export const zIndex = {
  base: 0,
  dropdown: 100,
  modal: 200,
  tooltip: 300,
} as const;
