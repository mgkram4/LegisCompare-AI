'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, Lightbulb, Star, TrendingUp } from 'lucide-react';
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
  us_priority_score?: number;
  keywords?: string[];
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

// Helper function to calculate impact score for prioritizing changes by US value
const calculateImpactScore = (change: Change): number => {
  // Use AI-generated priority score if available, otherwise fallback to manual calculation
  if (change.us_priority_score && change.us_priority_score > 0) {
    return change.us_priority_score;
  }
  
  let score = 0;
  
  // Economic impact scoring (highest priority for US)
  const economicImpact = change.impact?.economic?.toLowerCase() || '';
  if (economicImpact.includes('billion')) score += 100;
  else if (economicImpact.includes('million')) score += 50;
  else if (economicImpact.includes('cost') || economicImpact.includes('budget') || economicImpact.includes('fund')) score += 30;
  else if (economicImpact.includes('tax') || economicImpact.includes('revenue')) score += 40;
  
  // Legal impact scoring
  const legalImpact = change.impact?.legal?.toLowerCase() || '';
  if (legalImpact.includes('federal') || legalImpact.includes('constitution')) score += 80;
  else if (legalImpact.includes('state') || legalImpact.includes('government')) score += 40;
  else if (legalImpact.includes('regulation') || legalImpact.includes('compliance')) score += 30;
  
  // Social impact scoring
  const socialImpact = change.impact?.social?.toLowerCase() || '';
  if (socialImpact.includes('million') || socialImpact.includes('national')) score += 60;
  else if (socialImpact.includes('healthcare') || socialImpact.includes('education') || socialImpact.includes('security')) score += 70;
  else if (socialImpact.includes('benefit') || socialImpact.includes('service')) score += 25;
  
  // Confidence multiplier
  if (change.confidence === 'high') score *= 1.5;
  else if (change.confidence === 'medium') score *= 1.2;
  else if (change.confidence === 'low') score *= 0.8;
  
  // Change type importance
  if (change.change_type === 'addition') score += 20;
  else if (change.change_type === 'removal') score += 30; // Removals often more impactful
  else if (change.change_type === 'modification') score += 15;
  
  return Math.round(score);
};

const KeyInsightsSummary: React.FC<KeyInsightsSummaryProps> = ({ 
  changes, 
  stakeholders, 
  biasAnalysis 
}) => {
  const generateInsights = (): KeyInsight[] => {
    const insights: KeyInsight[] = [];

    // Prioritize changes by economic, legal, and social impact value to the US
    const prioritizedChanges = changes
      ?.map(change => ({
        ...change,
        impactScore: calculateImpactScore(change)
      }))
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 3) || [];

    // Generate insights for top 3 most important changes
    prioritizedChanges.forEach((change, index) => {
      const priority = index === 0 ? 'highest' : index === 1 ? 'high' : 'medium';
      const economicImpact = change.impact?.economic || '';
      const legalImpact = change.impact?.legal || '';
      const socialImpact = change.impact?.social || '';
      
      let impactDescription = '';
      if (economicImpact && economicImpact.toLowerCase().includes('billion')) {
        impactDescription = 'Major economic impact with billion-dollar implications';
      } else if (economicImpact && (economicImpact.toLowerCase().includes('million') || economicImpact.toLowerCase().includes('cost'))) {
        impactDescription = 'Significant economic impact on federal budget or economy';
      } else if (legalImpact && legalImpact.toLowerCase().includes('federal')) {
        impactDescription = 'Federal law changes affecting national governance';
      } else if (socialImpact && (socialImpact.toLowerCase().includes('million') || socialImpact.toLowerCase().includes('benefit'))) {
        impactDescription = 'Wide-reaching social impact affecting many Americans';
      } else {
        impactDescription = `${change.change_type === 'addition' ? 'New provision' : change.change_type === 'removal' ? 'Removed provision' : 'Modified provision'} with national implications`;
      }

      const priorityScore = change.us_priority_score || change.impactScore || 0;
      const keywords = change.keywords?.slice(0, 3).join(', ') || '';
      
      insights.push({
        id: `top-change-${index + 1}`,
        text: `#${index + 1} Priority (Score: ${priorityScore}): ${impactDescription}${keywords ? ` | Key: ${keywords}` : ''}`,
        severity: priority === 'highest' ? 'high' : priority === 'high' ? 'medium' : 'low',
        urgency: priority === 'highest' ? 'high' : 'medium',
        category: 'change',
        icon: index === 0 ? <Star className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />,
        source: `Top ${index + 1} US Impact (${change.confidence || 'medium'} confidence)`
      });
    });

    // Add summary insights if we have changes
    if (changes && changes.length > 0) {
      const highConfidenceChanges = changes.filter(c => c.confidence === 'high');
      const economicChanges = changes.filter(c => 
        c.impact?.economic && (
          c.impact.economic.toLowerCase().includes('billion') ||
          c.impact.economic.toLowerCase().includes('million') ||
          c.impact.economic.toLowerCase().includes('cost') ||
          c.impact.economic.toLowerCase().includes('budget')
        )
      );

      if (economicChanges.length > 0) {
        insights.push({
          id: 'economic-impact',
          text: `${economicChanges.length} changes with significant economic impact on US budget or economy`,
          severity: 'high',
          urgency: 'high',
          category: 'change',
          icon: <TrendingUp className="w-4 h-4" />,
          source: 'Economic Analysis'
        });
      }

      if (highConfidenceChanges.length > 0) {
        insights.push({
          id: 'high-confidence-changes',
          text: `${highConfidenceChanges.length} high-confidence changes with verified legislative impact`,
          severity: 'medium',
          urgency: 'high',
          category: 'change',
          icon: <CheckCircle className="w-4 h-4" />,
          source: 'Confidence Analysis'
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