
import React from 'react';

interface ProgressProps {
  value: number;
}

const Progress: React.FC<ProgressProps> = ({ value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      <span>Analysis Progress</span>
      <span>{value}/5 steps completed</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div 
        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
        style={{width: `${(value/5) * 100}%`}}>
      </div>
    </div>
  </div>
);

export default Progress;
