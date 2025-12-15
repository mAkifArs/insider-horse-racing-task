import React, { memo } from "react";
import styled from "styled-components";
import Typography from "../Typography";
import { PanelProps, PanelVariant, variantColors } from "./types";
import { spacing } from "../../theme";

const Container = styled.div<{ $variant: PanelVariant }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => variantColors[props.$variant].border};
  background-color: #fff;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div<{ $variant: PanelVariant }>`
  background-color: ${(props) => variantColors[props.$variant].header};
  padding: ${spacing.sm} ${spacing.md};
  border-bottom: 1px solid ${(props) => variantColors[props.$variant].border};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Panel: React.FC<PanelProps> = memo(
  ({ title, variant = "danger", children, className }) => {
    return (
      <Container $variant={variant} className={className}>
        <Header $variant={variant}>
          <Typography variant="body2" bold>
            {title}
          </Typography>
        </Header>
        <Content>{children}</Content>
      </Container>
    );
  }
);

Panel.displayName = "Panel";

export default Panel;
