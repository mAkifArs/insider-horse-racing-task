import React, { memo } from "react";
import styled from "styled-components";
import { PanelProps, PanelVariant, variantColors } from "./types";

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
  color: #000;
  padding: 8px 12px;
  font-weight: bold;
  font-size: 14px;
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
        <Header $variant={variant}>{title}</Header>
        <Content>{children}</Content>
      </Container>
    );
  }
);

Panel.displayName = "Panel";

export default Panel;
