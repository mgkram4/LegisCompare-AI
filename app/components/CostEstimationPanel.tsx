'use client';

import { motion } from 'framer-motion';
import { Calendar, PieChart, TrendingUp } from 'lucide-react';
import React from 'react';

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

interface Change {
  id?: string;
  change_type?: "addition" | "removal" | "modification";
  impact?: {
    legal?: string;
    social?: string;
    economic?: string;
  };
  confidence?: "low" | "medium" | "high";
}

interface CostEstimationPanelProps {
  forecast: Forecast;
  changes: Change[];
}

const CostEstimationPanel: React.FC<CostEstimationPanelProps> = ({ forecast, changes }) => {
  const estimateFiscalImpact = (): { min: number; max: number; currency: string } => {
    if (!changes || changes.length === 0) return { min: 0, max: 0, currency: 'USD' };
    
    const baseImpact = changes.length * 1000000;
    
    let multiplier = 1;
    changes.forEach(change => {
      if (change.change_type === 'addition') multiplier += 0.5;
      if (change.change_type === 'modification') multiplier += 0.3;
      if (change.confidence === 'high') multiplier += 0.2;
    });
    
    const min = Math.round(baseImpact * multiplier * 0.5);
    const max = Math.round(baseImpact * multiplier * 2);
    
    return { min, max, currency: 'USD' };
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount}`;
  };

  const getImplementationTimeline = (): { phase: string; duration: string; description: string }[] => {
    return [
      { phase: 'Planning', duration: '3-6 months', description: 'Policy development and regulatory preparation' },
      { phase: 'Implementation', duration: '6-12 months', description: 'System updates and process changes' },
      { phase: 'Full Effect', duration: '12-24 months', description: 'Complete rollout and stabilization' },
    ];
  };

  const getDepartmentBreakdown = (): { department: string; percentage: number; color: string }[] => {
    return [
      { department: 'Operations', percentage: 40, color: 'bg-blue-500' },
      { department: 'Technology', percentage: 25, color: 'bg-green-500' },
      { department: 'Legal/Compliance', percentage: 20, color: 'bg-purple-500' },
      { department: 'Training', percentage: 10, color: 'bg-yellow-500' },
      { department: 'Administrative', percentage: 5, color: 'bg-gray-500' },
    ];
  };

  const fiscal = estimateFiscalImpact();
  const timeline = getImplementationTimeline();
  const departments = getDepartmentBreakdown();

  const getImpactSeverity = (): { level: string; color: string } => {
    const maxImpact = fiscal.max;
    if (maxImpact < 10000000) return { level: 'Low', color: 'text-green-400' };
    if (maxImpact < 100000000) return { level: 'Moderate', color: 'text-yellow-400' };
    return { level: 'High', color: 'text-red-400' };
  };

  const { level, color } = getImpactSeverity();

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Estimated Fiscal Impact</span>
          <span className={`text-xs font-medium ${color}`}>{level} Impact</span>
        </div>
        
        <motion.div 
          className="bg-gray-700/30 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold text-green-400 mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {formatCurrency(fiscal.min)} - {formatCurrency(fiscal.max)}
            </motion.div>
            <p className="text-xs text-gray-400">Projected over implementation period</p>
          </div>
        </motion.div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">Implementation Timeline</span>
        </div>
        
        <div className="space-y-3">
          {timeline.map((phase, index) => (
            <motion.div 
              key={phase.phase}
              className="flex items-start gap-3 p-2 bg-gray-700/20 rounded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">{phase.phase}</span>
                  <span className="text-xs text-blue-400">{phase.duration}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{phase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">Cost Breakdown</span>
        </div>
        
        <div className="space-y-2">
          {departments.map((dept, index) => (
            <motion.div 
              key={dept.department}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300">{dept.department}</span>
                  <span className="text-xs text-gray-400">{dept.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div 
                    className={`h-1.5 rounded-full ${dept.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.percentage}%` }}
                    transition={{ delay: 0.5 + 0.1 * index, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {forecast.risks && forecast.risks.length > 0 && (
        <div className="pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-medium text-gray-300">Key Risks</span>
          </div>
          <div className="text-xs text-gray-400">
            {forecast.risks.slice(0, 2).map((risk, index) => (
              <div key={index} className="flex items-start gap-2 mb-1">
                <span className="text-orange-400">•</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CostEstimationPanel;