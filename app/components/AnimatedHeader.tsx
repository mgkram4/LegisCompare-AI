import React from 'react';

interface AnimatedHeaderProps {
  comparisonId: string;
  progress?: number; // 0-100
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  comparisonId, progress = 0,
}) => {
  return (
    <header className="w-full bg-black border-b border-gray-800 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Legislative Bill Analyzer
          </h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
            <span className="text-sm font-medium text-gray-300">
              Comparison ID: {comparisonId}
            </span>
          </div>
          {progress > 0 && (
            <div className="w-full max-w-md mx-auto mt-4">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>Analysis Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AnimatedHeader;