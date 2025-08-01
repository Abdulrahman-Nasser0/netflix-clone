import { useState, useEffect } from 'react';

const NetworkError = ({ 
  onRetry, 
  error = null, 
  title = "Connection Problem",
  message = "We're having trouble connecting to Netflix. Check your internet connection and try again."
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetry?.();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorDetails = () => {
    if (!error) return null;
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return {
        type: 'Network',
        description: 'Unable to connect to Netflix servers',
        suggestions: ['Check your internet connection', 'Try refreshing the page', 'Restart your router']
      };
    }
    
    if (error.status >= 500) {
      return {
        type: 'Server',
        description: 'Netflix servers are temporarily unavailable',
        suggestions: ['Wait a few minutes and try again', 'Check our status page', 'Contact support if issue persists']
      };
    }
    
    if (error.status === 429) {
      return {
        type: 'Rate Limit',
        description: 'Too many requests. Please slow down.',
        suggestions: ['Wait a few seconds and try again', 'Avoid rapid clicking']
      };
    }
    
    return {
      type: 'Unknown',
      description: 'An unexpected error occurred',
      suggestions: ['Try refreshing the page', 'Check your connection', 'Contact support']
    };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 20h60v20H0zM20 0h20v60H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Netflix Logo */}
        <div className="mb-8">
          <h1 className="text-red-600 text-4xl md:text-5xl font-bold tracking-wider">
            NETFLIX
          </h1>
        </div>

        {/* Network Error Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-600/20 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            {message}
          </p>

          {/* Error Details */}
          {errorDetails && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-white font-semibold">{errorDetails.type} Error</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{errorDetails.description}</p>
              
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-semibold mb-2">Try these solutions:</p>
                {errorDetails.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-gray-500 mr-2 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{suggestion}</span>
                  </div>
                ))}
              </div>

              {error?.status && (
                <p className="text-xs text-gray-500 mt-3">
                  Error Code: {error.status}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`w-full py-3 px-6 rounded font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
              isRetrying 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
            }`}
          >
            {isRetrying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Retrying...
              </div>
            ) : (
              `Try Again${retryCount > 0 ? ` (${retryCount})` : ''}`
            )}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 border border-gray-600 hover:border-white text-gray-300 hover:text-white rounded font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            Refresh Page
          </button>
        </div>

        {/* Connection Tips */}
        <div className="mt-8 text-xs text-gray-500">
          <p className="mb-2">Having trouble? Try these:</p>
          <div className="space-y-1">
            <p>• Check your WiFi or mobile data connection</p>
            <p>• Disable VPN if you're using one</p>
            <p>• Close other apps that might be using bandwidth</p>
          </div>
        </div>

        {/* Animated Connection Icon */}
        <div className="absolute -top-4 -right-4 w-8 h-8">
          <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;