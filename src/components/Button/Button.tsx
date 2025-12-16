import React, { memo } from "react";
import styles from "./Button.module.scss";
import { ButtonProps } from "./types";

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
    className,
    ...rest
  }) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        className={buttonClasses}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? "..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
