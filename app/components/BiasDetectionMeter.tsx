'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, BarChart3, Shield, Users } from 'lucide-react';
import React from 'react';

interface BiasAnalysis {
  type?: "demographic" | "socioeconomic" | "geographic" | "other";
  description?: string;
  impacted_groups?: string[];
  evidence?: Array<{ bill_id?: string; section_id?: string; line_range?: string }>;
  confidence?: "low" | "medium" | "high";
}

interface BiasDetectionMeterProps {
  biasAnalysis: BiasAnalysis[];
}

const BiasDetectionMeter: React.FC<BiasDetectionMeterProps> = ({ biasAnalysis }) => {
  const calculateBiasScore = (): number => {
    if (!biasAnalysis || biasAnalysis.length === 0) return 0;
    
    const severityWeights = { low: 25, medium: 50, high: 75 };
    const typeWeights = { demographic: 1.2, socioeconomic: 1.1, geographic: 1.0, other: 0.9 };
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    biasAnalysis.forEach(bias => {
      const confidenceWeight = severityWeights[bias.confidence || 'low'];
      const typeWeight = typeWeights[bias.type || 'other'];
      const score = confidenceWeight * typeWeight;
      
      totalScore += score;
      maxPossibleScore += 75 * 1.2;
    });
    
    return maxPossibleScore > 0 ? Math.min(Math.round((totalScore / maxPossibleScore) * 100), 100) : 0;
  };

  const biasScore = calculateBiasScore();
  
  const getBiasLevel = (score: number): { level: string; color: string; textColor: string } => {
    if (score <= 30) return { level: 'Low', color: 'from-green-500 to-green-600', textColor: 'text-green-400' };
    if (score <= 60) return { level: 'Moderate', color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-400' };
    return { level: 'High', color: 'from-red-500 to-red-600', textColor: 'text-red-400' };
  };

  const { level, color, textColor } = getBiasLevel(biasScore);

  const getBiasTypeIcon = (type: string) => {
    switch (type) {
      case 'demographic': return <Users className="w-4 h-4" />;
      case 'socioeconomic': return <BarChart3 className="w-4 h-4" />;
      case 'geographic': return <Shield className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const biasBreakdown = biasAnalysis.reduce((acc, bias) => {
    const type = bias.type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="relative mb-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-700"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={`bg-gradient-to-r ${color}`}
                style={{
                  stroke: `url(#bias-gradient-${biasScore})`,
                  strokeDasharray: `${2 * Math.PI * 50}`,
                  strokeDashoffset: `${2 * Math.PI * 50 * (1 - biasScore / 100)}`,
                }}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - biasScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id={`bias-gradient-${biasScore}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={biasScore <= 30 ? "#10b981" : biasScore <= 60 ? "#f59e0b" : "#ef4444"} />
                  <stop offset="100%" stopColor={biasScore <= 30 ? "#059669" : biasScore <= 60 ? "#d97706" : "#dc2626"} />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className={`text-2xl font-bold ${textColor}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {biasScore}
              </motion.span>
              <span className="text-xs text-gray-400">Score</span>
            </div>
          </div>
          
          <div className="text-center">
            <span className={`text-sm font-medium ${textColor}`}>{level} Bias Risk</span>
            <p className="text-xs text-gray-400 mt-1">
              {biasAnalysis.length} potential bias{biasAnalysis.length !== 1 ? 'es' : ''} detected
            </p>
          </div>
        </div>
      </div>

      {Object.keys(biasBreakdown).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Breakdown by Type</h4>
          {Object.entries(biasBreakdown).map(([type, count]) => (
            <motion.div 
              key={type}
              className="flex items-center justify-between p-2 bg-gray-700/30 rounded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                {getBiasTypeIcon(type)}
                <span className="text-sm text-gray-300 capitalize">{type}</span>
              </div>
              <span className="text-xs font-medium text-gray-400">{count}</span>
            </motion.div>
          ))}
        </div>
      )}

      {biasAnalysis.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Confidence</span>
            <div className="flex gap-1">
              {['low', 'medium', 'high'].map(level => {
                const count = biasAnalysis.filter(b => b.confidence === level).length;
                return count > 0 ? (
                  <span key={level} className={`text-xs px-2 py-1 rounded ${
                    level === 'high' ? 'bg-red-900/30 text-red-300' :
                    level === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                    'bg-gray-700/30 text-gray-300'
                  }`}>
                    {count} {level}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiasDetectionMeter;