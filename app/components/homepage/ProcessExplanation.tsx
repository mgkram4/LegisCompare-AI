

const ProcessExplanation = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <span className="text-xl">💡</span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          How Legislative Analysis Works
        </h2>
      </div>
    </div>
    <div className="p-6">
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">📝</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              1. Document Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced AI extracts and structures content from legislative documents, 
              identifying sections, subsections, and key provisions with high accuracy.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">🔍</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              2. Semantic Comparison
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Intelligent section alignment compares semantically similar provisions 
              between bills, identifying additions, removals, and modifications with context.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">👥</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              3. Stakeholder Impact Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Identifies affected parties including industries, demographics, institutions, 
              and communities, analyzing how changes will benefit or harm each group.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">⚠️</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              4. Bias Detection
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Scans for potential biases related to demographics, socioeconomic status, 
              geographic location, and other factors that could create unequal impacts.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">📊</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              5. Impact Forecasting
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Predicts short-term (1 year), medium-term (3 years), and long-term (5+ years) 
              outcomes across economic, social, political, and legal domains.
            </p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">📋</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              6. Comprehensive Report
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generates detailed analysis reports with evidence citations, confidence levels, 
              and actionable insights for policymakers and stakeholders.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProcessExplanation;
