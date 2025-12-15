/**
 * =============================================================================
 * THEME
 * Central export for all theme values
 * =============================================================================
 *
 * Usage:
 * import { colors, spacing, fontSize } from '../theme';
 *
 * const StyledDiv = styled.div`
 *   background: ${colors.background.app};
 *   padding: ${spacing.md};
 *   font-size: ${fontSize.md};
 * `;
 */

export { colors } from "./colors";
export { spacing, borderRadius, breakpoints, zIndex } from "./spacing";
export { fontFamily, fontSize, fontWeight, lineHeight } from "./typography";
