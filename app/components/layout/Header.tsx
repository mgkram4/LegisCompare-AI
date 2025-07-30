

const Header = () => (
  <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-md flex items-center justify-center">
            <span className="text-white dark:text-gray-900 font-bold text-sm">⚖️</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            LegislativeAnalyzer
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <input 
            type="search" 
            placeholder="Search bills, keywords, or analysis..."
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
          New Analysis
        </button>
        <div className="relative">
          <button className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-400"></button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
