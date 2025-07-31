'use client';


import { storeFileInLocalStorage } from '@/file-storage';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, Upload, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SimpleDocumentCompare: React.FC = () => {
  const router = useRouter();
  const [billAFile, setBillAFile] = useState<File | null>(null);
  const [billBFile, setBillBFile] = useState<File | null>(null);
  const [billAText, setBillAText] = useState('');
  const [billBText, setBillBText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (file: File | null, setBillFile: (file: File | null) => void, setBillText: (text: string) => void) => {
    if (!file) return;
    
    setBillFile(file);
    
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBillText(e.target?.result as string || '');
      };
      reader.readAsText(file);
    } else {
      setBillText(''); // For PDF files, we'll let the backend handle extraction
    }
  };

  const handleDemoMode = async () => {
    setLoading(true);
    setError(null);

    try {
      const billAContent =
        "SECTION 1. SHORT TITLE. This Act may be cited as the 'Education Equity and Access Act'. SECTION 2. FUNDING. Establishes a $1.5 billion annual fund for Title I schools for 5 years. SECTION 3. DIGITAL ACCESS. Provides technology access for students in grades 6-12. SECTION 4. TEACHER SUPPORT. Creates professional development programs.";
      const billBContent =
        "SECTION 1. SHORT TITLE. This Act may be cited as the 'Enhanced Education Equity and Access Act'. SECTION 2. FUNDING. Establishes a $2 billion annual fund for Title I and rural schools for 6 years. SECTION 3. DIGITAL ACCESS. Provides technology access for students in grades 3-12. SECTION 4. TEACHER SUPPORT. Creates professional development programs with enhanced accountability measures.";

      const billAFile = new File([billAContent], 'education-equity-original.txt', { type: 'text/plain' });
      const billBFile = new File([billBContent], 'education-equity-enhanced.txt', { type: 'text/plain' });

      setBillAFile(billAFile);
      setBillBFile(billBFile);
      setBillAText(billAContent);
      setBillBText(billBContent);

      const comparisonId = uuidv4();

      await storeFileInLocalStorage(`billA-file-${comparisonId}`, billAFile);
      await storeFileInLocalStorage(`billB-file-${comparisonId}`, billBFile);

      router.push(`/compare/${comparisonId}`);
    } catch (error) {
      console.error('Demo mode error:', error);
      setError('Failed to load demo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if ((!billAFile && !billAText) || (!billBFile && !billBText)) {
      setError('Please provide both documents for comparison.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const comparisonId = uuidv4();

      const fileA = billAFile || new File([billAText], 'bill-a.txt', { type: 'text/plain' });
      const fileB = billBFile || new File([billBText], 'bill-b.txt', { type: 'text/plain' });

      await storeFileInLocalStorage(`billA-file-${comparisonId}`, fileA);
      await storeFileInLocalStorage(`billB-file-${comparisonId}`, fileB);

      router.push(`/compare/${comparisonId}`);
    } catch (error) {
      console.error('Comparison error:', error);
      setError('Failed to start comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pt-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Legislative Document Comparison
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Upload two legislative documents to get AI-powered analysis of changes, impacts, and debate topics
          </p>
        </motion.div>

        {/* Upload Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bill A Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                Original Document
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null, setBillAFile, setBillAText)}
                  className="hidden"
                  id="billA-upload"
                />
                <label htmlFor="billA-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload PDF or TXT file
                  </p>
                  {billAFile && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Selected: {billAFile.name}
                    </p>
                  )}
                </label>
              </div>
              
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm">OR</div>
              
              <textarea
                placeholder="Paste document text here..."
                value={billAText}
                onChange={(e) => setBillAText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Bill B Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">B</div>
                Proposed Document
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null, setBillBFile, setBillBText)}
                  className="hidden"
                  id="billB-upload"
                />
                <label htmlFor="billB-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload PDF or TXT file
                  </p>
                  {billBFile && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Selected: {billBFile.name}
                    </p>
                  )}
                </label>
              </div>
              
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm">OR</div>
              
              <textarea
                placeholder="Paste document text here..."
                value={billBText}
                onChange={(e) => setBillBText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleDemoMode}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Try Demo
            </button>
            <button
              onClick={handleCompare}
              disabled={loading || (!billAFile && !billAText) || (!billBFile && !billBText)}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Compare Documents
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced AI identifies key changes, debate topics, and impact analysis
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">PDF & Text Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload PDF files or paste text directly for instant analysis
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Comprehensive Report</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Executive summary with debate topics, stakeholder impact, and more
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleDocumentCompare;