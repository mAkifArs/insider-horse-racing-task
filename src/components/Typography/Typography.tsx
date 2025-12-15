import React, { memo, ElementType } from "react";
import styled, { css } from "styled-components";
import { TypographyProps, TypographyVariant, TypographyColor } from "./types";
import { colors, fontSize, fontWeight, fontFamily } from "../../theme";

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT STYLES
// ─────────────────────────────────────────────────────────────────────────────

const variantStyles: Record<TypographyVariant, ReturnType<typeof css>> = {
  h1: css`
    font-size: ${fontSize.xxl};
    font-weight: ${fontWeight.bold};
    line-height: 1.2;
  `,
  h2: css`
    font-size: ${fontSize.xl};
    font-weight: ${fontWeight.bold};
    line-height: 1.3;
  `,
  h3: css`
    font-size: ${fontSize.lg};
    font-weight: ${fontWeight.semibold};
    line-height: 1.4;
  `,
  body1: css`
    font-size: ${fontSize.md};
    font-weight: ${fontWeight.normal};
    line-height: 1.5;
  `,
  body2: css`
    font-size: ${fontSize.sm};
    font-weight: ${fontWeight.normal};
    line-height: 1.5;
  `,
  caption: css`
    font-size: ${fontSize.xs};
    font-weight: ${fontWeight.normal};
    line-height: 1.4;
  `,
  label: css`
    font-size: ${fontSize.sm};
    font-weight: ${fontWeight.semibold};
    line-height: 1.4;
    text-transform: uppercase;
  `,
};

const colorStyles: Record<TypographyColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  inverse: colors.text.inverse,
  inherit: "inherit",
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLED COMPONENT (using div as base, actual element set via 'as' prop)
// ─────────────────────────────────────────────────────────────────────────────

interface StyledProps {
  $variant: TypographyVariant;
  $color: TypographyColor;
  $bold: boolean;
  $center: boolean;
}

const StyledText = styled.div<StyledProps>`
  font-family: ${fontFamily.primary};
  margin: 0;
  padding: 0;
  color: ${(props) => colorStyles[props.$color]};

  ${(props) => variantStyles[props.$variant]}

  ${(props) =>
    props.$bold &&
    css`
      font-weight: ${fontWeight.bold};
    `}

  ${(props) =>
    props.$center &&
    css`
      text-align: center;
    `}
`;

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT ELEMENT MAPPING
// ─────────────────────────────────────────────────────────────────────────────

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body1: "p",
  body2: "p",
  caption: "span",
  label: "span",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Typography: React.FC<TypographyProps> = memo(
  ({
    children,
    variant = "body1",
    color = "primary",
    as,
    bold = false,
    center = false,
    ...rest
  }) => {
    const element = as || defaultElements[variant];

    return (
      <StyledText
        as={element}
        $variant={variant}
        $color={color}
        $bold={bold}
        $center={center}
        {...rest}
      >
        {children}
      </StyledText>
    );
  }
);

Typography.displayName = "Typography";

export default Typography;
