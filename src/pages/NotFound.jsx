import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Create a glitch effect every 3 seconds
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-gray-900/20"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Netflix Logo */}
        <div className="mb-8">
          <h1 className="text-red-600 text-5xl md:text-6xl font-bold tracking-wider">
            NETFLIX
          </h1>
        </div>

        {/* 404 Number with Glitch Effect */}
        <div className="relative mb-8">
          <h2 
            className={`text-8xl md:text-9xl font-black text-white transition-all duration-200 ${
              glitchActive ? 'animate-pulse text-red-500 transform scale-105' : ''
            }`}
            style={{
              textShadow: glitchActive 
                ? '2px 0 red, -2px 0 cyan, 0 2px yellow, 0 -2px blue' 
                : '4px 4px 8px rgba(0,0,0,0.8)'
            }}
          >
            404
          </h2>
          
          {/* Glitch Overlay */}
          {glitchActive && (
            <div className="absolute inset-0 text-8xl md:text-9xl font-black text-red-500 opacity-30 transform translate-x-1 -translate-y-1">
              404
            </div>
          )}
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Lost in the Stream?
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            Sorry, we can't find that page. You'll find loads to explore on the home page.
          </p>
          <p className="text-sm text-gray-400">
            Error Code: <span className="text-red-400 font-mono">NFLX-404</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            Netflix Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold py-3 px-8 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            Go Back
          </button>
        </div>

        {/* Additional Links */}
        <div className="space-y-2 text-sm text-gray-400">
          <p>Need help? Visit our</p>
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
              Contact Us
            </a>
          </div>
        </div>

        {/* Animated Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-red-600/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 -left-20 w-16 h-16 bg-red-600/15 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Netflix-style loading dots animation (decorative) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;