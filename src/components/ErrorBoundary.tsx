import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("App error:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div
          style={{
            padding: 24,
            fontFamily: "system-ui, sans-serif",
            maxWidth: 600,
            margin: "40px auto",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            color: "#991b1b",
          }}
        >
          <h2 style={{ margin: "0 0 12px 0", fontSize: 18 }}>Something went wrong</h2>
          <pre
            style={{
              margin: 0,
              fontSize: 12,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {this.state.error.message}
          </pre>
          {this.state.error.stack && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer" }}>Stack</summary>
              <pre style={{ fontSize: 11, overflow: "auto", marginTop: 8 }}>{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
