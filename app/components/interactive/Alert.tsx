
import React from 'react';

interface AlertProps {
  type: 'warning' | 'success';
  message: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  if (type === 'warning') {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-green-400">✅</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700 dark:text-green-200">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
