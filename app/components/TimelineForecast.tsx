import { motion } from 'framer-motion';
import React, { useState } from 'react';

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

interface TimelineForecastProps {
  forecast: Forecast;
}

const domainIcons = {
  economic: '💰',
  social: '👥',
  political: '🏛️',
  legal: '⚖️',
  operational: '⚙️',
};

const confidenceColors = {
  low: '#FEE140',
  medium: '#667EEA',
  high: '#84FAB0',
};

const TimelineForecast: React.FC<TimelineForecastProps> = ({
  forecast,
}) => {
  const [expandedTimeframe, setExpandedTimeframe] = useState<string | null>(null);

  const toggleExpand = (timeframe: string) => {
    setExpandedTimeframe(expandedTimeframe === timeframe ? null : timeframe);
  };

  const renderForecastDetails = (forecastArray: ForecastDetail[] | undefined) => {
    if (!forecastArray || forecastArray.length === 0) {
      return <p className="text-gray-600 dark:text-gray-400 text-sm">No detailed forecast available for this period.</p>;
    }
    return (
      <div className="space-y-3 mt-4">
        {forecastArray.map((item, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600/50 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{domainIcons[item.domain as keyof typeof domainIcons]}</span>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.domain} Impact</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Impact: {item.impact}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Direction: {item.direction}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Magnitude: {item.magnitude}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Who: {item.who?.join(', ')}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">Metrics to Track: {item.metrics_to_track?.join(', ')}</p>
            <div className="flex items-center mt-2">
              <span className="text-gray-600 dark:text-gray-400 mr-2">Confidence:</span>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${(item.confidence === 'high' ? 100 : item.confidence === 'medium' ? 60 : 30)}%`,
                    background: confidenceColors[item.confidence as keyof typeof confidenceColors],
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.confidence === 'high' ? 100 : item.confidence === 'medium' ? 60 : 30)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative py-8">
      <div className="flex justify-between items-center relative z-10">
        {['short_1y', 'medium_3y', 'long_5y'].map((timeframe) => (
          <div key={timeframe} className="flex flex-col items-center flex-1">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-2 ${expandedTimeframe === timeframe ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleExpand(timeframe)}
            >
              <span className={`font-bold text-xs ${expandedTimeframe === timeframe ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {timeframe.split('_')[0].toUpperCase()}
              </span>
            </motion.div>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{timeframe.split('_')[1]}</p>
          </div>
        ))}
      </div>
      <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"></div>

      <div className="mt-8 space-y-6">
        {expandedTimeframe === 'short_1y' && renderForecastDetails(forecast.forecasts?.short_1y)}
        {expandedTimeframe === 'medium_3y' && renderForecastDetails(forecast.forecasts?.medium_3y)}
        {expandedTimeframe === 'long_5y' && renderForecastDetails(forecast.forecasts?.long_5y)}
      </div>
    </div>
  );
};

export default TimelineForecast;