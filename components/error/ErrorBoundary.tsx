// React Error Boundary
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
          <Card className="max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-[#ff4444] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-white">Something went wrong</h1>
            <p className="text-[#a3a3a3] mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Go to Dashboard
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-[#737373] cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-xs text-[#a3a3a3] bg-[#121212] p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}



