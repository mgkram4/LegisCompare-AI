

const UnderlineNav = () => (
  <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
    <nav className="flex space-x-8">
      <a href="#" className="py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600 dark:text-blue-400">
        <div className="flex items-center space-x-2">
          <span>📊</span>
          <span>Overview</span>
        </div>
      </a>
      <a href="#" className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300">
        <div className="flex items-center space-x-2">
          <span>🔍</span>
          <span>Analysis</span>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-medium">3</span>
        </div>
      </a>
      <a href="#" className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300">
        <div className="flex items-center space-x-2">
          <span>👥</span>
          <span>Stakeholders</span>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-medium">12</span>
        </div>
      </a>
      <a href="#" className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300">
        <div className="flex items-center space-x-2">
          <span>📈</span>
          <span>Forecasts</span>
        </div>
      </a>
      <a href="#" className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300">
        <div className="flex items-center space-x-2">
          <span>⚠️</span>
          <span>Issues</span>
          <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 py-0.5 px-2 rounded-full text-xs font-medium">2</span>
        </div>
      </a>
    </nav>
  </div>
);

export default UnderlineNav;
