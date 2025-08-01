import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate a unique error ID for tracking
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // In production, you could send this to an error reporting service
    // logErrorToService(error, errorInfo, errorId);
  }

  handleReload = () => {
    window.location.reload();
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-gray-900/30"></div>
          
          {/* Static Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                animation: 'pulse 4s ease-in-out infinite'
              }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-2xl">
            {/* Netflix Logo */}
            <div className="mb-8">
              <h1 className="text-red-600 text-4xl md:text-5xl font-bold tracking-wider">
                NETFLIX
              </h1>
            </div>

            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                <svg 
                  className="w-12 h-12 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                We're experiencing some technical difficulties. Our team has been notified and is working to fix this issue.
              </p>
              
              {/* Error Details */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-400 mb-2">
                  Error ID: <span className="text-red-400 font-mono">{this.state.errorId}</span>
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-white mb-2">
                      Technical Details (Development Mode)
                    </summary>
                    <div className="bg-black/50 p-3 rounded text-xs font-mono text-red-300 overflow-auto max-h-32">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                      {this.state.errorInfo.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={this.handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold py-3 px-8 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                Reload Page
              </button>

              <Link
                to="/"
                className="text-gray-400 hover:text-white font-semibold py-3 px-8 rounded transition-all duration-200 underline"
              >
                Go to Home
              </Link>
            </div>

            {/* Help Links */}
            <div className="space-y-2 text-sm text-gray-400">
              <p>If this problem persists, please contact our support team</p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                >
                  Help Center
                </a>
                <span>•</span>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                >
                  Contact Support
                </a>
                <span>•</span>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                >
                  System Status
                </a>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-red-600/10 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-red-600/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;