/**
 * =============================================================================
 * COLOR PALETTE
 * Central color definitions for the entire application
 * =============================================================================
 */

export const colors = {
  // ─────────────────────────────────────────────────────────────────────────
  // PRIMARY COLORS
  // ─────────────────────────────────────────────────────────────────────────
  primary: {
    main: "#4a4a4a",
    light: "#6d6d6d",
    dark: "#2d2d2d",
    contrast: "#ffffff",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACCENT COLORS (for panels, highlights)
  // ─────────────────────────────────────────────────────────────────────────
  danger: {
    main: "#dc3545",
    light: "#e4606d",
    dark: "#a71d2a",
    background: "#ffebee",
  },

  info: {
    main: "#2196f3",
    light: "#64b5f6",
    dark: "#1976d2",
    background: "#e3f2fd",
  },

  success: {
    main: "#4caf50",
    light: "#81c784",
    dark: "#388e3c",
    background: "#e8f5e9",
  },

  warning: {
    main: "#ff9800",
    light: "#ffb74d",
    dark: "#f57c00",
    background: "#fff3e0",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEUTRAL COLORS
  // ─────────────────────────────────────────────────────────────────────────
  neutral: {
    white: "#ffffff",
    gray50: "#fafafa",
    gray100: "#f5f5f5",
    gray200: "#eeeeee",
    gray300: "#e0e0e0",
    gray400: "#bdbdbd",
    gray500: "#9e9e9e",
    gray600: "#757575",
    gray700: "#616161",
    gray800: "#424242",
    gray900: "#212121",
    black: "#000000",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BACKGROUND COLORS
  // ─────────────────────────────────────────────────────────────────────────
  background: {
    app: "#c0c0c0",
    paper: "#ffffff",
    header: "#4a4a4a",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TEXT COLORS
  // ─────────────────────────────────────────────────────────────────────────
  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#9e9e9e",
    inverse: "#ffffff",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RACE TRACK COLORS
  // ─────────────────────────────────────────────────────────────────────────
  track: {
    lane: "#8fbc8f", // Light green
    laneAlt: "#7cad7c", // Slightly darker green
    laneNumber: "#ffd700", // Gold
    finishLine: "#228b22", // Forest green
  },
} as const;

export type ColorPalette = typeof colors;
