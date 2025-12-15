import React, { memo } from "react";
import styled from "styled-components";
import { AppBarProps } from "./types";
import Typography from "../Typography";
import { colors, spacing, breakpoints } from "../../theme";

// ─────────────────────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.sm} ${spacing.lg};
  background-color: ${colors.background.header};
  border-bottom: 2px solid ${colors.neutral.gray700};

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: ${spacing.sm};
    padding: ${spacing.md};
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.mobile}) {
    justify-content: center;
    width: 100%;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const AppBar: React.FC<AppBarProps> = memo(({ title, actions }) => {
  return (
    <Container>
      <TitleSection>
        <Typography variant="h3" color="inverse" as="h1">
          {title}
        </Typography>
      </TitleSection>
      {actions && <ActionsSection>{actions}</ActionsSection>}
    </Container>
  );
});

AppBar.displayName = "AppBar";

export default AppBar;
