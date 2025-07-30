

const Hero = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">⚖️</span>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Legislative Bill Analyzer
        </h1>
      </div>
    </div>
    <div className="p-6">
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        AI-powered legislative analysis tool that compares bills, identifies stakeholders, 
        predicts impacts, and detects potential bias in proposed legislation.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          AI Analysis
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          Stakeholder Mapping
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          Impact Forecasting
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          Bias Detection
        </span>
      </div>
    </div>
  </div>
);

export default Hero;
