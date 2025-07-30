import { DiffMatchPatch } from 'diff-match-patch-ts';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface DiffViewerProps {
  billA: string;
  billB: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ billA, billB }) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(billA, billB);
  dmp.diff_cleanupSemantic(diffs);

  const renderDiff = (mode: 'side-by-side' | 'unified') => {
    if (mode === 'side-by-side') {
      const linesA: React.ReactElement[] = [];
      const linesB: React.ReactElement[] = [];
      let lineNumA = 1;
      let lineNumB = 1;
      let emptyCounterA = 0;
      let emptyCounterB = 0;

      diffs.forEach(([type, text]: [number, string], diffIndex: number) => {
        const splitText = text.split('\n');
        splitText.forEach((segment: string, index: number) => {
          if (segment.length === 0 && index < splitText.length - 1) {
            segment = '\n';
          } else if (segment.length > 0 && index < splitText.length - 1) {
            segment += '\n';
          }

          const lineClass = type === 0 ? '' : type === -1 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20';

          if (type === 0) { // Equal
            linesA.push(
              <div key={`A-${lineNumA}`} className={`flex items-start hover:bg-gray-50 dark:hover:bg-gray-800/50 ${lineClass}`}>
                <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs">{lineNumA++}</span>
                <pre className="flex-1 overflow-x-auto text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  {segment}
                </pre>
              </div>,
            );
            linesB.push(
              <div key={`B-${lineNumB}`} className={`flex items-start hover:bg-gray-50 dark:hover:bg-gray-800/50 ${lineClass}`}>
                <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs">{lineNumB++}</span>
                <pre className="flex-1 overflow-x-auto text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  {segment}
                </pre>
              </div>,
            );
          } else if (type === -1) { // Deletion
            linesA.push(
              <div key={`A-${lineNumA}`} className={`flex items-start ${lineClass}`}>
                <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs">{lineNumA++}</span>
                <pre className="flex-1 overflow-x-auto text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-words">
                  {segment}
                </pre>
              </div>,
            );
            linesB.push(
              <div key={`B-empty-${diffIndex}-${index}-${emptyCounterB++}`} className="flex items-start">
                <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs"></span>
                <pre className="flex-1 overflow-x-auto"></pre>
              </div>,
            );
          } else if (type === 1) { // Insertion
            linesA.push(
              <div key={`A-empty-${diffIndex}-${index}-${emptyCounterA++}`} className="flex items-start">
                <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs"></span>
                <pre className="flex-1 overflow-x-auto"></pre>
              </div>,
            );
            linesB.push(
              <div key={`B-${lineNumB}`} className={`flex items-start ${lineClass}`}>
                <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs">{lineNumB++}</span>
                <pre className="flex-1 overflow-x-auto text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap break-words">
                  {segment}
                </pre>
              </div>,
            );
          }
        });
      });

      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r border-gray-200 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              Original Version
            </div>
            <div className="max-h-96 overflow-y-auto">{linesA}</div>
          </div>
          <div>
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              Proposed Version
            </div>
            <div className="max-h-96 overflow-y-auto">{linesB}</div>
          </div>
        </div>
      );
    } else { // Unified view
      let lineNum = 1;
      return (
        <div className="max-h-96 overflow-y-auto">
          {diffs.map(([type, text]: [number, string], index: number) => {
            const lineClass = type === 0 ? '' : type === -1 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20';
            const textColor = type === 0 ? 'text-gray-700 dark:text-gray-300' : type === -1 ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300';
            const prefix = type === 0 ? '  ' : type === -1 ? '- ' : '+ ';
            const segments = text.split('\n').map((segment, idx, arr) => {
              const isLastSegment = idx === arr.length - 1;
              if (segment.length === 0 && !isLastSegment) {
                segment = '';
              }
              return (
                <div key={`${index}-${idx}`} className={`flex items-start hover:bg-gray-50 dark:hover:bg-gray-800/50 ${lineClass}`}>
                  <span className="w-8 text-right pr-2 text-gray-400 select-none text-xs">
                    {type === 0 || (type === -1 && !isLastSegment) || (type === 1 && !isLastSegment) ? lineNum++ : ''}
                  </span>
                  <pre className={`flex-1 overflow-x-auto text-sm whitespace-pre-wrap break-words ${textColor}`}>
                    {prefix}{segment}
                  </pre>
                </div>
              );
            });
            return <React.Fragment key={index}>{segments}</React.Fragment>;
          })}
        </div>
      );
    }
  };

  const calculateWordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
  const calculateReadingTime = (text: string, wordsPerMinute: number = 200) => {
    const words = calculateWordCount(text);
    return Math.ceil(words / wordsPerMinute);
  };

  const billAWordCount = calculateWordCount(billA);
  const billBWordCount = calculateWordCount(billB);
  const billAReadingTime = calculateReadingTime(billA);
  const billBReadingTime = calculateReadingTime(billB);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Content copied to clipboard!');
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setViewMode('side-by-side')}
          className={`px-4 py-2 rounded-l-lg text-sm font-medium transition-colors ${
            viewMode === 'side-by-side' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Side-by-Side
        </button>
        <button
          onClick={() => setViewMode('unified')}
          className={`px-4 py-2 rounded-r-lg text-sm font-medium transition-colors ${
            viewMode === 'unified' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Unified
        </button>
      </div>
      
      <div className="flex justify-around text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>Bill A: {billAWordCount} words, {billAReadingTime} min read</span>
        <span>Bill B: {billBWordCount} words, {billBReadingTime} min read</span>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {renderDiff(viewMode)}
      </div>
      
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => handleCopyToClipboard(billA)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
        >
          Copy Bill A
        </button>
        <button
          onClick={() => handleCopyToClipboard(billB)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
        >
          Copy Bill B
        </button>
      </div>
    </div>
  );
};

export default DiffViewer;