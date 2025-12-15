import { Component, ErrorInfo, ReactNode } from "react";
import styled from "styled-components";
import Typography from "../Typography";
import Button from "../Button";
import { ErrorBoundaryProps, ErrorBoundaryState } from "./types";
import { spacing } from "../../theme";

const ErrorContainer = styled.div`
  padding: ${spacing.xl};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.md};
`;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <Typography variant="h2">Something went wrong</Typography>
          <Typography variant="body1" color="secondary">
            {this.state.error?.message || "An unexpected error occurred"}
          </Typography>
          <Button onClick={this.handleReset}>Try again</Button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
