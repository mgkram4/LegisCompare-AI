'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, Lightbulb, Star, TrendingUp, XCircle } from 'lucide-react';
import React from 'react';

interface Change {
  id?: string;
  change_type?: "addition" | "removal" | "modification";
  a_section_id?: string | null;
  b_section_id?: string | null;
  diff_preview?: string;
  impact?: {
    legal?: string;
    social?: string;
    economic?: string;
  };
  confidence?: "low" | "medium" | "high";
}

interface Stakeholder {
  name?: string;
  category?: "industry" | "demographic" | "institution" | "ngo" | "other";
  effect?: "benefit" | "harm" | "mixed";
  magnitude?: "low" | "medium" | "high";
}

interface BiasAnalysis {
  type?: "demographic" | "socioeconomic" | "geographic" | "other";
  description?: string;
  confidence?: "low" | "medium" | "high";
}

interface KeyInsightsSummaryProps {
  changes: Change[];
  stakeholders: Stakeholder[];
  biasAnalysis: BiasAnalysis[];
}

interface KeyInsight {
  id: string;
  text: string;
  severity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  category: 'change' | 'stakeholder' | 'bias' | 'impact';
  icon: React.ReactNode;
  source?: string;
}

const KeyInsightsSummary: React.FC<KeyInsightsSummaryProps> = ({ 
  changes, 
  stakeholders, 
  biasAnalysis 
}) => {
  const generateInsights = (): KeyInsight[] => {
    const insights: KeyInsight[] = [];

    if (changes && changes.length > 0) {
      const highConfidenceChanges = changes.filter(c => c.confidence === 'high');
      const additions = changes.filter(c => c.change_type === 'addition');
      const removals = changes.filter(c => c.change_type === 'removal');

      if (highConfidenceChanges.length > 0) {
        insights.push({
          id: 'high-confidence-changes',
          text: `${highConfidenceChanges.length} high-confidence changes detected that will significantly alter the legislation`,
          severity: 'high',
          urgency: 'high',
          category: 'change',
          icon: <AlertCircle className="w-4 h-4" />,
          source: 'Changes Analysis'
        });
      }

      if (additions.length > 2) {
        insights.push({
          id: 'many-additions',
          text: `${additions.length} new sections added, expanding the scope of the legislation`,
          severity: 'medium',
          urgency: 'medium',
          category: 'change',
          icon: <TrendingUp className="w-4 h-4" />,
          source: 'Changes Analysis'
        });
      }

      if (removals.length > 0) {
        insights.push({
          id: 'content-removed',
          text: `${removals.length} sections removed, potentially reducing protections or benefits`,
          severity: 'medium',
          urgency: 'high',
          category: 'change',
          icon: <XCircle className="w-4 h-4" />,
          source: 'Changes Analysis'
        });
      }
    }

    if (stakeholders && stakeholders.length > 0) {
      const harmStakeholders = stakeholders.filter(s => s.effect === 'harm');
      const benefitStakeholders = stakeholders.filter(s => s.effect === 'benefit');
      const highMagnitudeStakeholders = stakeholders.filter(s => s.magnitude === 'high');

      if (harmStakeholders.length > benefitStakeholders.length) {
        insights.push({
          id: 'more-harm-than-benefit',
          text: `More stakeholder groups may be harmed (${harmStakeholders.length}) than benefited (${benefitStakeholders.length})`,
          severity: 'high',
          urgency: 'medium',
          category: 'stakeholder',
          icon: <AlertCircle className="w-4 h-4" />,
          source: 'Stakeholder Analysis'
        });
      }

      if (highMagnitudeStakeholders.length > 0) {
        insights.push({
          id: 'high-magnitude-impact',
          text: `${highMagnitudeStakeholders.length} stakeholder groups face high-magnitude impacts`,
          severity: 'medium',
          urgency: 'medium',
          category: 'stakeholder',
          icon: <Star className="w-4 h-4" />,
          source: 'Stakeholder Analysis'
        });
      }
    }

    if (biasAnalysis && biasAnalysis.length > 0) {
      const highConfidenceBias = biasAnalysis.filter(b => b.confidence === 'high');
      const demographicBias = biasAnalysis.filter(b => b.type === 'demographic');

      if (highConfidenceBias.length > 0) {
        insights.push({
          id: 'high-confidence-bias',
          text: `${highConfidenceBias.length} potential bias(es) identified with high confidence`,
          severity: 'high',
          urgency: 'high',
          category: 'bias',
          icon: <AlertCircle className="w-4 h-4" />,
          source: 'Bias Analysis'
        });
      }

      if (demographicBias.length > 0) {
        insights.push({
          id: 'demographic-bias',
          text: `Demographic bias detected affecting specific population groups`,
          severity: 'medium',
          urgency: 'medium',
          category: 'bias',
          icon: <AlertCircle className="w-4 h-4" />,
          source: 'Bias Analysis'
        });
      }
    }

    if (changes && changes.length > 5) {
      insights.push({
        id: 'comprehensive-changes',
        text: `Comprehensive legislation update with ${changes.length} total changes requiring careful review`,
        severity: 'medium',
        urgency: 'low',
        category: 'impact',
        icon: <Lightbulb className="w-4 h-4" />,
        source: 'Overall Analysis'
      });
    }

    return insights.slice(0, 5);
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-800/20 border-gray-500/30';
    }
  };

  const getUrgencyIcon = (urgency: string): React.ReactNode => {
    switch (urgency) {
      case 'high': return <Clock className="w-3 h-3 text-red-400" />;
      case 'medium': return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-3 h-3 text-green-400" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'change': return 'bg-blue-500';
      case 'stakeholder': return 'bg-purple-500';
      case 'bias': return 'bg-orange-500';
      case 'impact': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return (
      <p className="text-sm text-gray-400">No significant insights detected in the current analysis.</p>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-1 h-full ${getCategoryColor(insight.category)} rounded-full flex-shrink-0 mt-1`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {insight.icon}
                    <span className="text-sm font-medium text-gray-200">{insight.text}</span>
                  </div>
                  {getUrgencyIcon(insight.urgency)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{insight.source}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      insight.severity === 'high' ? 'bg-red-900/30 text-red-300' :
                      insight.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                      'bg-green-900/30 text-green-300'
                    }`}>
                      {insight.severity} severity
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      insight.urgency === 'high' ? 'bg-red-900/30 text-red-300' :
                      insight.urgency === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                      'bg-green-900/30 text-green-300'
                    }`}>
                      {insight.urgency} urgency
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-400">{changes?.length || 0}</div>
            <div className="text-xs text-gray-400">Total Changes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">{stakeholders?.length || 0}</div>
            <div className="text-xs text-gray-400">Stakeholders</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-400">{biasAnalysis?.length || 0}</div>
            <div className="text-xs text-gray-400">Bias Issues</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyInsightsSummary;