import React, { memo } from "react";
import styled, { css } from "styled-components";
import { ButtonProps, ButtonVariant, ButtonSize } from "./types";
import { colors, spacing, fontSize, borderRadius } from "../../theme";

// ─────────────────────────────────────────────────────────────────────────────
// STYLE VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background-color: ${colors.neutral.gray300};
    border: 1px solid ${colors.neutral.gray500};
    color: ${colors.text.primary};

    &:hover:not(:disabled) {
      background-color: ${colors.neutral.gray400};
    }

    &:active:not(:disabled) {
      background-color: ${colors.neutral.gray500};
    }
  `,
  secondary: css`
    background-color: ${colors.neutral.gray200};
    border: 1px solid ${colors.neutral.gray400};
    color: ${colors.text.primary};

    &:hover:not(:disabled) {
      background-color: ${colors.neutral.gray300};
    }

    &:active:not(:disabled) {
      background-color: ${colors.neutral.gray400};
    }
  `,
  outline: css`
    background-color: transparent;
    border: 1px solid ${colors.neutral.gray500};
    color: ${colors.text.primary};

    &:hover:not(:disabled) {
      background-color: ${colors.neutral.gray100};
    }

    &:active:not(:disabled) {
      background-color: ${colors.neutral.gray200};
    }
  `,
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    padding: ${spacing.xs} ${spacing.sm};
    font-size: ${fontSize.xs};
  `,
  md: css`
    padding: ${spacing.sm} ${spacing.lg};
    font-size: ${fontSize.sm};
  `,
  lg: css`
    padding: ${spacing.md} ${spacing.xl};
    font-size: ${fontSize.md};
  `,
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLED COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  font-weight: 700;
  text-transform: uppercase;
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: background-color 0.15s ease;
  white-space: nowrap;

  /* Size styles */
  ${(props) => sizeStyles[props.$size]}

  /* Variant styles */
  ${(props) => variantStyles[props.$variant]}

  /* Full width */
  ${(props) =>
    props.$fullWidth &&
    css`
      width: 100%;
    `}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Button: React.FC<ButtonProps> = memo(
  ({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    ...rest
  }) => {
    return (
      <StyledButton
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? "..." : children}
      </StyledButton>
    );
  }
);

Button.displayName = "Button";

export default Button;

