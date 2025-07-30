

const EmptyState = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl">📋</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Recent Analyses
          </h2>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span>⚙️</span>
        </button>
      </div>
    </div>
    <div className="p-12 text-center">
      <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">📊</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No analyses yet
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto">
        Upload your first legislative documents to get started with AI-powered analysis.
      </p>
      <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
        Start Analysis
      </button>
    </div>
  </div>
);

export default EmptyState;
