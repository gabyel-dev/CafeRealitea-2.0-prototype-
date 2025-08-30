import React from 'react';

const Loader = () => {
  return (
    <div className="absolute inset-0 bg-slate-300/50 backdrop-blur-xs z-1 w-full flex items-center justify-center">
      <div className="text-center">
        {/* DaisyUI loading spinner with custom styling */}
        <span className="loading loading-bars loading-lg text-primary"></span>
        
        {/* Optional loading text with fade animation */}
        <p className="mt-4 text-lg font-medium text-white opacity-0 animate-fadeIn">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;