import React, { memo, ElementType } from "react";
import styles from "./Typography.module.scss";
import { TypographyProps, TypographyVariant } from "./types";

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
    className,
    ...rest
  }) => {
    const element = as || defaultElements[variant];
    const Component = element;

    const typographyClasses = [
      styles.text,
      styles[variant],
      styles[color],
      bold ? styles.bold : "",
      center ? styles.center : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component className={typographyClasses} {...rest}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

export default Typography;
