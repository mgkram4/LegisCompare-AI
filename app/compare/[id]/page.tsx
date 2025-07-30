'use client';

import AnimatedHeader from '@/components/AnimatedHeader';
import BiasDetectionMeter from '@/components/BiasDetectionMeter';
import Card from '@/components/Card';
import CodeViewer from '@/components/CodeViewer';
import CostEstimationPanel from '@/components/CostEstimationPanel';
import DiffViewer from '@/components/DiffViewer';
import KeyInsightsSummary from '@/components/KeyInsightsSummary';
import LoadingAnimation from '@/components/LoadingAnimation';
import SectorImpactVisualization from '@/components/SectorImpactVisualization';
import StakeholderChart from '@/components/StakeholderChart';
import TimelineForecast from '@/components/TimelineForecast';
import axios from 'axios';
import { AlertTriangle, Building, DollarSign, Lightbulb } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// ... (interfaces remain the same)
interface Section {
  section_id?: string;
  title?: string;
  line_start?: number;
  line_end?: number;
  text?: string;
}

interface NormalizedBill {
  bill_id?: string;
  sections?: Section[];
}

interface Pair {
  a_section_id?: string | null;
  b_section_id?: string | null;
  similarity?: number;
  rationale?: string;
}

interface Change {
  id?: string;
  change_type?: "addition" | "removal" | "modification";
  a_section_id?: string | null;
  b_section_id?: string | null;
  a_text?: string | null;
  b_text?: string | null;
  diff_preview?: string;
  impact?: {
    legal?: string;
    social?: string;
    economic?: string;
  };
  evidence?: Array<{ bill_id?: string; section_id?: string; line_range?: string }>;
  confidence?: "low" | "medium" | "high";
  notes?: string;
}

interface Stakeholder {
  name?: string;
  category?: "industry" | "demographic" | "institution" | "ngo" | "other";
  effect?: "benefit" | "harm" | "mixed";
  mechanism?: string;
  magnitude?: "low" | "medium" | "high";
  time_horizon?: "short" | "medium" | "long";
  linked_changes?: string[];
  confidence?: "low" | "medium" | "high";
}

interface BiasAnalysis {
  type?: "demographic" | "socioeconomic" | "geographic" | "other";
  description?: string;
  impacted_groups?: string[];
  evidence?: Array<{ bill_id?: string; section_id?: string; line_range?: string }>;
  confidence?: "low" | "medium" | "high";
}

interface ForecastDetail {
  domain?: "economic" | "social" | "political" | "legal" | "operational";
  impact?: string;
  direction?: "increase" | "decrease" | "mixed" | "unknown";
  magnitude?: "low" | "medium" | "high";
  who?: string[];
  linked_changes?: string[];
  metrics_to_track?: string[];
  confidence?: "low" | "medium" | "high";
}

interface Forecast {
  assumptions?: string[];
  risks?: string[];
  forecasts?: {
    short_1y?: ForecastDetail[];
    medium_3y?: ForecastDetail[];
    long_5y?: ForecastDetail[];
  };
}

interface Critique {
  issues?: Array<{ path?: string; problem?: string }>;
  ok?: boolean;
}

interface CompareResponse {
  normalizedA: NormalizedBill;
  normalizedB: NormalizedBill;
  pairs: { pairs: Pair[] };
  changes: { changes: Change[] };
  stakeholders: { stakeholders: Stakeholder[] };
  forecast: Forecast;
  critique: Critique;
  bias_analysis: { bias_analysis: BiasAnalysis[] };
}


export default function CompareResultsPage() {
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CompareResponse | null>(null);
  const [billAContent, setBillAContent] = useState<string>('');
  const [billBContent, setBillBContent] = useState<string>('');

  useEffect(() => {
    const fetchBillsAndAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedBillA = localStorage.getItem(`billA-${id}`) || '';
        const storedBillB = localStorage.getItem(`billB-${id}`) || '';
        setBillAContent(storedBillA);
        setBillBContent(storedBillB);

        if (!storedBillA || !storedBillB) {
            setError('Bill content not found. Please upload bills again.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('billA_text', storedBillA);
        formData.append('billB_text', storedBillB);

        const response = await axios.post<CompareResponse>('/api/compare', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setAnalysisResult(response.data);
      } catch (err) {
        setError('Failed to fetch analysis results.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBillsAndAnalysis();
    }
  }, [id]);

  const handleExportPdf = async () => {
    const element = document.getElementById('comparison-results');
    if (element) {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf().from(element).save();
    }
  };

  const handleShare = () => {
    console.log('Sharing...');
  };

  if (loading) return <LoadingAnimation />;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (!analysisResult) return <div className="text-center text-gray-500 mt-10">No analysis results found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" id="comparison-results">
      <AnimatedHeader comparisonId={id as string} progress={loading ? 50 : 100} />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Legislative Analysis Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comparison ID: {id}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card title="Key Insights" icon={<Lightbulb className="w-5 h-5" />}>
            <KeyInsightsSummary 
              changes={analysisResult.changes?.changes || []}
              stakeholders={analysisResult.stakeholders?.stakeholders || []}
              biasAnalysis={analysisResult.bias_analysis?.bias_analysis || []}
            />
          </Card>
          <Card title="Bias Assessment" icon={<AlertTriangle className="w-5 h-5" />}>
            <BiasDetectionMeter 
              biasAnalysis={analysisResult.bias_analysis?.bias_analysis || []}
            />
          </Card>
          <Card title="Cost Impact" icon={<DollarSign className="w-5 h-5" />}>
            <CostEstimationPanel 
              forecast={analysisResult.forecast || {}}
              changes={analysisResult.changes?.changes || []}
            />
          </Card>
          <Card title="Sector Impact" icon={<Building className="w-5 h-5" />}>
            <SectorImpactVisualization 
              stakeholders={analysisResult.stakeholders?.stakeholders || []}
              forecast={analysisResult.forecast || {}}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Legislative Changes" icon="🔍">
              <DiffViewer billA={billAContent} billB={billBContent} />
            </Card>
            <Card title="Stakeholder Impact" icon="👥">
              {analysisResult.stakeholders.stakeholders && analysisResult.stakeholders.stakeholders.length > 0 ? (
                <StakeholderChart stakeholders={analysisResult.stakeholders.stakeholders} />
              ) : (
                <p className="text-slate-400 text-sm">No stakeholder data available for analysis.</p>
              )}
            </Card>
            <Card title="Implementation Timeline" icon="⏳">
              {analysisResult.forecast ? (
                <TimelineForecast forecast={analysisResult.forecast} />
              ) : (
                <p className="text-slate-400 text-sm">No timeline forecast available.</p>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Source Documents" icon="📄">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-2 text-gray-700 dark:text-gray-300">Original Version</h3>
                  <CodeViewer code={billAContent} />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-2 text-gray-700 dark:text-gray-300">Proposed Version</h3>
                  <CodeViewer code={billBContent} />
                </div>
              </div>
            </Card>
            <Card title="Technical Details" icon="⚙️">
               <details className="group">
                  <summary className="cursor-pointer list-none flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-colors">
                    <span className="text-sm font-medium text-gray-800 dark:text-slate-200">View Technical Analysis</span>
                    <svg className="w-4 h-4 text-gray-500 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  
                  <div className="mt-3 space-y-3 text-xs">
                    <div className="bg-gray-100 dark:bg-slate-800/50 p-3 rounded border border-gray-200 dark:border-slate-600/30">
                      <h4 className="text-gray-800 dark:text-slate-300 font-medium mb-2">Document Structure Analysis</h4>
                      <pre className="text-gray-600 dark:text-slate-400 text-xs overflow-auto max-h-32">{JSON.stringify(analysisResult.normalizedA, null, 2)}</pre>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-800/50 p-3 rounded border border-gray-200 dark:border-slate-600/30">
                      <h4 className="text-gray-800 dark:text-slate-300 font-medium mb-2">Section Alignment Data</h4>
                      <pre className="text-gray-600 dark:text-slate-400 text-xs overflow-auto max-h-32">{JSON.stringify(analysisResult.pairs, null, 2)}</pre>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-800/50 p-3 rounded border border-gray-200 dark:border-slate-600/30">
                      <h4 className="text-gray-800 dark:text-slate-300 font-medium mb-2">Analysis Quality Assessment</h4>
                      <pre className="text-gray-600 dark:text-slate-400 text-xs overflow-auto max-h-32">{JSON.stringify(analysisResult.critique, null, 2)}</pre>
                    </div>
                  </div>
                </details>
            </Card>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-slate-600/50">
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-sm"
          >
            Export Report
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none font-medium text-sm"
          >
            Share Results
          </button>
        </div>
      </main>
    </div>
  );
}