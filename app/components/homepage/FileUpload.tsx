"use client";

import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Progress from '../interactive/Progress';



const FileUpload = () => {
  const [billA, setBillA] = useState<File | null>(null);
  const [billB, setBillB] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const fileInputRefA = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setBill: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setBill(e.target.files[0]);
    } else {
      setBill(null);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRefA.current?.click();
  };

  const handleAnalyzeClick = async () => {
    if (billA && billB) {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 5) {
            clearInterval(progressInterval);
            return 5;
          }
          return prev + 1;
        });
      }, 1000);

      const comparisonId = uuidv4();
      const readerA = new FileReader();
      const readerB = new FileReader();

      readerA.onload = (e) => localStorage.setItem(`billA-${comparisonId}`, e.target?.result as string);
      readerB.onload = (e) => localStorage.setItem(`billB-${comparisonId}`, e.target?.result as string);

      readerA.readAsText(billA);
      readerB.readAsText(billB);

      router.push(`/compare/${comparisonId}`);
    } else {
      alert("Please select both bills to analyze.");
    }
  };

  const handleDemoClick = async () => {
    console.log("Loading demo files...");
    setIsLoading(true);
    setProgress(0);

    // Simulate progress for demo
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    const comparisonId = uuidv4();
    try {
      // Fetch demo files from the /test directory
      const billA_response = await fetch('/hr1_enrolled.pdf');
      const billB_response = await fetch('/hr748_enrolled.pdf');

      if (!billA_response.ok || !billB_response.ok) {
        throw new Error('Failed to fetch demo files');
      }

      const billA_blob = await billA_response.blob();
      const billB_blob = await billB_response.blob();
      
      const billA = new File([billA_blob], 'hr1_enrolled.pdf', { type: 'application/pdf' });
      const billB = new File([billB_blob], 'hr748_enrolled.pdf', { type: 'application/pdf' });

      const readerA = new FileReader();
      const readerB = new FileReader();

      readerA.onload = (e) => localStorage.setItem(`billA-${comparisonId}`, e.target?.result as string);
      readerB.onload = (e) => localStorage.setItem(`billB-${comparisonId}`, e.target?.result as string);

      readerA.readAsText(billA);
      readerB.readAsText(billB);
      
      router.push(`/compare/${comparisonId}`);
    } catch (error) {
      console.error("Error during demo analysis:", error);
      alert("Network error: Unable to connect to the analysis service. Please try again.");
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <span className="text-xl">📁</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Upload Bills for Analysis
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="text-6xl text-gray-400 dark:text-gray-500 mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Drag and drop your legislative documents
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              or <button onClick={handleChooseFileClick} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">choose files</button> to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PDF, DOC, DOCX, TXT • Max 10MB per file
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bill A (Original/Current)
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.txt"
                ref={fileInputRefA}
                onChange={(e) => handleFileChange(e, setBillA)}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bill B (Proposed/Updated)
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileChange(e, setBillB)}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button onClick={handleAnalyzeClick} disabled={isLoading} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:bg-gray-400">
              <span>🔍</span>
              <span>{isLoading ? 'Analyzing...' : 'Analyze Bills'}</span>
            </button>
            <button onClick={handleDemoClick} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors">
              <span>🎯</span>
              <span>Try Demo</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6">
          <Progress value={progress} />
        </div>
      )}


    </div>
  );
};

export default FileUpload;