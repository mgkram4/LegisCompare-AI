'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, DollarSign, FileText, Quote, Scale, Users } from 'lucide-react';
import React from 'react';

interface DocumentOverview {
  bill_a_title?: string;
  bill_b_title?: string;
  primary_subject?: string;
  scope?: 'federal' | 'state' | 'local';
  urgency?: 'high' | 'medium' | 'low';
}

interface DebateTopic {
  topic?: string;
  description?: string;
  stakeholder_positions?: string;
  priority?: 'high' | 'medium' | 'low';
  supporting_quotes?: Array<{
    source?: string;
    section?: string;
    line_range?: string;
    quote?: string;
    relevance?: string;
  }>;
}

interface BiggestChange {
  change_title?: string;
  impact_summary?: string;
  debate_likelihood?: 'high' | 'medium' | 'low';
  affected_population?: string;
  dollar_impact?: string;
  evidence_quotes?: Array<{
    comparison?: string;
    original_quote?: string;
    proposed_quote?: string;
    line_references?: string;
  }>;
}

interface PoliticalImplications {
  partisan_potential?: 'high' | 'medium' | 'low';
  implementation_challenges?: string[];
  timeline_factors?: string;
}

interface ExecutiveSummaryData {
  document_overview?: DocumentOverview;
  key_debate_topics?: DebateTopic[];
  biggest_changes?: BiggestChange[];
  political_implications?: PoliticalImplications;
  citizen_impact_summary?: string;
}



interface ExecutiveSummaryProps {
  summary: ExecutiveSummaryData;
  billAContent?: string;
  billBContent?: string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ 
  summary: data,
  billAContent = '',
  billBContent = ''
}) => {
  // Debug logging for frontend data structure
  console.log('[EXECUTIVE_SUMMARY] Received data:', {
    dataExists: !!data,
    dataKeys: data ? Object.keys(data) : 'none',
    dataType: typeof data,
    hasExecutiveSummary: data && 'executive_summary' in data,
    hasDocumentOverview: data?.document_overview ? true : false,
    hasKeyDebateTopics: data?.key_debate_topics ? data.key_debate_topics.length : 0,
    hasBiggestChanges: data?.biggest_changes ? data.biggest_changes.length : 0,
    hasPoliticalImplications: data?.political_implications ? true : false,
    hasCitizenImpact: data?.citizen_impact_summary ? true : false
  });

  // Check if data has error property
  const dataWithError = data as Record<string, unknown> & { error?: string; rawResponse?: string };
  if (data && dataWithError.error) {
    console.error('[EXECUTIVE_SUMMARY] Error in analysis data:', dataWithError.error);
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 mb-6">
        <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Analysis Error</h3>
        <p className="text-red-700 dark:text-red-300 text-sm">{dataWithError.error}</p>
        {dataWithError.rawResponse && (
          <details className="mt-3">
            <summary className="text-red-600 dark:text-red-400 cursor-pointer">Show raw response</summary>
            <pre className="text-xs text-red-600 dark:text-red-400 mt-2 whitespace-pre-wrap bg-red-100 dark:bg-red-900/30 p-2 rounded">
              {dataWithError.rawResponse}
            </pre>
          </details>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">Executive summary not available.</p>
      </div>
    );
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getScopeIcon = (scope?: string) => {
    switch (scope) {
      case 'federal': return <Scale className="w-4 h-4" />;
      case 'state': return <Users className="w-4 h-4" />;
      case 'local': return <Users className="w-4 h-4" />;
      default: return <Scale className="w-4 h-4" />;
    }
  };

  // Component to display citations and quotes
  const CitationBox: React.FC<{ 
    quotes?: Array<{
      source?: string;
      section?: string;
      line_range?: string;
      quote?: string;
      relevance?: string;
    }>;
    evidenceQuotes?: Array<{
      comparison?: string;
      original_quote?: string;
      proposed_quote?: string;
      line_references?: string;
    }>;
    sourceQuotes?: {
      original?: string;
      proposed?: string;
    };
  }> = ({ quotes, evidenceQuotes, sourceQuotes }) => {
    const hasContent = (quotes && quotes.length > 0) || 
                      (evidenceQuotes && evidenceQuotes.length > 0) || 
                      (sourceQuotes && (sourceQuotes.original || sourceQuotes.proposed));
                      
    if (!hasContent) return null;

    return (
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Quote className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Citations & Evidence</span>
        </div>
        
        {quotes && quotes.map((quote, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">
              <strong>{quote.source}</strong> | {quote.section} | Lines {quote.line_range}
            </div>
            <blockquote className="text-xs italic text-gray-700 dark:text-gray-300 border-l-2 border-blue-300 pl-2 mb-1">
              &ldquo;{quote.quote}&rdquo;
            </blockquote>
            {quote.relevance && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Relevance:</strong> {quote.relevance}
              </div>
            )}
          </div>
        ))}

        {evidenceQuotes && evidenceQuotes.map((evidence, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">
              <strong>Comparison:</strong> {evidence.line_references}
            </div>
            {evidence.original_quote && (
              <div className="mb-2">
                <div className="text-xs font-medium text-red-700 dark:text-red-400">Original:</div>
                <blockquote className="text-xs italic text-gray-700 dark:text-gray-300 border-l-2 border-red-300 pl-2">
                  &ldquo;{evidence.original_quote}&rdquo;
                </blockquote>
              </div>
            )}
            {evidence.proposed_quote && (
              <div>
                <div className="text-xs font-medium text-green-700 dark:text-green-400">Proposed:</div>
                <blockquote className="text-xs italic text-gray-700 dark:text-gray-300 border-l-2 border-green-300 pl-2">
                  &ldquo;{evidence.proposed_quote}&rdquo;
                </blockquote>
              </div>
            )}
          </div>
        ))}

        {sourceQuotes && (sourceQuotes.original || sourceQuotes.proposed) && (
          <div className="mb-3 last:mb-0">
            {sourceQuotes.original && (
              <div className="mb-2">
                <div className="text-xs font-medium text-red-700 dark:text-red-400">Original Text:</div>
                <blockquote className="text-xs italic text-gray-700 dark:text-gray-300 border-l-2 border-red-300 pl-2">
                  &ldquo;{sourceQuotes.original}&rdquo;
                </blockquote>
              </div>
            )}
            {sourceQuotes.proposed && (
              <div>
                <div className="text-xs font-medium text-green-700 dark:text-green-400">Proposed Text:</div>
                <blockquote className="text-xs italic text-gray-700 dark:text-gray-300 border-l-2 border-green-300 pl-2">
                  &ldquo;{sourceQuotes.proposed}&rdquo;
                </blockquote>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Executive Summary</h2>
      </div>

      {/* Document Overview */}
      {data.document_overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {getScopeIcon(data.document_overview.scope)}
              Document Overview
            </h3>
            <div className="text-sm space-y-1">
              {data.document_overview.bill_a_title && (
                <p><span className="font-medium">Original:</span> {data.document_overview.bill_a_title}</p>
              )}
              {data.document_overview.bill_b_title && (
                <p><span className="font-medium">Proposed:</span> {data.document_overview.bill_b_title}</p>
              )}
              {data.document_overview.primary_subject && (
                <p><span className="font-medium">Subject:</span> {data.document_overview.primary_subject}</p>
              )}
              <div className="flex items-center gap-2">
                {data.document_overview.scope && (
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-medium">
                    {data.document_overview.scope?.toUpperCase()}
                  </span>
                )}
                {data.document_overview.urgency && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(data.document_overview.urgency)}`}>
                    {data.document_overview.urgency?.toUpperCase()} URGENCY
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Citizen Impact */}
          {data.citizen_impact_summary && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Impact on Americans
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 p-3 rounded border">
                {data.citizen_impact_summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Key Debate Topics */}
      {data.key_debate_topics && data.key_debate_topics.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Key Topics for Debate
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.key_debate_topics.slice(0, 4).map((topic, index) => (
              <div key={index} className="bg-white dark:bg-gray-800/50 p-4 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{topic.topic}</h4>
                  {topic.priority && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(topic.priority)}`}>
                      {topic.priority?.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{topic.description}</p>
                {topic.stakeholder_positions && (
                  <p className="text-xs text-gray-500 dark:text-gray-500"><strong>Positions:</strong> {topic.stakeholder_positions}</p>
                )}
                <CitationBox quotes={topic.supporting_quotes} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biggest Changes */}
      {data.biggest_changes && data.biggest_changes.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Most Significant Changes
          </h3>
          <div className="space-y-3">
            {data.biggest_changes.slice(0, 3).map((change, index) => (
              <div key={index} className="bg-white dark:bg-gray-800/50 p-4 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">#{index + 1} {change.change_title}</h4>
                  {change.debate_likelihood && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(change.debate_likelihood)}`}>
                      {change.debate_likelihood?.toUpperCase()} DEBATE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{change.impact_summary}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  {change.affected_population && (
                    <span><strong>Affects:</strong> {change.affected_population}</span>
                  )}
                  {change.dollar_impact && (
                    <span><strong>Cost:</strong> {change.dollar_impact}</span>
                  )}
                </div>
                <CitationBox evidenceQuotes={change.evidence_quotes} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Political Implications */}
      {data.political_implications && (
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded border border-gray-200 dark:border-gray-600 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Political & Implementation Considerations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {data.political_implications.partisan_potential && (
              <div>
                <span className="font-medium">Partisan Potential:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(data.political_implications.partisan_potential)}`}>
                  {data.political_implications.partisan_potential?.toUpperCase()}
                </span>
              </div>
            )}
            {data.political_implications.implementation_challenges && data.political_implications.implementation_challenges.length > 0 && (
              <div>
                <span className="font-medium">Challenges:</span>
                <ul className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {data.political_implications.implementation_challenges.slice(0, 3).map((challenge, index) => (
                    <li key={index}>• {challenge}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.political_implications.timeline_factors && (
              <div>
                <span className="font-medium">Timeline:</span>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{data.political_implications.timeline_factors}</p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Document Text Comparison */}
      {(billAContent || billBContent) && (
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Document Text Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {billAContent && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Original Document</h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded text-xs font-mono text-gray-600 dark:text-gray-400 max-h-48 overflow-y-auto">
                  {billAContent}
                </div>
              </div>
            )}
            {billBContent && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Proposed Document</h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded text-xs font-mono text-gray-600 dark:text-gray-400 max-h-48 overflow-y-auto">
                  {billBContent}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExecutiveSummary;