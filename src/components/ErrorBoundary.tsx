import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl space-y-4 p-8">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {this.state.error?.message ?? "An unexpected error occurred"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Reload page
          </button>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-slate-100 p-4 text-xs dark:bg-slate-800">
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
