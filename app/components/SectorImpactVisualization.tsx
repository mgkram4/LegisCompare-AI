'use client';

import { motion } from 'framer-motion';
import { Briefcase, Building, GraduationCap, Heart, Home, Scale, Shield, Users } from 'lucide-react';
import React from 'react';

interface Stakeholder {
  name?: string;
  category?: "industry" | "demographic" | "institution" | "ngo" | "other";
  effect?: "benefit" | "harm" | "mixed";
  mechanism?: string;
  magnitude?: "low" | "medium" | "high";
  time_horizon?: "short" | "medium" | "long";
  confidence?: "low" | "medium" | "high";
}

interface ForecastDetail {
  domain?: "economic" | "social" | "political" | "legal" | "operational";
  impact?: string;
  direction?: "increase" | "decrease" | "mixed" | "unknown";
  magnitude?: "low" | "medium" | "high";
  who?: string[];
  confidence?: "low" | "medium" | "high";
}

interface Forecast {
  forecasts?: {
    short_1y?: ForecastDetail[];
    medium_3y?: ForecastDetail[];
    long_5y?: ForecastDetail[];
  };
}

interface SectorImpactVisualizationProps {
  stakeholders: Stakeholder[];
  forecast: Forecast;
}

interface SectorData {
  sector: string;
  icon: React.ReactNode;
  impactScore: number;
  stakeholderCount: number;
  primaryEffect: 'benefit' | 'harm' | 'mixed';
  confidence: 'low' | 'medium' | 'high';
  description: string;
  timeHorizon: 'short' | 'medium' | 'long';
}

const SectorImpactVisualization: React.FC<SectorImpactVisualizationProps> = ({ 
  stakeholders, 
  forecast 
}) => {
  const analyzeSectors = (): SectorData[] => {
    const sectorMap: { [key: string]: { name: string; icon: React.ReactNode; keywords: string[] } } = {
      healthcare: { name: 'Healthcare', icon: <Heart className="w-5 h-5" />, keywords: ['health', 'medical', 'hospital', 'doctor', 'patient', 'insurance', 'healthcare'] },
      finance: { name: 'Finance', icon: <Briefcase className="w-5 h-5" />, keywords: ['bank', 'financial', 'money', 'credit', 'loan', 'investment', 'finance'] },
      education: { name: 'Education', icon: <GraduationCap className="w-5 h-5" />, keywords: ['education', 'school', 'student', 'teacher', 'university', 'college', 'learning'] },
      legal: { name: 'Legal/Regulatory', icon: <Scale className="w-5 h-5" />, keywords: ['legal', 'court', 'judge', 'law', 'regulation', 'compliance', 'attorney'] },
      housing: { name: 'Housing', icon: <Home className="w-5 h-5" />, keywords: ['housing', 'rent', 'property', 'landlord', 'tenant', 'real estate', 'mortgage'] },
      business: { name: 'Business/Industry', icon: <Building className="w-5 h-5" />, keywords: ['business', 'industry', 'company', 'corporation', 'employer', 'commercial'] },
      social: { name: 'Social Services', icon: <Users className="w-5 h-5" />, keywords: ['social', 'community', 'service', 'welfare', 'benefit', 'assistance', 'support'] },
      government: { name: 'Government', icon: <Shield className="w-5 h-5" />, keywords: ['government', 'agency', 'federal', 'state', 'local', 'public', 'administration'] }
    };

    const sectors: { [key: string]: SectorData } = {};

    Object.entries(sectorMap).forEach(([key, value]) => {
      sectors[key] = {
        sector: value.name,
        icon: value.icon,
        impactScore: 0,
        stakeholderCount: 0,
        primaryEffect: 'mixed',
        confidence: 'low',
        description: '',
        timeHorizon: 'short'
      };
    });

    stakeholders.forEach(stakeholder => {
      const name = (stakeholder.name || '').toLowerCase();
      const mechanism = (stakeholder.mechanism || '').toLowerCase();
      
      let matchedSector: string | null = null;
      for (const [sectorKey, sectorInfo] of Object.entries(sectorMap)) {
        if (sectorInfo.keywords.some(keyword => name.includes(keyword) || mechanism.includes(keyword))) {
          matchedSector = sectorKey;
          break;
        }
      }

      if (matchedSector) {
        const sector = sectors[matchedSector];
        sector.stakeholderCount++;
        
        const magnitudeScore = stakeholder.magnitude === 'high' ? 3 : stakeholder.magnitude === 'medium' ? 2 : 1;
        const confidenceScore = stakeholder.confidence === 'high' ? 1.5 : stakeholder.confidence === 'medium' ? 1.2 : 1;
        sector.impactScore += magnitudeScore * confidenceScore;

        if (stakeholder.effect === 'harm') sector.primaryEffect = sector.primaryEffect === 'benefit' ? 'mixed' : 'harm';
        else if (stakeholder.effect === 'benefit') sector.primaryEffect = sector.primaryEffect === 'harm' ? 'mixed' : 'benefit';

        if (stakeholder.confidence === 'high' && sector.confidence !== 'high') sector.confidence = 'high';
        else if (stakeholder.confidence === 'medium' && sector.confidence === 'low') sector.confidence = 'medium';

        if (stakeholder.time_horizon === 'short') sector.timeHorizon = 'short';
        else if (stakeholder.time_horizon === 'medium' && sector.timeHorizon === 'long') sector.timeHorizon = 'medium';

        if (stakeholder.mechanism && !sector.description.includes(stakeholder.mechanism)) {
          sector.description = stakeholder.mechanism.slice(0, 80) + (stakeholder.mechanism.length > 80 ? '...' : '');
        }
      }
    });

    const allForecasts = [
      ...(forecast.forecasts?.short_1y || []),
      ...(forecast.forecasts?.medium_3y || []),
      ...(forecast.forecasts?.long_5y || [])
    ];

    allForecasts.forEach(forecastItem => {
      if (forecastItem.domain === 'economic') {
        sectors.finance.impactScore += 1;
        sectors.business.impactScore += 1;
      } else if (forecastItem.domain === 'social') {
        sectors.social.impactScore += 1;
      } else if (forecastItem.domain === 'legal') {
        sectors.legal.impactScore += 1;
      }
    });

    return Object.values(sectors)
      .filter(sector => sector.stakeholderCount > 0 || sector.impactScore > 0)
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 6);
  };

  const getEffectColor = (effect: string): string => {
    switch (effect) {
      case 'benefit': return 'text-green-400 bg-green-900/20';
      case 'harm': return 'text-red-400 bg-red-900/20';
      case 'mixed': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-800/20';
    }
  };

  const getIntensityColor = (score: number): string => {
    if (score >= 6) return 'bg-red-500';
    if (score >= 4) return 'bg-orange-500';
    if (score >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTimeHorizonColor = (horizon: string): string => {
    switch (horizon) {
      case 'short': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'long': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const sectors = analyzeSectors();

  if (sectors.length === 0) {
    return (
      <p className="text-sm text-gray-400">No significant sector impacts detected in the current analysis.</p>
    );
  }

  return (
    <div>
      {sectors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Primary Affected Sector</h4>
          <motion.div 
            className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-indigo-400">{sectors[0].icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-200">{sectors[0].sector}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEffectColor(sectors[0].primaryEffect)}`}>
                    {sectors[0].primaryEffect}
                  </span>
                </div>
                {sectors[0].description && (
                  <p className="text-xs text-gray-400 mt-1">{sectors[0].description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{sectors[0].stakeholderCount} stakeholder{sectors[0].stakeholderCount !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-2">
                <span>Impact:</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getIntensityColor(sectors[0].impactScore)}`}></div>
                  <span>{sectors[0].impactScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">All Affected Sectors</h4>
        {sectors.map((sector, index) => (
          <motion.div 
            key={sector.sector}
            className="flex items-center gap-3 p-3 bg-gray-700/20 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="text-gray-400">{sector.icon}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-200">{sector.sector}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getTimeHorizonColor(sector.timeHorizon)}`}></div>
                  <span className="text-xs text-gray-400">{sector.timeHorizon}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                <motion.div 
                  className={`h-1.5 rounded-full ${getIntensityColor(sector.impactScore)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((sector.impactScore / 8) * 100, 100)}%` }}
                  transition={{ delay: 0.5 + 0.1 * index, duration: 0.8 }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{sector.stakeholderCount} affected</span>
                <span className={`px-1 py-0.5 rounded text-xs ${getEffectColor(sector.primaryEffect)}`}>
                  {sector.primaryEffect}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-indigo-400">{sectors.length}</div>
            <div className="text-xs text-gray-400">Sectors Affected</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">
              {sectors.reduce((sum, s) => sum + s.stakeholderCount, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Stakeholders</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Time Horizon:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Short</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Long</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorImpactVisualization;