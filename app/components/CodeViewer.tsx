import React from 'react';
import toast from 'react-hot-toast';

interface CodeViewerProps {
  code: string;
  language?: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  code, language = 'text',
}) => {
  const calculateWordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
  const calculateReadingTime = (text: string, wordsPerMinute: number = 200) => {
    const words = calculateWordCount(text);
    return Math.ceil(words / wordsPerMinute);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Content copied to clipboard!');
  };

  const lines = code.split('\n');
  const wordCount = calculateWordCount(code);
  const readingTime = calculateReadingTime(code);

  return (
    <div>
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span>{wordCount} words, {readingTime} min read</span>
        <button
          onClick={() => handleCopyToClipboard(code)}
          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
        >
          Copy
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {lines.map((line, index) => (
            <div key={index} className="flex items-start hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs py-1">{index + 1}</span>
              <pre className="flex-1 overflow-x-auto text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words py-1">
                {line || ' '} {/* Ensure empty lines are visible */}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;