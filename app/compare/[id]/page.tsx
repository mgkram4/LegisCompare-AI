'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ImpactForecast } from '@/components/ImpactForecast';
import { KeyChanges } from '@/components/KeyChanges';
import { ReportHeader } from '@/components/ReportHeader';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { StakeholderAnalysis } from '@/components/StakeholderAnalysis';
import { getFileFromLocalStorage } from '@/file-storage';

// --- Data Interfaces (Matching the new RAG API response) ---

interface KeyChange {
  topic: string;
  description: string;
  impact: string;
  original_quote: string;
  proposed_quote: string;
}

interface Stakeholder {
  name: string;
  category: string;
  effect: 'benefit' | 'harm' | 'mixed';
  description: string;
  evidence_quote: string;
}

interface Forecast {
  economic: string;
  social: string;
  political: string;
}

interface ImpactForecastData {
  assumptions: string[];
  short_term_1y: Forecast;
  medium_term_3y: Forecast;
  long_term_5y: Forecast;
}

interface AnalysisResult {
  executive_summary: {
    bill_a_title: string;
    bill_b_title: string;
    primary_subject: string;
    key_changes: KeyChange[];
    overall_impact_assessment: string;
  };
  stakeholder_analysis: Stakeholder[];
  impact_forecast: ImpactForecastData;
  metadata: {
    bill_a_name: string;
    bill_b_name: string;
    processed_at: string;
  };
}




export default function CompareResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const runAnalysis = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use the new centralized file retrieval function
        const fileA = await getFileFromLocalStorage(`billA-file-${id}`);
        const fileB = await getFileFromLocalStorage(`billB-file-${id}`);

        if (!fileA || !fileB) {
          setError('Could not find one or both documents in storage. Please try re-uploading.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('bill_a_file', fileA);
        formData.append('bill_b_file', fileB);

        const response = await axios.post<AnalysisResult>('https://mixed-stove-production.up.railway.app/api/compare', formData);
        setAnalysisResult(response.data);

      } catch (err) {
        console.error(err);
        const message = axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : 'An unexpected error occurred during analysis.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      runAnalysis();
    }
  }, [id]);

  if (loading) {
    return <SkeletonLoader />;
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Analysis Failed</h2>
            <p className="text-gray-700">{error}</p>
          </div>
      </div>
    );
  }

  if (!analysisResult) {
    return <div className="text-center text-gray-500 mt-10">No analysis results found.</div>;
  }
  
  const { executive_summary, stakeholder_analysis, impact_forecast, metadata } = analysisResult;

  return (
    <div className="bg-slate-50 min-h-screen">
      <ReportHeader 
        billAName={metadata.bill_a_name}
        billBName={metadata.bill_b_name}
        subject={executive_summary.primary_subject}
        reportDate={metadata.processed_at}
        />
        
      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-12">
        <section id="summary">
            <h2 className="text-2xl font-semibold text-slate-800 border-b-2 border-slate-300 pb-2 mb-4">
                Executive Summary
            </h2>
            <p className="text-lg text-slate-700 italic">
                {executive_summary.overall_impact_assessment}
            </p>
        </section>

        <KeyChanges changes={executive_summary.key_changes} showQuotes={true} />

        <StakeholderAnalysis stakeholders={stakeholder_analysis} groupByCategory={true} />
        
        <ImpactForecast forecast={impact_forecast} showAssumptions={true} />
        
      </main>
    </div>
  );
}
