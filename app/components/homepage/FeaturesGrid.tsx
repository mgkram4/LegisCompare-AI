

const FeaturesGrid = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <span className="text-xl">⭐</span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Key Features
        </h2>
      </div>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 1 */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">🤖</span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              AI-Powered Analysis
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Advanced language models trained on legislative documents provide 
            accurate, context-aware analysis of complex legal language.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">📈</span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Impact Visualization
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Interactive charts and graphs showing projected impacts across 
            different sectors, timeframes, and stakeholder groups.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Evidence-Based Insights
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Every analysis point includes specific citations to bill sections 
            and line numbers, ensuring transparency and verifiability.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">🛡️</span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Bias Detection
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Identifies potential discriminatory impacts on protected classes 
            and vulnerable populations with confidence scoring.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturesGrid;
