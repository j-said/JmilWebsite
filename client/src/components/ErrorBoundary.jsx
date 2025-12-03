import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[--background] flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[--foreground] mb-4">
              Something went wrong
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-orange text-brand-black px-6 py-2 rounded-lg hover:bg-brand-yellow transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
