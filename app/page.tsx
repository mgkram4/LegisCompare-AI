
import Link from "next/link";
import EmptyState from "./components/homepage/EmptyState";
import FeaturesGrid from "./components/homepage/FeaturesGrid";
import FileUpload from "./components/homepage/FileUpload";
import Hero from "./components/homepage/Hero";
import ProcessExplanation from "./components/homepage/ProcessExplanation";
import Alert from "./components/interactive/Alert";
import Progress from "./components/interactive/Progress";
import UnderlineNav from "./components/interactive/UnderlineNav";
import Header from "./components/layout/Header";

export default function Home() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex min-h-screen">
        <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-1">
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-md">
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
              <span className="text-lg">💾</span>
              <span>Saved Results</span>
            </Link>
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
              <span className="text-lg">📈</span>
              <span>Trends</span>
            </Link>
          </div>
        </nav>

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <Hero />
            <FileUpload />
            <ProcessExplanation />
            <FeaturesGrid />
            <EmptyState />

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Interactive Elements Demo</h2>
              
              <UnderlineNav />

              <Alert type="warning" message={
                <>
                  Potential bias detected in sections 3.2 and 4.1. 
                  <a href="#bias-details" className="font-medium underline hover:no-underline ml-1">
                    Review details
                  </a>
                </>
              } />

              <Alert type="success" message={
                <>
                  Analysis completed successfully! 
                  <a href="#results" className="font-medium underline hover:no-underline ml-1">
                    View full report
                  </a>
                </>
              } />

              <Progress value={4} />

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
